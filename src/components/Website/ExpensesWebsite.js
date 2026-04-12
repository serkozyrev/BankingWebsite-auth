import React from "react";

import Card from "../UI/Card/Card";
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
        <RevenueList/>
      </div>
    </div>
  );
};

export default ExpensesWebsite;
