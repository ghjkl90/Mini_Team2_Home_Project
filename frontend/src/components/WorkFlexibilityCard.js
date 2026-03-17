import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../css/WorkFlexibilityCard.css";

const WorkFlexibilityCard = ({ totalData, instData, colors }) => {
  return (
    <div className="card-box card-top">
      <div className="card-header">유연근무 유형 이용현황</div>
      <div className="card-content flex-card-layout">
        <div className="flex-charts-container">
          {/* 전체 통계 도넛 */}
          <div className="flex-sub-chart">
            <p className="sub-chart-title">전체</p>
            <div className="pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {totalData.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 기관 통계 도넛 */}
          <div className="flex-sub-chart">
            <p className="sub-chart-title">기관</p>
            <div className="pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={instData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {instData.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 범례 표시 영역 */}
        <div className="flex-legend-container">
          {totalData.map((entry, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: colors[index] }}
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
