import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "../css/SalaryCard.css";

const SalaryCard = ({ data }) => {
  const diff = Math.round(data[1].amount - data[0].amount);
  const isHigher = diff >= 0;

  const maxAmount = Math.max(data[0].amount, data[1].amount);
  const tickStep = 15000;

  let maxTick = Math.ceil(maxAmount / tickStep) * tickStep;
  if (maxTick - maxAmount < 15000) {
    maxTick += tickStep;
  }

  const customTicks = [];
  for (let i = 0; i <= maxTick; i += tickStep) {
    customTicks.push(i);
  }
  return (
    <>
      {/* [2번 구역] 차트 카드 박스 */}
      <div className="card-box card-top salary-main-card">
        <div className="card-header">
          <div className="eng-title">Average Wage Comparison</div>
          <div className="kor-subtitle">평균 임금 비교</div>
        </div>
        <div className="card-content salary-card">
          <div className="salary-chart-inner">
            <p className="salary-unit-text">(단위: 천원)</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#000000"
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fill: "#000000",
                    fontFamily: "Freesentation",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, maxTick]}
                  ticks={customTicks}
                  tick={{
                    fontSize: 11,
                    fill: "#000000",
                    fontFamily: "Freesentation",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => Math.round(v).toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 30, 0.9)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontFamily: "Freesentation",
                    color: "#ffffff",
                  }}
                  itemStyle={{ color: "#ffffff" }}
                  formatter={(value) => [
                    `${Math.round(value).toLocaleString()} 천원`,
                    "평균 임금",
                  ]}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar dataKey="amount" barSize={45} radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.name === "우리 기관" ? "#559e25" : "#9ecf7d"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* [3번 구역] 안내 텍스트 박스 (차트 박스 밖으로 완전히 이동) */}
      <div className="salary-info-text">
        <p className="info-label">평균 임금 비교 안내</p>
        <p className="info-main">
          우리 기관이 전체 평균 대비{" "}
          <strong className={isHigher ? "text-higher" : "text-lower"}>
            약 {Math.abs(diff).toLocaleString()}천원{" "}
            {isHigher ? "높습니다" : "낮습니다"}
          </strong>
          .
        </p>
      </div>
    </>
  );
};
export default SalaryCard;
