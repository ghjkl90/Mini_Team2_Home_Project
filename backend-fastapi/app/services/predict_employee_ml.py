"""
predict_employee_ml.py

공기업/공공기관 HR Risk Dashboard용 예측 함수 모듈

기능
1) 모델 로드
2) encoder 로드
3) 입력값 encoding
4) 퇴사 위험 예측
5) 예상 총근속기간 예측
6) 남은 예상 근속기간 계산
7) 번아웃 위험도(rule-based) 계산
8) 기관 평균 대비 비교
9) 위험요인 설명 반환

권장 파일 배치
- predict_employee_ml.py
- quit_risk_model.pkl
- tenure_model.pkl
- encoders.pkl
- employee_feature_table.csv
- alio_master_table.csv
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import re
import joblib
import pandas as pd
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
DEFAULT_RISK_THRESHOLD = 0.42


class HRPredictor:
    """
    프론트/백엔드 분리 구조에서 재사용 가능한 직원 예측기 클래스.

    입력 예시
    ----------
    predictor.predict(
        institution="한국전력공사",
        age=34,
        gender="M",
        tenure_years=5,
        performance_grade="A",
        workload_level="high",
        flexible_work="Y"
    )
    """

    FEATURE_ORDER = [
        "institution_size",
        "avg_salary",
        "regional_salary",
        "age",
        "gender",
        "tenure_years",
        "performance_grade",
        "workload_level",
        "flexible_work",
        "region",
    ]

    CATEGORICAL_COLS = [
        "gender",
        "performance_grade",
        "workload_level",
        "flexible_work",
        "region",
    ]

    NUMERIC_COLS = [
        "institution_size",
        "avg_salary",
        "regional_salary",
        "age",
        "tenure_years",
    ]

    def __init__(
        self,
        model_dir: Optional[Union[str, Path]] = None,
        quit_model_file: str = "quit_risk_model.pkl",
        tenure_model_file: str = "tenure_model.pkl",
        encoder_file: str = "encoders.pkl",
        employee_table_file: str = "employee_feature_table.csv",
        master_table_file: str = "alio_master_table.csv",
        risk_threshold: float = DEFAULT_RISK_THRESHOLD,
        gemini_api_key: Optional[str] = None,
        ) -> None:
        self.model_dir = Path(model_dir) if model_dir else Path(__file__).resolve().parent
        self.quit_model_path = self.model_dir / quit_model_file
        self.tenure_model_path = self.model_dir / tenure_model_file
        self.encoder_path = self.model_dir / encoder_file
        self.employee_table_path = self.model_dir / employee_table_file
        self.master_table_path = self.model_dir / master_table_file
        self.risk_threshold = float(risk_threshold)

        self.quit_model = None
        self.tenure_model = None
        self.encoders: Dict[str, Any] = {}
        self.employee_table: Optional[pd.DataFrame] = None
        self.master_table: Optional[pd.DataFrame] = None

        self.institution_lookup: Dict[str, Dict[str, Any]] = {}
        self.region_salary_lookup: Dict[str, float] = {}
        self.global_numeric_defaults: Dict[str, float] = {}
        self.institution_stat_lookup: Dict[str, Dict[str, float]] = {}

        self._load_all()
        self.gemini_api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.gemini_client = None
        self.gemini_model_name = "gemini-2.5-flash"

        if self.gemini_api_key:
            self.gemini_client = genai.Client(api_key=self.gemini_api_key)
    # =====================
    def _refine_with_gemini(
        self,
        raw_diagnosis: str,
        raw_solution: str,
        risk_factors: Optional[List[str]] = None,
    ) -> str:
        """
        Gemini를 사용해 기존 진단/권고 문구를 비즈니스 어투로 정제한다.
        API 키가 없거나 호출 실패 시에는 기본 문구를 그대로 반환한다.
        """
        if not self.gemini_client:
            return (
                f"* 최종 진단: {raw_diagnosis}\n"
                f"* 추천 솔루션: {raw_solution}"
            )

        factors_text = ", ".join(risk_factors or [])

        prompt = f"""
