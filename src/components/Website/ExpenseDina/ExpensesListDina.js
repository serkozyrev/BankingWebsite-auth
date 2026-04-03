import React, { useContext } from "react";
import ExpenseItem from "./ExpenseItem";
import AuthContext from "../../context/auth-context";

import "./ExpensesList.css";

const ExpensesListDina = (props) => {
  const authCtx = useContext(AuthContext);
  
  if (authCtx.searchSelected) {
    return (
      <ul className="expenses-list">
        <h3 className="expenses-list h3">Results for Visa</h3>
        <div className="expenses-list items">
          {authCtx.searchexpenseDina &&
            authCtx.searchexpenseDina.map((expense) => (
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
      <h3 className="expenses-list h3">Visa</h3>
      <div className="expenses-list items">
        {authCtx.expensesListDina &&
          authCtx.expensesListDina.map((expense) => (
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
};

export default ExpensesListDina;
