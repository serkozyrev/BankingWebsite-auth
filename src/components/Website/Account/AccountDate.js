import React from "react";
import "./AccountDate.css";

const AccountDate = (props) => {
  let date = new Date();
  return (
    <div className="account-date">
      <div className="account-date__day">
        {date.toLocaleString("en-US", { day: "2-digit" })}
      </div>
      <div className="account-date__month">
        {date.toLocaleString("en-US", { month: "long" })}{" "}
      </div>
      <div className="account-date__year">{date.getFullYear()} </div>
    </div>
  );
};

export default AccountDate;
