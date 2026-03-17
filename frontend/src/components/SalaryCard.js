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
  return (
    <div className="card-box card-top">
      <div className="card-header">평균 임금 비교</div>
      <div className="card-content salary-card">
        <p className="salary-title">[전체 평균 vs 기관 비교]</p>
        <div className="salary-chart-wrapper">
          <p className="salary-unit-text">(단위: 만원)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, "dataMax + 1500"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="amount" barSize={60}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.name === "우리 기관" ? "#f25c5c" : "#70a1d7"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="salary-info-text">
          <p>우리 기관이 전체 평균 대비</p>
          <p className="highlight">
            약 {(data[1].amount - data[0].amount).toLocaleString()}만원 높음
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryCard;
