import React from "react";
import { Chart } from "react-google-charts";
import data from "./ptData.json";

const options = {
  region: "PT",
  resolution: "provinces", // Shows districts
  displayMode: "regions",
  colorAxis: {
    colors: ["#ffffff", "#ff7900"],
    minValue: 0,
  },
};

export function Portugal() {
  return (
    <Chart
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper.getChart();
            const selection = chart.getSelection();
            if (selection.length === 0) return;
            const region = data[selection[0].row + 1];
            console.log("Selected : " + region);
          },
        },
      ]}
      chartType="GeoChart"
      width="100%"
      height="100%"
      data={data}
      options={options}
    />
  );
}

