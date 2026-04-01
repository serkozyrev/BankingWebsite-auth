import React from "react";

import Card from "../UI/Card/Card";
import ExpensesList from "./ExpensesPapa/ExpensesList";
import ExpensesListDina from "./ExpenseDina/ExpensesListDina";
import RevenueList from "./Revenue/RevenueList";

import "./ExpensesWebsite.css";
import Account from "./Account/Account";

const ExpensesWebsite = (props) => {
  return (
    <div className="expenses">
      <div>
        <Card className="account">
          <Account />
        </Card>
      </div>
      <div className="transaction-container">
        <Card className="transaction-body">
          <RevenueList />
        </Card>
        <Card className="transaction-body">
          <ExpensesList />
        </Card>
        <Card className="transaction-body">
          <ExpensesListDina />
        </Card>
      </div>
    </div>
  );
};

export default ExpensesWebsite;
