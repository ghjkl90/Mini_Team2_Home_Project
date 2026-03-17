function ResultPanel({ result }) {
  // 결과값이 아직 없을 때 (초기 상태) 표시 (DB 연결시 사용)
  if (!result.remainYears && !result.reason) {
    return (
      <div className="resultSection empty">
        <p>
          왼쪽에서 직원 정보를 입력한 후 <br />
          [결과보기] 버튼을 눌러주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="resultSection">
      <h3>AI 예측 분석 리포트</h3>
      <div className="result-content">
        <p>
          <b>예상 잔여 근속:</b> {result.remainYears}
        </p>
        <p>
          <b>예상 총 근속:</b> {result.totalYears}
        </p>
        <p>
          <b>주요 위험 요인:</b>{" "}
          <span className="highlight">{result.reason}</span>
        </p>

        <div className="solution-box">
          <strong>💡 AI 추천 솔루션</strong>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
            {result.solution.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultPanel;
