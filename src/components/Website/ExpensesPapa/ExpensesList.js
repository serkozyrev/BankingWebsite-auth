import React, { useContext } from "react";
import ExpenseItem from "./ExpenseItem";
import AuthContext from "../../context/auth-context";

import "./ExpensesList.css";

const ExpensesList = (props) => {
  const authCtx = useContext(AuthContext);
  if (authCtx.searchSelected) {
    return (
      <ul className="expenses-list">
        <h3 className="expenses-list h3">
          Results for Line of Credit
        </h3>
        <div className="expenses-list items">
          {authCtx.searchexpenses &&
            authCtx.searchexpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                id={expense.id}
                title={expense.description}
                amount={expense.amount}
                day={expense.day}
                month={expense.month}
                dollars={expense.amountindollar}
                year={expense.year}
                rate={authCtx.currencyRate}
                category={expense.category}
                type={expense.type}
              />
            ))}
        </div>
      </ul>
    );
  }
  return (
    <ul className="expenses-list">
      <h3 className="expenses-list h3">Line of Credit</h3>
      <div className="expenses-list items">
        {authCtx.expensesListLineOfCredit &&
          authCtx.expensesListLineOfCredit.map((expense) => (
            <ExpenseItem
              key={expense.id}
              id={expense.id}
              title={expense.description}
              amount={expense.amount}
              day={expense.day}
              month={expense.month}
              year={expense.year}
              dollars={expense.amountindollar}
              rate={authCtx.currencyRate}
              category={expense.category}
              type={expense.type}
            />
          ))}
      </div>
    </ul>
  );
};

export default ExpensesList;
