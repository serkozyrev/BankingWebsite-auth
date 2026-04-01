import React from "react";

import "./ChartBar.css";

const ChartBar = (props) => {
  let chartFormatted;
  let barFillHeight = "0%";

  if (props.maxValue > 0) {
    barFillHeight = Math.round((props.value / props.maxValue) * 100) + "%";
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  chartFormatted = numberWithCommas(props.value);
  return (
    <div className="chart-bar">
      <div className="chart-bar__label">{props.label}</div>
      <div className="chart-bar__inner">
        <div
          className="chart-bar__fill"
          style={{ height: barFillHeight }}
        ></div>
      </div>
      <div className="chart-bar__label">{chartFormatted}</div>
    </div>
  );
};

export default ChartBar;
