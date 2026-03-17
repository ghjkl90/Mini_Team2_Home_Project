import "../css/HealthDiagnosisCard.css";

const HealthDiagnosisCard = ({ data }) => {
  return (
    <div className="card-box card-bottom">
      <div className="card-header">조직 건강도 진단</div>
      <div className="card-content">
        <p className="big-score">
          <span className="num-highlight">{data.score}점</span>
          <span className="grade-highlight"> ({data.grade})</span>
        </p>
        <p className="bottom-text">
          수준: <span className="status-text">{data.status}</span>
        </p>
      </div>
    </div>
  );
};

export default HealthDiagnosisCard;
