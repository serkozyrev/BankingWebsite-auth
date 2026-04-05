import React, { useContext } from "react";

import AuthContext from "../../context/auth-context";
import RevenueItem from "./RevenueItem";

import "./RevenueList.css";

const RevenueList = (props) => {
  const authCtx = useContext(AuthContext);
  if (authCtx.searchSelected) {
    return (
      <ul className="revenue-list">
        <h3 className="revenue-list h3">
          Results for Chequing
        </h3>
        <div className="revenue-list items">
          {authCtx.searchexpensesChequing &&
            authCtx.searchexpensesChequing.map((revenue) => (
              <RevenueItem
                key={revenue.id}
                id={revenue.id}
                title={revenue.description}
                amount={revenue.amount}
                day={revenue.day}
                month={revenue.month}
                dollars={revenue.amountindollar}
                year={revenue.year}
                rate={authCtx.currencyRate}
                category={revenue.category}
                type={revenue.type}
              />
            ))}
        </div>
      </ul>
    );
  }
  return (
    <>
      <ul className="revenue-list">
        <h3 className="revenue-list h3">Chequing</h3>
        <div className="revenue-list items">
          {authCtx.expensesList &&
            authCtx.expensesList.map((revenue) => (
              <RevenueItem
                key={revenue.id}
                id={revenue.id}
                title={revenue.description}
                amount={revenue.amount}
                day={revenue.day}
                month={revenue.month}
                year={revenue.year}
                type={revenue.type}
              />
            ))}
        </div>
      </ul>
    </>
  );
};

export default RevenueList;
