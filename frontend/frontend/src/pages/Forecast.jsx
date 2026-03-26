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
    riskSummary: "",
    solution: "",
  });

  const handlePredict = async (formData) => {
    setLoading(true);
    setProgress(0);

    const apiPayload = {
      institution: localStorage.getItem("institution") || "한전KDN",
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      tenure_years: parseFloat(formData.tenure_years),
      performance_grade: formData.performance_grade,
      workload_level: formData.workload_level,
      flexible_work: formData.flexible_work ? "Y" : "N",
    };

    let fakeProgress = 0;
    const interval = setInterval(() => {
      if (fakeProgress < 90) {
        fakeProgress += 5;
        setProgress(fakeProgress);
      }
    }, 150);

    try {
      const response = await predictEmployee(apiPayload);
      const resultData = response.data || response;
      console.log(resultData);
      const attritionRisk = Math.round(
        (resultData.quit_risk_probability || 0) * 100,
      );
      const burnoutRisk = Math.round(
        (resultData.burnout_risk_probability || 0) * 100,
      );

      setResult({
        attritionRisk,
        burnoutRisk,
        remainYears: `${resultData.expected_remaining_tenure || 0}년`,
        totalYears: `${resultData.expected_total_tenure || 0}년`,
        reason:
          (resultData.risk_factors || []).join(", ") ||
          "현재 뚜렷한 위험 요인이 감지되지 않았습니다.",
        riskSummary: resultData.raw_diagnosis || "진단 불가",
        solution:
          resultData.final_report ||
          resultData.recommendation_summary ||
          "분석 결과를 생성할 수 없습니다.",
      });

      setProgress(100);
    } catch (err) {
      console.error("예측 요청 중 에러 발생:", err);
      alert("데이터 분석 중 오류가 발생했습니다.");
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="forecast-page-root">
      <div className="forecast-page-main">
        <section className="dashboardShell">
          <div className="panel panel-input">
            <div className="leftPanel">
              <InputPanel onPredict={handlePredict} />
            </div>
          </div>

          <div className="panel panel-risk">
            <h2 className="dashboard-title">Employee Risk</h2>
            <p className="dashboard-subtitle">직원 위험도</p>

            <div className="riskSection">
              <div className="chartCard">
                <GaugeChart
                  title="Attrition Risk"
                  value={result.attritionRisk}
                />
              </div>

              <div className="chartCard">
                <GaugeChart title="Burnout Risk" value={result.burnoutRisk} />
              </div>
            </div>
          </div>

          <div className="panel panel-result">
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
              <ResultPanel result={result} />
            )}
          </div>
        </section>

        <aside className="rightPanel">
          <h3 className="guide-header">Risk Level Guide</h3>

          <section className="guide-section">
            <h4 className="guide-title">퇴사 위험도</h4>

            <p className="guide-paragraph">
              퇴사 위험도는 직원의 인구 통계 정보,
              <br />
              근속 정보, 업무 환경 변수를 기반으로
              <br />
              머신러닝 모델이 계산한 이탈 확률 지표입니다.
            </p>

            <p className="guide-paragraph guide-gap">
              평가에는 다음 주요 요인이 사용됩니다.
            </p>

            <div className="guide-list">
              <p>
                <strong>나이</strong> <span>(Age)</span>
              </p>
              <p>
                <strong>현재 근속연수</strong> <span>(Tenure)</span>
              </p>
              <p>
                <strong>성과등급</strong> <span>(Performance Grade)</span>
              </p>
              <p>
                <strong>업무강도</strong> <span>(Workload Level)</span>
              </p>
              <p>
                <strong>유연근무 사용 여부</strong> <span>(Flexible Work)</span>
              </p>
            </div>

            <p className="guide-paragraph guide-gap">
              이 변수들을 기반으로 직원의 향후
              <br />
              퇴사 가능성을 확률 형태로 예측합니다.
            </p>
          </section>

          <section className="guide-section guide-section-bottom">
            <h4 className="guide-title">번아웃 위험도</h4>

            <p className="guide-paragraph">
              번아웃 위험도는 직원의 업무 강도와 근무 환경을 중심으로 평가되는
              업무 피로도 지표입니다.
            </p>

            <p className="guide-paragraph guide-gap">
              주요 평가 요소는 다음과 같습니다.
            </p>

            <div className="guide-list">
              <p>
                <strong>업무 강도</strong> <span>(Workload Level)</span>
              </p>
              <p>
                <strong>근속 기간</strong>
              </p>
              <p>
                <strong>성과 평가</strong>
              </p>
              <p>
                <strong>유연근무 사용 여부</strong>
              </p>
            </div>

            <p className="guide-paragraph guide-gap">
              특히 다음 조건에서 번아웃
              <br />
              위험이 증가하는 경향이 있습니다.
            </p>

            <div className="guide-list">
              <p>
                <strong>업무 강도 High</strong>
              </p>
              <p>
                <strong>장기간 동일 업무 수행</strong>
              </p>
              <p>
                <strong>유연근무 미사용</strong>
              </p>
              <p>
                <strong>조직 내 업무 집중도 과다</strong>
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Forecast;
