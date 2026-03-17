import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { fetchDashboardData } from "../api/DashboardApi"; // DB 연결시 사용

import Header from "./Header";
import Footer from "./Footer";
import "../css/Mains.css";
import "../css/Header.css";
import "../css/Footer.css";

import Forecast from "./Forecast.jsx";
import SalaryCard from "../components/SalaryCard";
import RecruitmentGaugeCard from "../components/RecruitmentGaugeCard";
import WorkFlexibilityCard from "../components/WorkFlexibilityCard";
import HealthDiagnosisCard from "../components/HealthDiagnosisCard";
import RiskSignalCard from "../components/RiskSignalCard";
import AttritionRiskCard from "../components/AttritionRiskCard";

function Mains() {
  // ##### DB 연결시 아래 주석 처리된 부분으로 사용 #####
  const [instInfo, setInstInfo] = useState({
    name: "로딩 중...",
    type: "",
    ministry: "",
    region: "",
    size: "",
  });
  const [salaryData, setSalaryData] = useState([]);
  const [score, setScore] = useState(0);
  const [flexDataTotal, setFlexDataTotal] = useState([]);
  const [flexDataInst, setFlexDataInst] = useState([]);
  const [healthData, setHealthData] = useState({
    score: 0,
    grade: "-",
    status: "로딩 중",
  });
  const [riskSignals, setRiskSignals] = useState([]);
  const [attritionRisk, setAttritionRisk] = useState([]);

  const FLEX_COLORS = ["#138f78", "#ff28ed", "#3b3db9", "#296619"];
  const gaugeColor = ["#ff0000", "#048300", "#001aff"];

  useEffect(() => {
    const loadData = async () => {
      try {
        const target = "한전KDN"; // 조회할 기관명
        const res = await fetchDashboardData(target);

        // 1. 기관 정보 매핑
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

        // 2. 급여 데이터 매핑
        if (res["평균 임금 비교"] && res["평균 임금 비교"].length > 0) {
          const s = res["평균 임금 비교"][0];
          setSalaryData([
            { name: "전체 평균", amount: s["전체기관 직원 평균 보수"] },
            { name: "우리 기관", amount: s["직원평균보수"] },
          ]);
        }

        // 3. 채용경쟁력 점수
        if (res["채용경쟁력"] && res["채용경쟁력"].length > 0) {
          setScore(res["채용경쟁력"][0]["채용 경쟁력 점수"]);
        }

        // 4. 유연근무 비율
        if (res["유연근무유형"] && res["유연근무유형"].length > 0) {
          const r = res["유연근무유형"][0];
          setFlexDataTotal([
            { name: "원격", value: r["전체기관 원격근무 비율"] },
            { name: "시차", value: r["전체기관 시간유연근무 비율"] },
            { name: "압축", value: r["전체기관 압축근무 비율"] },
            // { name: "기타", value: 10 },
          ]);
          setFlexDataInst([
            { name: "원격", value: r["원격근무 비율"] },
            { name: "시차", value: r["시간유연근무 비율"] },
            { name: "압축", value: r["압축근무 비율"] },
            // { name: "기타", value: 10 },
          ]);
        }

        // 5. 건강도 및 위험신호
        if (res["조직 건강도"] && res["조직 건강도"].length > 0) {
          setHealthData({
            score: res["조직 건강도"][0]["조직 건강도 점수"],
            grade: res["조직 건강도"][0]["조직 건강도 수준"],
            status: "진단 완료",
          });
        }

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

        // 6. 퇴사 위험도 (리더님이 물어보신 핵심 수정 구간!)
        if (res["분기별 퇴사위험도"] && res["분기별 퇴사위험도"].length > 0) {
          const mappedAttrition = res["분기별 퇴사위험도"].map((item) => ({
            // 백엔드 SQL에서 AS로 설정한 한글 키값을 사용합니다.
            quarter: item["분기"],
            // 숫자로 올 경우 %를 붙여주고, 이미 "22%" 형태라면 그대로 사용합니다.
            rate:
              typeof item["분기별 퇴사위험도"] === "number"
                ? `${(item["분기별 퇴사위험도"] * 100).toFixed(0)}%`
                : item["분기별 퇴사위험도"],
          }));
          setAttritionRisk(mappedAttrition);
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };

    loadData();
  }, []);

  // 등급 정보 계산 함수
  const getGradeInfo = (val) => {
    if (val >= 66.6)
      return { label: "A", color: "#001aff", bgColor: "#5f6fff" };
    if (val >= 33.3)
      return { label: "B", color: "#048300", bgColor: "#8aff86" };
    return { label: "C", color: "#ff0000", bgColor: "#ff5f5f" };
  };
  const gradeInfo = getGradeInfo(score);

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
                <div className="top-nav">
                  <div className="inst-name">기관명: {instInfo.name}</div>
                  <div className="inst-meta">
                    기관유형: {instInfo.type} | 주무부처: {instInfo.ministry} |
                    소재지: {instInfo.region} | 임직원수: {instInfo.size}
                  </div>
                </div>

                <section className="info-group">
                  {salaryData.length > 0 ? (
                    <SalaryCard data={salaryData} />
                  ) : (
                    <div className="loading-placeholder">
                      급여 데이터 로드 중...
                    </div>
                  )}
                  <RecruitmentGaugeCard
                    score={score}
                    gradeInfo={gradeInfo}
                    gaugeColor={gaugeColor}
                  />
                  <WorkFlexibilityCard
                    totalData={flexDataTotal}
                    instData={flexDataInst}
                    colors={FLEX_COLORS}
                  />
                </section>

                <section className="info-group">
                  <HealthDiagnosisCard data={healthData} />
                  <RiskSignalCard signals={riskSignals} />
                  {attritionRisk && attritionRisk.length > 0 ? (
                    <AttritionRiskCard data={attritionRisk} />
                  ) : (
                    <div className="loading-text" style={{ color: "#fff" }}>
                      퇴사 데이터 로딩 중...
                    </div>
                  )}
                </section>
              </>
            }
          />
          <Route path="/mains/*" element={<Navigate to="/mains" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default Mains;
