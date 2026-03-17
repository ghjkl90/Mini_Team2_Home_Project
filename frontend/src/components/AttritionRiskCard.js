import "../css/AttritionRiskCard.css";

const AttritionRiskCard = ({ data }) => {
  return (
    <div className="card-box card-bottom">
      <div className="card-header">기관 평균 퇴사 위험도</div>
      <div className="card-content">
        <p className="middle-score2">분기별 평균 위험도</p>
        <div className="attrition-layout">
          <div className="attrition-col">
            <p className="small-detail2">
              <span className="q-label">1분기:</span>{" "}
              <span className="q-value">{data[0].rate}</span>
            </p>
            <p className="small-detail2">
              <span className="q-label">2분기:</span>{" "}
              <span className="q-value">{data[1].rate}</span>
            </p>
          </div>
          <div className="attrition-col">
            <p className="small-detail2">
              <span className="q-label">3분기:</span>{" "}
              <span className="q-value">{data[2].rate}</span>
            </p>
            <p className="small-detail2">
              <span className="q-label">4분기:</span>{" "}
              <span className="q-value">{data[3].rate}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttritionRiskCard;
