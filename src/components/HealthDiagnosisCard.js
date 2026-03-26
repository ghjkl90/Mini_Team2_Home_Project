import "../css/HealthDiagnosisCard.css";

const HealthDiagnosisCard = ({ data }) => {
  const gradeMapping = { high: "A", medium: "B", low: "C" };
  const rawGrade = data.grade ? data.grade.toLowerCase() : "medium";
  const displayGrade = gradeMapping[rawGrade] || "B";
  const statusLevel = rawGrade.toUpperCase();

  const getGradeColorClass = (grade) => {
    if (grade === "A") return "grade-A";
    if (grade === "B") return "grade-B";
    if (grade === "C") return "grade-C";
    return "";
  };

  const gradeColorClass = getGradeColorClass(displayGrade);

  return (
    <div className="health-card-container border-green">
      <div className="health-title-area">
        <h3 className="health-eng-title">
          Organization Health Diagnosis :
          <span className="health-score-group">
            <span className="score-text"> {data.score}</span>
            <span className="score-label"> Score &nbsp;(</span>
            <span className={`grade-text ${gradeColorClass}`}>
              {displayGrade}
            </span>
            <span className="score-label">)</span>
          </span>
        </h3>
      </div>

      <div className="health-status-area">
        <p className="health-status-label">
          조직 건강도 수준 :{" "}
          <span className="health-status-value">{statusLevel}</span>
        </p>
      </div>
    </div>
  );
};

export default HealthDiagnosisCard;
