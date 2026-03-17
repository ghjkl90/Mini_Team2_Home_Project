import ReactECharts from "echarts-for-react";

function GaugeChart({ value = 0, title }) {
  /* 위험 단계 텍스트 */
  const getRiskLabel = (val) => {
    const numValue = Number(val);
    if (numValue < 33) return { label: "C 등급", color: "#00c853" };
    if (numValue < 66) return { label: "B 등급", color: "#c5a802" };
    return { label: "A 등급", color: "#d50000" };
  };

  const riskLabel = getRiskLabel(value);

  const option = {
    title: {
      text: title,
      left: "center",
      top: 5,
      textStyle: {
        fontSize: 23,
        fontWeight: "bold",
      },
    },

    series: [
      {
        type: "gauge",

        startAngle: 180,
        endAngle: 0,

        min: 0,
        max: 100,

        radius: "100%",
        center: ["50%", "70%"],

        /* 게이지 전체 그라데이션 */
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.33, "#00c853"],
              [0.66, "#ffd600"],
              [1, "#d50000"],
            ],
          },
        },

        pointer: {
          length: "80%",
          width: 8,
        },

        /* 눈금 제거 */
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },

        /* 중앙 숫자 */
        detail: {
          valueAnimation: true,
          formatter: `{value}점\n{grade|${riskLabel.label}}`,
          fontSize: 22,
          fontWeight: "bold",
          offsetCenter: [0, "40%"],

          rich: {
            grade: {
              color: riskLabel.color, // 등급(A/B/C)만 해당 등급 색상 적용
              fontSize: 24, // 등급 글자 크기만 따로 조절 가능
              fontWeight: "bolder",
              padding: [5, 0], // 위아래 간격 조정
            },
          },
        },

        data: [{ value: value }],
      },
    ],

    /* Low / High 표시 */
    graphic: [
      {
        type: "text",
        left: "33%", // 빔프로젝트 설정값 -> 33% 셋팅, // 교육생 PC모니터 해상도 -> 8% 셋팅
        top: "70%",
        style: {
          text: "Low",
          fill: "#000000",
          fontSize: 12,
        },
      },

      {
        type: "text",
        right: "33%", // 빔프로젝트 설정값 -> 33% 셋팅, // 교육생 PC모니터 해상도 -> 8% 셋팅
        top: "70%",
        style: {
          text: "High",
          fill: "#000000",
          fontSize: 12,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 240 }} />;
}

export default GaugeChart;
