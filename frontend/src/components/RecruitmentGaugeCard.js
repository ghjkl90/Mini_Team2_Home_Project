import GaugeChart from "react-gauge-chart";
import "../css/RecruitmentGaugeCard.css";

const RecruitmentGaugeCard = ({ score, gradeInfo }) => {
  const gaugeColor = ["#ff0000", "#048300", "#001aff"];

  return (
    <div className="card-box card-top">
      <div className="card-header">채용경쟁력 진단</div>
      <div className="card-content dark-gauge-bg">
        <div className="gauge-container">
          <GaugeChart
            id="recruitment-gauge"
            key={`gauge-${score}`}
            nrOfLevels={3}
            arcsLength={[0.333, 0.334, 0.333]}
            colors={gaugeColor}
            percent={score / 100}
            arcPadding={0.02}
            cornerRadius={0}
            needleColor="#575757"
            needleBaseColor="#000000"
            animate={true}
            hideText={true}
          />
          <span className="gauge-step-label label-c">C</span>
          <span className="gauge-step-label label-b">B</span>
          <span className="gauge-step-label label-a">A</span>

          <div className="gauge-overlay">
            <div className="score-text-small">
              {score}
              <span className="score-unit-small"> 점</span>
            </div>
            <div
              className="grade-badge"
              style={{ backgroundColor: gradeInfo.bgColor, color: "#fff" }}
            >
              {gradeInfo.label} 등급
            </div>
          </div>
        </div>
        <p className="gauge-result-text">
          현재 기관의 채용 경쟁력은{" "}
          <strong
            className="gauge-result-text2"
            style={{ color: gradeInfo.color }}
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
