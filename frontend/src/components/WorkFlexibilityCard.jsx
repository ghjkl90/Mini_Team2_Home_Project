import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../css/WorkFlexibilityCard.css";

const WorkFlexibilityCard = ({ totalData, instData, colors }) => {
  const percentFormatter = (value) => `${(value * 100).toFixed(0)}%`;

  return (
    <div className="work-flex-card border-green">
      {/* [7-1] 상단 영문/한글 헤더 */}
      <div className="card-header-area">
        <h3 className="eng-title">Flexible Work Usage</h3>
        <p className="kor-subtitle">유연근무 유형 이용현황</p>
      </div>

      <div className="flex-card-content">
        <div className="flex-charts-container">
          {/* 전체 통계 도넛 */}
          <div className="flex-sub-chart">
            <div className="pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%" /* 도넛 두께 조절 */
                    outerRadius="90%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {totalData.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(18, 18, 18, 0.9)",
                      fontFamily: "Freesentation",
                      borderRadius: "12px",
                      border: "1px solid #74c0414f",
                      padding: "10px",
                    }}
                    formatter={(value, name) => [percentFormatter(value), name]}
                    itemStyle={{
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* 도넛 중앙 텍스트 */}
              <div className="pie-center-label">total</div>
            </div>
            <p className="sub-chart-name">전체</p>
          </div>

          {/* 기관 통계 도넛 */}
          <div className="flex-sub-chart">
            <div className="pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={instData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {instData.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(18, 18, 18, 0.9)",
                      fontFamily: "Freesentation",
                      borderRadius: "12px",
                      border: "1px solid #74c0414f",
                      padding: "10px",
                    }}
                    formatter={(value) => percentFormatter(value)}
                    itemStyle={{
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* 도넛 중앙 텍스트 */}
              <div className="pie-center-label">Institutional</div>
            </div>
            <p className="sub-chart-name">기관</p>
          </div>
        </div>

        {/* 하단 범례 영역 */}
        <div className="flex-legend-container">
          {totalData.map((entry, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span className="legend-label">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkFlexibilityCard;
