import "../css/RiskSignalCard.css";

const RiskSignalCard = ({ signals }) => {
  return (
    <div className="card-box card-bottom">
      <div className="card-header">위험 신호 요약</div>
      <div className="card-content align-left">
        {signals.map((signal) => (
          <p
            key={signal.id}
            className={
              signal.type === "title" ? "middle-score" : "small-detail"
            }
          >
            {signal.type === "title" ? "⚠️ " : "• "} {signal.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RiskSignalCard;
