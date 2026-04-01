import React from "react";

import Card from "../../UI/Card/Card";
import ExpensesChart from "./ExpensesChart";

import "./AnalyticsItem.css";

const AnalyticsItem = (props) => {
  return (
    <Card className="chartBox">
      <h5 className="items-name">Expense: {props.title}</h5>
      <div className="items-price">
        Expense amount this month: ${props.amount} cad
      </div>
      <div className="chart-bars">
        <h6>Category Yearly</h6>
        <ExpensesChart items={props.infoSummary} />
      </div>
    </Card>
  );
};

export default AnalyticsItem;
