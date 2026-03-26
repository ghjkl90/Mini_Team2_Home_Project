import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

/**
 * GaugeChart - Dark Neon Edition
 * - 통합 디자인 시스템(Lumina Analytics)의 네온 그린 테마 적용
 * - 고대비 다크 모드 최적화
 */
function GaugeChart({ value = 0, title }) {
  const safeValue = Number(value) || 0;

  const subtitle = title === "Attrition Risk" ? "퇴사 위험도" : "번아웃 위험도";

  const percentageText = `${safeValue}%`;

  // 위험도에 따른 텍스트 색상 매핑 (네온 테마)
  const getValueColor = (val) => {
    if (val >= 70) return "#ff5f5f"; // 경고 레드 (네온)
    if (val >= 40) return "#ffaa00"; // 주의 오렌지
    return "#4ade80"; // 안전/정상 네온 그린
  };

  const valueColor = getValueColor(safeValue);

  const option = useMemo(
    () => ({
      series: [
        {
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          radius: "115%",
          center: ["50%", "75%"],

          axisLine: {
            lineStyle: {
              width: 24,
              color: [
                [0.3, "rgba(74, 222, 128, 0.1)"], // 낮은 위험 (은은한 녹색)
                [0.7, "rgba(74, 222, 128, 0.4)"], // 중간 위험 (선명한 녹색)
                [1, "#4ade80"], // 높은 위험 (강렬한 네온 그린)
              ],
              shadowBlur: 15,
              shadowColor: "rgba(74, 222, 128, 0.3)",
            },
          },

          pointer: {
            show: true,
            icon: "path://M-12 0 L12 0 L4 -18 L0 -120 L-4 -18 Z",
            length: "80%",
            width: 14,
            offsetCenter: [0, "5%"],
            itemStyle: {
              color: "#ffffff", // 바늘을 화이트로 하여 시인성 확보
              shadowBlur: 10,
              shadowColor: "rgba(255, 255, 255, 0.5)",
            },
          },

          progress: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          anchor: { show: false },

          title: { show: false },
          detail: { show: false },

          data: [
            {
              value: safeValue,
              name: title,
            },
          ],
        },
      ],
    }),
    [safeValue, title],
  );

  return (
    <div className="gaugeWrapper">
      <div className="gaugeTitle" style={{ color: "#ffffff", fontWeight: 800 }}>
        {title}
      </div>
      <div
        className="gaugeSubtitle"
        style={{
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: "12px",
          marginTop: "4px",
        }}
      >
        [{subtitle}]
      </div>

      <ReactECharts
        option={option}
        style={{ width: "100%", height: "240px" }}
        notMerge={true}
        lazyUpdate={true}
      />

      <div
        className="gaugeScoreBox"
        style={{
          border: `1px solid ${valueColor}33`,
          background: "rgba(255, 255, 255, 0.02)",
          marginTop: "-20px",
        }}
      >
        <div
          className="gaugeScoreLabel"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Predictive Risk
        </div>
        <div
          className="gaugeScoreValue"
          style={{
            color: valueColor,
            fontSize: "28px",
            fontWeight: 900,
            textShadow: `0 0 10px ${valueColor}44`,
          }}
        >
          {percentageText}
        </div>
      </div>
    </div>
  );
}

export default GaugeChart;
