import React from "react";
import ReactECharts from "echarts-for-react";
import data from "./Data.json";

export function DualAxisChart() {
  const lastIndex = data.labels.length;
  const firstIndex = Math.max(0, lastIndex - 7);

  const labels = data.labels.slice(firstIndex, lastIndex);
  const totals = data.totals.slice(firstIndex, lastIndex);
  const kms = data.kms.slice(firstIndex, lastIndex);

  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Total", "KMs"],
    },
    xAxis: {
      type: "category",
      data: labels,
    },
    yAxis: [
      {
        type: "value",
        name: "KMs",
        position: "left",
      },
      {
        type: "value",
        name: "Total",
        position: "right",
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "KMs",
        type: "bar",
        data: kms,
        yAxisIndex: 0,
        itemStyle: { color: "#ff7900" },
        emphasis: { focus: "series" },
        itemStyle: {
          color: "#ff7900",
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: "Total",
        type: "line",
        data: totals,
        yAxisIndex: 1,
        itemStyle: { color: "#c75d00" },
        lineStyle: { color: "#c75d00" },
        label: {
          show: true,
          position: "top",
          color: "#000000",
          fontWeight: "bold",
        },
        emphasis: { focus: "series" },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ width: "100%", height: "400px" }} // ✅ more responsive
    />
  );
}
