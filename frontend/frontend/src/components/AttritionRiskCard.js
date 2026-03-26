import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import "../css/AttritionRiskCard.css";

// 24년도 전체기관 평균 퇴사위험도(시간상 백엔드에 기능구현이 안되어 계산된 값으로 넣음)
const TOTAL_AVERAGE = 37;

const AttritionRiskCard = ({ data }) => {
  if (!data || data.length < 1) return null;

  const chartData = data.map((item) => {
    const qMatch = item.quarter.match(/\d(?=[^\d]*$)/);
    const qNum = qMatch ? qMatch[0] : "1";

    return {
      qShort: `Q${qNum}`, // X축 노출용: "Q3"
      qFull: `${qNum}분기`, // 툴팁 노출용: "3분기"
      value: parseFloat(item.rate.replace("%", "")),
    };
  });

  // 가장 마지막 구간 데이터
  const lastInstData = chartData[chartData.length - 1];

  // 전체 평균과 비교 결과
  let resultText = "";
  let resultClass = "";

  if (lastInstData.value > TOTAL_AVERAGE) {
    resultText = "전체 평균 대비 높은편 입니다";
    resultClass = "text-higher";
  } else if (lastInstData.value < TOTAL_AVERAGE) {
    resultText = "전체 평균 대비 낮은편 입니다";
    resultClass = "text-lower";
  } else {
    resultText = "전체 평균 대비 동일합니다";
    resultClass = "text-equal";
  }

  return (
    <div className="attrition-main-card border-green">
      {/* 1. 최상단 영문 타이틀 */}
      <div className="card-header-area">
        <h3 className="eng-title">Average risk of leaving the company</h3>
        <div className="card-header-sub">
          <p className="info-label">기관 평균 퇴사 위험도 안내</p>
          <p className="info-description">
            본 지표는 구성원 개별 퇴사 위험도 [AI 머신러닝(ML) 예측값] 의
            평균이며,
            <br />
            나이·근속·업무강도·유연근무등 데이터를 기반으로 계산되었습니다.
          </p>
        </div>
      </div>

      {/* 박스 내부의 안내 구역*/}
      <div className="attrition-sub-info-box">
        <p className="info-main">
          기관 평균 퇴사 위험도가{" "}
          <strong className={resultClass}>{resultText}</strong>.
        </p>
      </div>

      {/* 차트 영역 */}
      <div className="attrition-chart-content">
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot dot-total"></span>
            전체
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-inst"></span>
            기관
          </div>
        </div>

        <div className="attrition-chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 50, left: 40, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#618b18"
              />
              <XAxis dataKey="qShort" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
                domain={[15, 60]} // Y 축 0% ~ 100% 범위
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 18, 18, 0.9)",
                  fontFamily: "Freesentation",
                  borderRadius: "12px",
                  border: "1px solid #74c0414f",
                  padding: "10px",
                }}
                // 1분기, 2분기 등 라벨 글자색
                labelStyle={{
                  color: "#ffffff",
                  marginBottom: "4px",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: "#88f83d", fontSize: "15px" }}
                labelFormatter={(label, payload) => {
                  return payload && payload[0]
                    ? payload[0].payload.qFull
                    : label;
                }}
                formatter={(val) => [`${val}%`, "기관 위험도"]}
              />
              {/* 전체 평균 */}
              <ReferenceLine
                y={TOTAL_AVERAGE}
                stroke="#f25c5c"
                strokeWidth={2}
                label={(props) => (
                  <text
                    x={props.viewBox.x}
                    y={props.viewBox.y}
                    fill="#f25c5c"
                    dy={5} // 위아래 위치
                    dx={-93} // 좌우 위치
                    fontSize={15}
                    fontWeight={800}
                    fontFamily="Freesentation"
                  >
                    전체평균(37%)
                  </text>
                )}
              />
              {/* 기관 데이터 라인 */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#74c041"
                strokeWidth={3}
                dot={{ r: 5, fill: "#74c041", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AttritionRiskCard;