당신은 공공기관 HR 전문가이자 인사 컨설턴트입니다.
제공되는 기초 데이터를 바탕으로 '최종 진단'과 '추천 솔루션'을
정중한 비즈니스 어투로 재작성하세요.

[기초 데이터]
- 진단 결과: {raw_diagnosis}
- 솔루션 가이드: {raw_solution}
- 주요 위험요인: {factors_text}

[작성 규칙]
1. 사람이 실제로 분석한 것처럼 자연스럽게 작성할 것.
2. 반드시 '-습니다.', '-바람직합니다.' 등의 비즈니스 어투를 사용할 것.
3. 과장하지 말고, 입력 데이터 범위 안에서만 해석할 것.
4. 아래 양식을 정확히 지킬 것.

* 최종 진단: (1~2문장)
* 추천 솔루션: (1~2문장)
""".strip()

        try:
            response = self.gemini_client.models.generate_content(
                model=self.gemini_model_name,
                contents=prompt,
            )
            text = getattr(response, "text", None)
            if text and text.strip():
                cleaned = text.strip()

                # 마크다운 기호 제거
                cleaned = re.sub(r"\*+", "", cleaned)
                cleaned = re.sub(r"^[\-\•\s]+", "", cleaned, flags=re.MULTILINE)

                # 혹시 콜론 앞뒤 공백 이상하면 정리
                cleaned = re.sub(r"\s*:\s*", ": ", cleaned)

                # 맨 앞 불필요한 연속 줄바꿈 제거 후 하나만 유지
                cleaned = cleaned.strip()
                if not cleaned.startswith("\n"):
                    cleaned = "\n" + cleaned

                return cleaned

        except Exception as e:
            print(f"[Gemini 오류] {e}")

        return (
            f"\n**최종 진단: {raw_diagnosis}"
            f"\n**추천 솔루션: {raw_solution}"
        )
    # ======================================
    def _build_raw_diagnosis(
        self,
        quit_probability: float,
        burnout_probability: float,
        remaining_tenure: float,
        institution: str,
    ) -> str:
        inst_stats = self.institution_stat_lookup.get(institution, {})
        inst_avg_quit = float(inst_stats.get("avg_quit_probability", 0.0))

        diagnosis_parts = []

        if quit_probability >= 0.70:
            diagnosis_parts.append("퇴사위험이 높은 수준으로 확인됩니다.")
        elif quit_probability >= 0.42:
            diagnosis_parts.append("퇴사위험 관리가 필요한 수준으로 판단됩니다.")
        else:
            diagnosis_parts.append("퇴사위험은 비교적 안정적인 수준입니다.")

        if burnout_probability >= 0.70:
            diagnosis_parts.append("번아웃 위험이 높은 상태입니다.")
        elif burnout_probability >= 0.40:
            diagnosis_parts.append("번아웃 주의가 필요한 상태입니다.")
        else:
            diagnosis_parts.append("번아웃 위험은 상대적으로 낮은 편입니다.")

        if quit_probability > inst_avg_quit + 0.05:
            diagnosis_parts.append("기관 평균 대비 이탈 가능성이 높은 편입니다.")

        if remaining_tenure < 2:
            diagnosis_parts.append("예상 잔여근속기간이 짧게 산출되어 조기 이탈 가능성 점검이 필요합니다.")

        return " ".join(diagnosis_parts)
    
    # =========================

    # public
    # =========================
    def predict(
        self,
        institution: str,
        age: Union[int, float],
        gender: str,
        tenure_years: Union[int, float],
        performance_grade: str,
        workload_level: str,
        flexible_work: str,
    ) -> Dict[str, Any]:
        """
        단일 직원 예측

        Returns
        -------
        {
            "institution": ...,
            "input_features": {...},
            "quit_risk_probability": ...,
            "quit_prediction": 0 or 1,
            "quit_risk_level": "low" | "medium" | "high",
            "burnout_risk_probability": ...,
            "burnout_risk_level": "low" | "medium" | "high",
            "expected_total_tenure": ...,
            "expected_remaining_tenure": ...,
            "risk_factors": [...],
            "vs_institution_avg": {
                "quit_risk_diff": ...,
                "remaining_tenure_diff": ...,
                "expected_total_tenure_diff": ...
            }
        }
        """
        raw_features = self.build_features(
            institution=institution,
            age=age,
            gender=gender,
            tenure_years=tenure_years,
            performance_grade=performance_grade,
            workload_level=workload_level,
            flexible_work=flexible_work,
        )

        X = self._prepare_input_dataframe(raw_features)

        # 1) quit risk
        quit_probability = float(self.quit_model.predict_proba(X)[0][1])
        quit_prediction = int(quit_probability >= self.risk_threshold)

        # 2) expected tenure
        expected_total_tenure = float(self.tenure_model.predict(X)[0])
        expected_total_tenure = max(expected_total_tenure, 0.0)
        remaining_tenure = max(expected_total_tenure - float(raw_features["tenure_years"]), 0.0)

        # 3) burnout risk (rule-based)
        burnout_probability = self._calculate_burnout_probability(
            age=float(raw_features["age"]),
            tenure_years=float(raw_features["tenure_years"]),
            performance_grade=str(raw_features["performance_grade"]),
            workload_level=str(raw_features["workload_level"]),
            flexible_work=str(raw_features["flexible_work"]),
            institution=str(raw_features["institution"]),
        )

        # 4) compare with institution average
        inst_stats = self.institution_stat_lookup.get(raw_features["institution"], {})
        inst_avg_quit = float(inst_stats.get("avg_quit_probability", 0.0))
        inst_avg_expected_total = float(inst_stats.get("avg_expected_total_tenure", 0.0))
        inst_avg_remaining = float(inst_stats.get("avg_expected_remaining_tenure", 0.0))

        quit_risk_diff = quit_probability - inst_avg_quit
        expected_total_tenure_diff = expected_total_tenure - inst_avg_expected_total
        remaining_tenure_diff = remaining_tenure - inst_avg_remaining

        # 5) risk factors
        risk_factors = self._build_risk_factors(
            quit_probability=quit_probability,
            burnout_probability=burnout_probability,
            expected_total_tenure=expected_total_tenure,
            remaining_tenure=remaining_tenure,
            institution=str(raw_features["institution"]),
            age=float(raw_features["age"]),
            tenure_years=float(raw_features["tenure_years"]),
            performance_grade=str(raw_features["performance_grade"]),
            workload_level=str(raw_features["workload_level"]),
            flexible_work=str(raw_features["flexible_work"]),
        )
        recommendation_summary = self._build_recommendation_summary(
            quit_probability=quit_probability,
            burnout_probability=burnout_probability,
            flexible_work=str(raw_features["flexible_work"]),
            workload_level=str(raw_features["workload_level"]),
            risk_factors=risk_factors,
)        
        raw_diagnosis = self._build_raw_diagnosis(
            quit_probability=quit_probability,
            burnout_probability=burnout_probability,
            remaining_tenure=remaining_tenure,
            institution=str(raw_features["institution"]),
        )

        final_report = self._refine_with_gemini(
            raw_diagnosis=raw_diagnosis,
            raw_solution=recommendation_summary,
            risk_factors=risk_factors,
        )
        
        result = {
            "institution": raw_features["institution"],
            "input_features": raw_features,
            "quit_risk_probability": round(quit_probability, 4),
            "quit_prediction": quit_prediction,
            "quit_risk_level": self._to_risk_level(quit_probability),
            "burnout_risk_probability": round(burnout_probability, 4),
            "burnout_risk_level": self._to_risk_level(burnout_probability),
            "expected_total_tenure": round(expected_total_tenure, 2),
            "expected_remaining_tenure": round(remaining_tenure, 2),
            "risk_factors": risk_factors,
            "raw_diagnosis": raw_diagnosis,
            "recommendation_summary": recommendation_summary,
            "final_report": final_report,
            "quit_risk_diff": round(quit_risk_diff, 4),
            "expected_total_tenure_diff": round(expected_total_tenure_diff, 2),
            "remaining_tenure_diff": round(remaining_tenure_diff, 2),
            "institution_avg_quit_risk": round(inst_avg_quit, 4),
        }
        
        return result

    def predict_from_dict(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return self.predict(
            institution=payload["institution"],
            age=payload["age"],
            gender=payload["gender"],
            tenure_years=payload["tenure_years"],
            performance_grade=payload["performance_grade"],
            workload_level=payload["workload_level"],
            flexible_work=payload["flexible_work"],
        )

    def build_features(
        self,
        institution: str,
        age: Union[int, float],
        gender: str,
        tenure_years: Union[int, float],
        performance_grade: str,
        workload_level: str,
        flexible_work: str,
    ) -> Dict[str, Any]:
        institution = str(institution).strip()
        if institution not in self.institution_lookup:
            sample = list(self.institution_lookup.keys())[:10]
            raise ValueError(
                f"알 수 없는 institution 입니다: {institution!r}. "
                f"등록된 기관 예시: {sample}"
            )

        base = self.institution_lookup[institution].copy()

        region = base["region"]
        regional_salary = base.get("regional_salary")
        if pd.isna(regional_salary) or regional_salary is None:
            regional_salary = self.region_salary_lookup.get(
                region, self.global_numeric_defaults["regional_salary"]
            )

        features = {
            "institution": institution,
            "region": region,
            "institution_size": self._safe_float(
                base.get("institution_size"), self.global_numeric_defaults["institution_size"]
            ),
            "avg_salary": self._safe_float(
                base.get("avg_salary"), self.global_numeric_defaults["avg_salary"]
            ),
            "regional_salary": self._safe_float(
                regional_salary, self.global_numeric_defaults["regional_salary"]
            ),
            "age": self._safe_float(age, self.global_numeric_defaults["age"]),
            "gender": self._normalize_category("gender", gender),
            "tenure_years": self._safe_float(
                tenure_years, self.global_numeric_defaults["tenure_years"]
            ),
            "performance_grade": self._normalize_category("performance_grade", performance_grade),
            "workload_level": self._normalize_category("workload_level", workload_level),
            "flexible_work": self._normalize_category("flexible_work", flexible_work),
        }
        return features

    # =========================
    # loading
    # =========================
    def _load_all(self) -> None:
        self.quit_model = joblib.load(self.quit_model_path)
        self.tenure_model = joblib.load(self.tenure_model_path)
        self.encoders = joblib.load(self.encoder_path)

        if self.employee_table_path.exists():
            self.employee_table = pd.read_csv(self.employee_table_path)

        if self.master_table_path.exists():
            self.master_table = pd.read_csv(self.master_table_path)

        self._build_lookup_tables()

    def _build_lookup_tables(self) -> None:
        if self.employee_table is None:
            raise FileNotFoundError(
                f"employee_feature_table 파일을 찾을 수 없습니다: {self.employee_table_path}"
            )

        emp = self.employee_table.copy()

        required_emp_cols = {
            "institution",
            "region",
            "institution_size",
            "avg_salary",
            "regional_salary",
            "quit_probability",
            "expected_total_tenure",
            "tenure_years",
        }
        missing = required_emp_cols - set(emp.columns)
        if missing:
            raise ValueError(f"employee_feature_table.csv 필수 컬럼 누락: {sorted(missing)}")

        emp["tenure_years"] = pd.to_numeric(emp["tenure_years"], errors="coerce")
        emp["quit_probability"] = pd.to_numeric(emp["quit_probability"], errors="coerce")
        emp["expected_total_tenure"] = pd.to_numeric(emp["expected_total_tenure"], errors="coerce")
        emp["expected_remaining_tenure"] = (
            emp["expected_total_tenure"] - emp["tenure_years"]
        ).clip(lower=0)

        # 기관 기본 feature lookup
        inst_agg = (
            emp.groupby("institution", as_index=False)
            .agg(
                region=("region", "first"),
                institution_size=("institution_size", "median"),
                avg_salary=("avg_salary", "median"),
                regional_salary=("regional_salary", "median"),
            )
        )

        lookup = {
            row["institution"]: {
                "region": row["region"],
                "institution_size": row["institution_size"],
                "avg_salary": row["avg_salary"],
                "regional_salary": row["regional_salary"],
            }
            for _, row in inst_agg.iterrows()
        }

        # 기관 평균 통계 lookup
        inst_stats = (
            emp.groupby("institution", as_index=False)
            .agg(
                avg_quit_probability=("quit_probability", "mean"),
                avg_expected_total_tenure=("expected_total_tenure", "mean"),
                avg_expected_remaining_tenure=("expected_remaining_tenure", "mean"),
            )
        )

        self.institution_stat_lookup = {
            row["institution"]: {
                "avg_quit_probability": float(row["avg_quit_probability"]),
                "avg_expected_total_tenure": float(row["avg_expected_total_tenure"]),
                "avg_expected_remaining_tenure": float(row["avg_expected_remaining_tenure"]),
            }
            for _, row in inst_stats.iterrows()
        }

        # master 테이블이 있으면 보조적으로 merge
        if self.master_table is not None:
            master = self.master_table.copy()
            rename_map = {
                "기관명": "institution",
                "소재지": "region",
                "임직원수": "institution_size",
                "직원평균보수": "avg_salary",
            }
            master = master.rename(columns=rename_map)

            if {"institution", "region", "institution_size", "avg_salary"}.issubset(master.columns):
                master = master[["institution", "region", "institution_size", "avg_salary"]].copy()
                for _, row in master.iterrows():
                    inst = row["institution"]
                    if inst not in lookup:
                        lookup[inst] = {
                            "region": row["region"],
                            "institution_size": row["institution_size"],
                            "avg_salary": row["avg_salary"],
                            "regional_salary": None,
                        }

        self.institution_lookup = lookup

        region_salary = emp.groupby("region")["regional_salary"].median().to_dict()
        self.region_salary_lookup = {str(k): float(v) for k, v in region_salary.items()}

        self.global_numeric_defaults = {
            "institution_size": float(pd.to_numeric(emp["institution_size"], errors="coerce").median()),
            "avg_salary": float(pd.to_numeric(emp["avg_salary"], errors="coerce").median()),
            "regional_salary": float(pd.to_numeric(emp["regional_salary"], errors="coerce").median()),
            "age": float(pd.to_numeric(emp.get("age"), errors="coerce").median()),
            "tenure_years": float(pd.to_numeric(emp.get("tenure_years"), errors="coerce").median()),
        }

    # =========================
    # preprocessing
    # =========================
    def _prepare_input_dataframe(self, features: Dict[str, Any]) -> pd.DataFrame:
        X = pd.DataFrame([{col: features[col] for col in self.FEATURE_ORDER}])

        for col in self.NUMERIC_COLS:
            X[col] = pd.to_numeric(X[col], errors="coerce").fillna(self.global_numeric_defaults[col])

        for col in self.CATEGORICAL_COLS:
            value = str(X.loc[0, col]).strip()
            encoder = self.encoders[col]
            classes = set(map(str, encoder.classes_))
            if value not in classes:
                raise ValueError(
                    f"{col} 값 {value!r} 은(는) 학습에 없던 값입니다. "
                    f"허용값: {list(map(str, encoder.classes_))}"
                )
            X[col] = encoder.transform(X[col].astype(str))

        return X

    def _normalize_category(self, col: str, value: Any) -> str:
        value_str = str(value).strip()

        if col == "gender":
            mapping = {
                "m": "M", "male": "M", "남": "M", "남성": "M", "M": "M",
                "f": "F", "female": "F", "여": "F", "여성": "F", "F": "F",
            }
            normalized = mapping.get(value_str, mapping.get(value_str.lower(), value_str))
            return self._validate_category(col, normalized)

        if col == "flexible_work":
            mapping = {
                "y": "Y", "yes": "Y", "1": "Y", "true": "Y", "사용": "Y", "가능": "Y", "Y": "Y",
                "n": "N", "no": "N", "0": "N", "false": "N", "미사용": "N", "불가": "N", "N": "N",
            }
            normalized = mapping.get(value_str, mapping.get(value_str.lower(), value_str))
            return self._validate_category(col, normalized)

        if col == "performance_grade":
            normalized = value_str.upper()
            return self._validate_category(col, normalized)

        if col == "workload_level":
            mapping = {
                "high": "high", "높음": "high", "상": "high",
                "medium": "medium", "보통": "medium", "중": "medium",
                "low": "low", "낮음": "low", "하": "low",
            }
            normalized = mapping.get(value_str, mapping.get(value_str.lower(), value_str))
            return self._validate_category(col, normalized)

        return self._validate_category(col, value_str)

    def _validate_category(self, col: str, value: str) -> str:
        allowed = set(map(str, self.encoders[col].classes_))
        if value not in allowed:
            raise ValueError(f"{col} 값 {value!r} 이 허용 범위를 벗어났습니다. 허용값: {sorted(allowed)}")
        return value

    # =========================
    # derived metrics
    # =========================
    def _calculate_burnout_probability(
        self,
        age: float,
        tenure_years: float,
        performance_grade: str,
        workload_level: str,
        flexible_work: str,
        institution: str,
    ) -> float:
        """
        번아웃 위험도는 1차 MVP에서 rule-based로 계산한다.
        최종 범위: 0.0 ~ 1.0
        """

        score = 0.0

        # 1) 업무강도
        workload_map = {
            "low": 0.10,
            "medium": 0.30,
            "high": 0.55,
        }
        score += workload_map.get(workload_level, 0.30)

        # 2) 유연근무 사용 여부
        if flexible_work == "N":
            score += 0.15
        else:
            score -= 0.05

        # 3) 성과 압박
        # A등급이 항상 나쁘다는 뜻은 아니지만, MVP에서는 성과 압박 가능성으로 약하게 반영
        perf_map = {
            "A": 0.10,
            "B": 0.06,
            "C": 0.03,
            "D": 0.08,
        }
        score += perf_map.get(performance_grade, 0.05)

        # 4) 근속 피로감
        if tenure_years >= 15:
            score += 0.12
        elif tenure_years >= 8:
            score += 0.08
        elif tenure_years >= 3:
            score += 0.04

        # 5) 연령 보정
        if age < 25:
            score += 0.03
        elif age >= 50:
            score += 0.03

        # 6) 기관 환경 보정
        inst_avg_quit = self.institution_stat_lookup.get(institution, {}).get("avg_quit_probability", 0.0)
        if inst_avg_quit >= 0.55:
            score += 0.10
        elif inst_avg_quit >= 0.40:
            score += 0.06
        elif inst_avg_quit < 0.25:
            score -= 0.03

        return self._clamp(score, 0.0, 1.0)

    def _build_risk_factors(
        self,
        quit_probability: float,
        burnout_probability: float,
        expected_total_tenure: float,
        remaining_tenure: float,
        institution: str,
        age: float,
        tenure_years: float,
        performance_grade: str,
        workload_level: str,
        flexible_work: str,
    ) -> List[str]:
        factors: List[str] = []

        inst_stats = self.institution_stat_lookup.get(institution, {})
        inst_avg_quit = float(inst_stats.get("avg_quit_probability", 0.0))
        inst_avg_remaining = float(inst_stats.get("avg_expected_remaining_tenure", 0.0))

        if workload_level == "high":
            factors.append("업무강도가 높음")

        if flexible_work == "N":
            factors.append("유연근무를 사용하지 않음")

        if performance_grade == "A":
            factors.append("성과 압박 가능성이 높음")

        if tenure_years >= 15:
            factors.append("장기 근속 구간으로 피로 누적 가능성 있음")
        elif tenure_years < 2:
            factors.append("초기 적응 구간에 해당함")

        if quit_probability >= self.risk_threshold:
            factors.append("퇴사위험도가 기준치를 초과함")

        if quit_probability > inst_avg_quit + 0.05:
            factors.append("기관 평균 대비 퇴사위험도가 높음")

        if remaining_tenure < max(inst_avg_remaining - 1.0, 0):
            factors.append("기관 평균 대비 예상 잔여근속이 낮음")

        if burnout_probability >= 0.70:
            factors.append("번아웃 위험도가 높음")
        elif burnout_probability >= 0.40:
            factors.append("번아웃 주의가 필요한 수준임")

        if age < 25:
            factors.append("저연령 초기 커리어 구간임")

        # 중복 제거 + 최대 5개 제한
        deduped: List[str] = []
        for item in factors:
            if item not in deduped:
                deduped.append(item)

        if not deduped:
            deduped.append("현재 입력 기준에서는 뚜렷한 고위험 신호가 크지 않음")

        return deduped[:5]

    def _build_recommendation_summary(
        self,
        quit_probability: float,
        burnout_probability: float,
        flexible_work: str,
        workload_level: str,
        risk_factors: list[str],
    ) -> str:
        messages = []

        if quit_probability >= 0.70:
            messages.append("퇴사위험이 높은 수준이므로 면담 우선순위를 높여 원인 점검이 필요합니다.")
        elif quit_probability >= 0.42:
            messages.append("퇴사위험 관리 대상으로 정기 모니터링을 수행하는 것이 좋습니다.")

        if burnout_probability >= 0.70:
            messages.append("번아웃 위험이 높아 업무부하 조정과 휴식 보장이 우선적으로 필요합니다.")
        elif burnout_probability >= 0.40:
            messages.append("번아웃 완화를 위해 업무 분산과 역할 재조정을 검토할 필요가 있습니다.")

        if flexible_work == "N":
            messages.append("가능하다면 유연근무 활용 여부를 함께 검토하는 것이 바람직합니다.")

        if workload_level == "high":
            messages.append("현재 업무강도가 높은 편이므로 단기적인 부담 완화 방안 검토가 필요합니다.")

        if not messages:
            messages.append("현재는 즉각적인 개입보다 정기적인 상태 점검 중심으로 관리하면 됩니다.")

        deduped = []
        for msg in messages:
            if msg not in deduped:
                deduped.append(msg)

        return " ".join(deduped[:4])

    def _to_risk_level(self, probability: float) -> str:
        if probability < 0.42:
            return "C"
        if probability < 0.69:
            return "B"
        return "A"

    @staticmethod
    def _safe_float(value: Any, default: float) -> float:
        try:
            if pd.isna(value):
                return float(default)
            return float(value)
        except Exception:
            return float(default)

    @staticmethod
    def _clamp(value: float, min_value: float = 0.0, max_value: float = 1.0) -> float:
        return max(min_value, min(float(value), max_value))


# =========================
# module-level helpers
# =========================
_DEFAULT_PREDICTOR: Optional[HRPredictor] = None


def get_predictor(model_dir: Optional[Union[str, Path]] = None) -> HRPredictor:
    global _DEFAULT_PREDICTOR
    if _DEFAULT_PREDICTOR is None:
        _DEFAULT_PREDICTOR = HRPredictor(model_dir=model_dir)
    return _DEFAULT_PREDICTOR


def predict_employee(
    institution: str,
    age: Union[int, float],
    gender: str,
    tenure_years: Union[int, float],
    performance_grade: str,
    workload_level: str,
    flexible_work: str,
    model_dir: Optional[Union[str, Path]] = None,
) -> Dict[str, Any]:
    predictor = get_predictor(model_dir=model_dir)
    return predictor.predict(
        institution=institution,
        age=age,
        gender=gender,
        tenure_years=tenure_years,
        performance_grade=performance_grade,
        workload_level=workload_level,
        flexible_work=flexible_work,
    )


if __name__ == "__main__":
    predictor = HRPredictor()

    sample_institution = next(iter(predictor.institution_lookup.keys()))
    result = predictor.predict(
        institution=sample_institution,
        age=34,
        gender="M",
        tenure_years=5,
        performance_grade="A",
        workload_level="high",
        flexible_work="Y",
    )

    print("=== prediction result ===")
    for k, v in result.items():
        print(f"{k}: {v}")