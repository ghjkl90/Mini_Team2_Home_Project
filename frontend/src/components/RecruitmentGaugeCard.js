import { useMemo } from "react";
import GaugeChart from "react-gauge-chart";
import "../css/RecruitmentGaugeCard.css";

const GAUGE_CONFIG = {
  // 게이지 스타일 설정
  GRADES: {
    A: { label: "A", gColor: "#76b7f3", tColor: "#0084ff", bgColor: "#97cdff" },
    B: { label: "B", gColor: "#7dc24f", tColor: "#60c020", bgColor: "#c1ff98" },
    C: { label: "C", gColor: "#ff8585", tColor: "#ff3e3e", bgColor: "#ffb3b3" },
  },
};

const RecruitmentGaugeCard = ({ score }) => {
  const numericScore = Number(score);

  // 등급 비율 (0~100점 기준이므로 33.3 / 66.7 고정)
  const gradeInfo = useMemo(() => {
    const { GRADES } = GAUGE_CONFIG;
    if (numericScore >= 66.7) return GRADES.A;
    if (numericScore >= 33.3) return GRADES.B;
    return GRADES.C;
  }, [numericScore]);

  // 2. 게이지 비율
  const percent = numericScore / 100;

  const gaugeColors = [
    GAUGE_CONFIG.GRADES.C.gColor,
    GAUGE_CONFIG.GRADES.B.gColor,
    GAUGE_CONFIG.GRADES.A.gColor,
  ];

  return (
    <div className="recruitment-group-container">
      {/* 게이지 메인 카드 */}
      <div className="card-box recruitment-main-card">
        <div className="card-header">
          <div className="eng-title">Hiring Index</div>
          <div className="kor-subtitle">채용경쟁력 진단</div>
        </div>

        <div className="card-content recruitment-gauge-content">
          <div className="gauge-relative-box">
            <GaugeChart
              id="recruitment-gauge"
              key={`gauge-${numericScore}`}
              nrOfLevels={3}
              arcsLength={[0.333, 0.334, 0.333]}
              colors={gaugeColors}
              percent={percent}
              arcPadding={0.02}
              cornerRadius={0}
              needleColor="#495057"
              needleBaseColor="#212529"
              animate={true}
              hideText={true}
              style={{ width: "100%" }}
            />
            <span className="gauge-step-label label-c">C</span>
            <span className="gauge-step-label label-b">B</span>
            <span className="gauge-step-label label-a">A</span>

            <div className="gauge-score-overlay">
              <div className="score-wrapper">
                <span className="score-num">{numericScore.toFixed(1)}</span>
                <span className="score-unit">점</span>
              </div>
              <div
                className="grade-badge-custom"
                style={{
                  backgroundColor: gradeInfo.bgColor,
                  color: gradeInfo.tColor,
                }}
              >
                {gradeInfo.label} 등급
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 안내 카드 */}
      <div className="gauge-result-info-card">
        <p className="gauge-result-text">
          현재 기관의 채용 경쟁력은{" "}
          <strong
            className="gauge-result-highlight"
            style={{ color: gradeInfo.tColor }}
          >
            {gradeInfo.label}등급
          </strong>{" "}
          수준입니다.
        </p>
      </div>
    </div>
  );
};

export default RecruitmentGaugeCard;
