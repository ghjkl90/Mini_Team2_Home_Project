import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { fetchDashboardData } from "../api/DashboardApi"; // DB 연결시 사용

import Header from "./Header";
import "../css/Mains.css";
import "../css/Header.css";

import Forecast from "./Forecast.jsx";
import SalaryCard from "../components/SalaryCard";
import RecruitmentGaugeCard from "../components/RecruitmentGaugeCard";
import WorkFlexibilityCard from "../components/WorkFlexibilityCard";
import HealthDiagnosisCard from "../components/HealthDiagnosisCard";
import RiskSignalCard from "../components/RiskSignalCard";
import AttritionRiskCard from "../components/AttritionRiskCard";
import HRBalanceChartCard from "../components/HRBalanceChartCard";

function Mains() {
  const [instInfo, setInstInfo] = useState({
    name: "로딩 중...",
    type: "",
    ministry: "",
    region: "",
    size: "",
  });
  const [salaryData, setSalaryData] = useState([]);
  const [displayScore, setDisplayScore] = useState(0);
  const [flexDataTotal, setFlexDataTotal] = useState([]);
  const [flexDataInst, setFlexDataInst] = useState([]);
  const [healthData, setHealthData] = useState({
    score: 0,
    grade: "-",
    status: "로딩 중",
  });
  const [riskSignals, setRiskSignals] = useState([]);
  const [attritionRisk, setAttritionRisk] = useState([]);

  const FLEX_COLORS = ["#816fd3", "#6fa74b", "#ff864d"]; // 유연근무 차트 색상

  useEffect(() => {
    const loadData = async () => {
      try {
        const target = localStorage.getItem("institution") || "한전KDN"; // 로그인된 기관 || 정보 없을시 기본 기관
        const res = await fetchDashboardData(target);

        // 기관 정보 매핑
        if (res["기관정보"] && res["기관정보"].length > 0) {
          const info = res["기관정보"][0];
          setInstInfo({
            name: target,
            type: info["기관유형"],
            ministry: info["주무부처"],
            region: info["소재지"],
            size: info["임직원수"],
          });
        }

        // 1. 평균 임금 비교
        if (res["평균 임금 비교"] && res["평균 임금 비교"].length > 0) {
          const s = res["평균 임금 비교"][0];
          setSalaryData([
            { name: "전체 평균", amount: s["전체기관 직원 평균 보수"] },
            { name: "우리 기관", amount: s["직원평균보수"] },
          ]);
        }

        // 2. 채용경쟁력 진단
        if (res["채용경쟁력"] && res["채용경쟁력"].length > 0) {
          const raw = res["채용경쟁력"][0]["채용 경쟁력 점수"];

          // 15~73 범위를 0~100점으로 환산합니다.
          const display = Number((((raw - 15) / (73 - 15)) * 100).toFixed(1));
          setDisplayScore(display);
        }

        // 3. 퇴사 위험도
        if (res["분기별 퇴사위험도"] && res["분기별 퇴사위험도"].length > 0) {
          const mappedAttrition = res["분기별 퇴사위험도"].map((item) => ({
            quarter: item["분기"],
            rate:
              typeof item["분기별 퇴사위험도"] === "number"
                ? `${(item["분기별 퇴사위험도"] * 100).toFixed(0)}%`
                : item["분기별 퇴사위험도"],
          }));
          setAttritionRisk(mappedAttrition);
        }

        // 4. 유연근무 비율
        if (res["유연근무유형"] && res["유연근무유형"].length > 0) {
          const r = res["유연근무유형"][0];
          setFlexDataTotal([
            { name: "원격", value: r["전체기관 원격근무 비율"] },
            { name: "시차", value: r["전체기관 시간유연근무 비율"] },
            { name: "압축", value: r["전체기관 압축근무 비율"] },
          ]);
          setFlexDataInst([
            { name: "원격", value: r["원격근무 비율"] },
            { name: "시차", value: r["시간유연근무 비율"] },
            { name: "압축", value: r["압축근무 비율"] },
          ]);
        }

        // 5. 조직 건강도 진단
        if (res["조직 건강도"] && res["조직 건강도"].length > 0) {
          setHealthData({
            score: res["조직 건강도"][0]["조직 건강도 점수"],
            grade: res["조직 건강도"][0]["조직 건강도 수준"],
            status: "진단 완료",
          });
        }

        // 6. 조직 위험신호
        if (res["위험 신호 요약"] && res["위험 신호 요약"].length > 0) {
          const signals = res["위험 신호 요약"][0]["위험 신호 요약"]
            .split(",")
            .map((t, i) => ({
              id: i,
              text: t.trim(),
              type: i === 0 ? "title" : "detail",
            }));
          setRiskSignals(signals);
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-wrapper">
        <Routes>
          <Route path="forecast" element={<Forecast />} />
          <Route
            path="/"
            element={
              <>
                {/* 최상단 기관 정보 바 */}
                <div className="top-nav">
                  <div className="inst-name">기관명 : {instInfo.name}</div>
                  <div className="inst-meta">
                    기관유형: <p>{instInfo.type}</p>{" "}
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;주무부처:{" "}
                    <p>{instInfo.ministry}</p>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;소재지:{" "}
                    <p>{instInfo.region}</p>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;임직원수:&nbsp;
                    <p>{instInfo.size}</p>
                  </div>
                </div>

                {/* 메인 그리드 시작 */}
                <section className="info-group">
                  <div className="grid-column">
                    {salaryData.length > 0 && <SalaryCard data={salaryData} />}
                    <RecruitmentGaugeCard score={displayScore} />
                  </div>

                  {/* 중앙 컬럼 */}
                  <div className="grid-column">
                    <AttritionRiskCard data={attritionRisk} />

                    <WorkFlexibilityCard
                      totalData={flexDataTotal}
                      instData={flexDataInst}
                      colors={FLEX_COLORS}
                    />

                    <HealthDiagnosisCard data={healthData} />
                  </div>

                  {/* 오른쪽 컬럼 */}
                  <div className="grid-column">
                    <RiskSignalCard
                      signals={riskSignals}
                      rawScores={{
                        recruit: displayScore, // 채용 점수 (0~100)
                        health: healthData.score, // 건강도 점수 (0~100)
                        attrition:
                          attritionRisk.length > 0
                            ? parseFloat(
                                attritionRisk[attritionRisk.length - 1].rate,
                              )
                            : 0, // 가장 최근 분기 퇴사율 (숫자만 추출)
                      }}
                    />

                    {/* 조직 밸런스 차트 */}
                    <HRBalanceChartCard
                      salaryData={salaryData}
                      recruitmentScore={displayScore}
                      healthScore={healthData.score}
                      flexData={flexDataInst}
                      attritionRisk={attritionRisk}
                    />

                    {/* 이미지나 기타 컨텐츠 예정 */}
                    <div className="free-content-area">
                      {/* 기타 컨텐츠 들어갈 소스영역 */}
                    </div>
                  </div>
                </section>
              </>
            }
          />
          <Route path="/mains/*" element={<Navigate to="/mains" replace />} />
        </Routes>
      </main>
    </div>
  );
}
export default Mains;
