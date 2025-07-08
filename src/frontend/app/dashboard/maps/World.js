import React from "react";
import { Chart } from "react-google-charts";
import data from "./wdData.json";

const options = {
  region: "world",
  displayMode: "regions",
  resolution: "countries",
  colorAxis: {
    colors: ["#ffffff", "#ff7900"],
    minValue: 0,
  },
};

export function World() {
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

