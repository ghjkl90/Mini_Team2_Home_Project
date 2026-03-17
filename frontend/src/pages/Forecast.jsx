import "../css/Forecast.css";
import { useState } from "react";

import GaugeChart from "../components/GaugeChart.jsx";
import InputPanel from "../components/InputPanel.jsx";
import ResultPanel from "../components/ResultPanel.jsx";

import { predictEmployee } from "../api/PredictApi.js";

function Forecast() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState({
    attritionRisk: 0,
    burnoutRisk: 0,
    remainYears: "",
    totalYears: "",
    reason: "",
    solution: "",
  });

  const handlePredict = async (formData) => {
    setLoading(true);
    setProgress(0);

    const apiPayload = {
      institution: "한전KDN", // 기본값 설정 (로그인 한 값으로 받게 수정해야 함)
      age: parseInt(formData.age),
      gender: formData.gender,
      tenure_years: parseFloat(formData.workYears),
      performance_grade: formData.grade.toUpperCase(),
      workload_level: formData.workLoad,
      flexible_work: formData.flexWork ? "Y" : "N",
    };

    let fakeProgress = 0;
    const interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += 5;
        setProgress(fakeProgress);
      }
    }, 150);

    try {
      // 백엔드 API 호출
      const response = await predictEmployee(apiPayload);
      const resultData = response.data || response;

      setResult({
        // 확률값(0.0~1.0)을 점수(0~100)로 변환
        attritionRisk: Math.round(
          (resultData.quit_risk_probability || 0) * 100,
        ),
        burnoutRisk: Math.round(
          (resultData.burnout_risk_probability || 0) * 100,
        ),

        // 근속연수 포맷팅
        remainYears: (resultData.expected_remaining_tenure || 0) + "년",
        totalYears: (resultData.expected_total_tenure || 0) + "년",

        // 위험 요인 리스트를 쉼표로 연결된 문자열로 변환
        reason: (resultData.risk_factors || []).join(", "),

        // 솔루션(백엔드에서 값을 가져와 출력) || 뒷부분 문장은 데이터 값을 못받아올 때 출력
        solution:
          resultData.recommendation_summary ||
          "현재 입력 기준에서는 뚜렷한 위험 신호가 확인되지 않았습니다.",
      });

      setProgress(100);
    } catch (err) {
      console.error("예측 요청 중 에러 발생:", err);
      alert("데이터 분석 중 오류가 발생했습니다.");
    }

    clearInterval(interval);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="forecast-page-root">
      <div className="forecast-page-main">
        {/* 입력 패널 */}
        <InputPanel onPredict={handlePredict} />

        <div className="centerPanel">
          <div className="riskSection">
            <div className="chartCard">
              <GaugeChart title="퇴사 위험도" value={result.attritionRisk} />
            </div>
            <div className="chartCard">
              <GaugeChart title="번아웃 위험도" value={result.burnoutRisk} />
            </div>
          </div>

          {loading ? (
            <div className="loadingBox">
              <p>AI 예측 분석 진행중...</p>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p>{progress}%</p>
            </div>
          ) : (
            /* 결과 패널 */
            <ResultPanel result={result} />
          )}
        </div>

        {/* 오른쪽 가이드 패널 */}
        <div className="rightPanel">
          <h3 className="guide-header">📊 등급 가이드</h3>
          <div className="guide-item">
            <h4 className="guide-title">🏃‍♂️ 퇴사 위험도</h4>
            <p className="guide-formula">나이+근속+성과+강도+유연근무</p>
            <div className="grade-box high">
              <strong>A (70 👆) 고위험</strong>
              <span>면담 및 업무 조정 즉시 필요</span>
            </div>
            <div className="grade-box warning">
              <strong>B (40 ~ 69) 주의</strong>
              <span>이탈 예방을 위한 소통 강화</span>
            </div>
            <div className="grade-box stable">
              <strong>C (40 👇) 안정</strong>
              <span>정기 점검 및 현 상태 유지</span>
            </div>
          </div>
          <hr className="divider" />
          <div className="guide-item">
            <h4 className="guide-title">🔥 번아웃 위험도</h4>
            <p className="guide-formula">강도+근속+성과+유연근무</p>
            <div className="grade-box high">
              <strong>A (70 👆) 고위험</strong>
              <span>업무 분산 및 강제 휴식 권고</span>
            </div>
            <div className="grade-box warning">
              <strong>B (40 ~ 69) 주의</strong>
              <span>업무 부담 누적, 예방 관리</span>
            </div>
            <div className="grade-box stable">
              <strong>C (40 👇) 안정</strong>
              <span>건강한 업무 균형 유지 중</span>
            </div>
          </div>
          <div className="insight-card">
            <p>
              💡 <b>대시보드 인사이트</b>
            </p>
            <span>
              *번아웃 위험이 높을수록 퇴사 확률이 급증합니다. 두 지표를 통합
              관리하세요.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Forecast;
