import "../css/RiskSignalCard.css";
import { AlertCircle, Zap } from "lucide-react";

const RiskSignalCard = ({ signals, rawScores }) => {
  // 데이터가 없거나 로딩 중일 때 방어 로직
  if (!signals || !rawScores || isNaN(rawScores.recruit)) return null;

  // 1. 수치에 따른 맞춤형 멘트 생성 함수
  const getDynamicTask = (id, score) => {
    switch (id) {
      case "attrition":
        if (score > 50)
          return `현재 퇴사 위험도가 ${score}%로 '위험' 수준입니다. 핵심 인력 핀셋 면담이 즉시 필요합니다.`;
        return `퇴사율 ${score}%를 관리하기 위해 부서별 조직 만족도 모니터링이 권장됩니다.`;
      case "health":
        if (score < 25)
          return `조직 건강도가 ${score}점으로 매우 심각합니다. 경영진 차원의 문화 혁신 TF 구성을 제안합니다.`;
        return `건강도 점수(${score}점) 회복을 위해 팀 단위 소통 창구 활성화가 필요합니다.`;
      case "recruit":
        if (score < 30)
          return `채용 경쟁력이 ${score}점에 불과합니다. 처우 패키지의 전면적인 재설계가 시급합니다.`;
        return `경쟁력(${score}점) 보완을 위해 실무자 중심의 채용 브랜딩 강화에 집중하세요.`;
      default:
        return "";
    }
  };

  // 2. 리스크 분석 및 우선순위 결정
  const riskAnalysis = [
    {
      id: "attrition",
      active: rawScores.attrition > 35,
      badness: rawScores.attrition * 2,
      title: "인력 이탈 방지",
      level: rawScores.attrition > 50 ? "CRITICAL" : "WARNING",
      task: getDynamicTask("attrition", rawScores.attrition),
    },
    {
      id: "health",
      active: rawScores.health < 45,
      badness: 100 - rawScores.health,
      title: "조직 운영 안정화",
      level: rawScores.health < 25 ? "CRITICAL" : "WARNING",
      task: getDynamicTask("health", rawScores.health),
    },
    {
      id: "recruit",
      active: rawScores.recruit < 45,
      badness: 100 - rawScores.recruit,
      title: "채용 경쟁력 재설계",
      level: rawScores.recruit < 30 ? "CRITICAL" : "WARNING",
      task: getDynamicTask("recruit", rawScores.recruit),
    },
  ];

  const topRisks = riskAnalysis
    .filter((r) => r.active)
    .sort((a, b) => {
      // 1순위: 등급(Level) 비교 (CRITICAL이 WARNING보다 우선)
      const levelWeight = { CRITICAL: 2, WARNING: 1 };
      if (levelWeight[b.level] !== levelWeight[a.level]) {
        return levelWeight[b.level] - levelWeight[a.level];
      }
      // 2순위: 등급이 같으면 badness(점수)가 높은 순서
      return b.badness - a.badness;
    })
    .slice(0, 1);

  const isStable = topRisks.length === 0;

  return (
    <div className="risk-summary-container border-green full-height-card">
      <div className="card-header-area">
        <h3 className="eng-title">Risk signal summary</h3>
        <p className="kor-subtitle">위험 신호 요약</p>
      </div>

      {/* 백엔드 원본 메시지 출력 영역 */}
      <div className="risk-intro-text">
        <AlertCircle className="icon-inline" />
        <div className="text-content">
          <strong>현황 분석 결과:</strong>
          <br />
          {signals.find((s) => s.type === "title")?.text ||
            "안정적인 상태입니다."}
        </div>
      </div>

      <div className="solution-section">
        <div className="ai-label">
          <Zap className="icon-zap" /> 핵심 권고사항
        </div>

        <div className="solution-stack">
          {isStable ? (
            <div className="solution-item stable">
              <div className="priority-badge-stable">EXCELLENT</div>
              <h5>✨ 우수 안정화 단계</h5>
              <p className="dynamic-task">
                현재 {rawScores.recruit}점의 채용 경쟁력과 {rawScores.attrition}
                %의 낮은 퇴사율을 기록 중입니다. 현 상태 유지를 권장합니다.
              </p>
            </div>
          ) : (
            topRisks.map((sol, idx) => (
              <div
                key={sol.id}
                className={`solution-item border-green highlight ${sol.level.toLowerCase()}`}
              >
                <div className="item-header">
                  <span className="priority-badge">위험순위 0{idx + 1}</span>
                  <span className={`status-tag ${sol.level.toLowerCase()}`}>
                    {sol.level}
                  </span>
                </div>
                <h5>{sol.title}</h5>
                <p className="dynamic-task">{sol.task}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="status-check-bar">
        <div className="pulse-dot"></div>
        <span>기관 맞춤형 알고리즘 실시간 분석 중</span>
      </div>
    </div>
  );
};

export default RiskSignalCard;
