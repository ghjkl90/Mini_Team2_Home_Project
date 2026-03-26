function ResultPanel({ result }) {
  return (
    <div className="resultSection">
      <h3>Prediction Results</h3>
      <p className="result-subtitle">예측 결과</p>

      <div className="result-content">
        <p>
          <b>예상 잔여 근속 연수(잔여):</b> {result.remainYears}
        </p>
        <p>
          <b>예측 총 근속 연수:</b> {result.totalYears}
        </p>
        <p>
          <b>위험 요인 설명:</b> {result.reason}
        </p>
        <p>
          <b>퇴사 위험도 + 번아웃 위험도 고려:</b> {result.riskSummary}
        </p>
        <p
          className="result-sol"
          style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}
        >
          <b>💡 AI 추천 솔루션:</b> {result.solution}
        </p>
      </div>
    </div>
  );
}

export default ResultPanel;
