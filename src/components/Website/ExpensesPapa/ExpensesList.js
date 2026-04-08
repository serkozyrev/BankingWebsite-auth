import React, { useContext, useState, useEffect, useMemo } from "react";
import ExpenseItem from "./ExpenseItem";
import AuthContext from "../../context/auth-context";

import "./ExpensesList.css";

const ExpensesList = (props) => {
  const authCtx = useContext(AuthContext);

    // console.log('currentList', authCtx.expensesList)
    const currentList = useMemo(()=>{
      return authCtx.searchSelected
      ? authCtx.searchexpenses
      : authCtx.expensesListLineOfCredit;
  
    },[authCtx.searchSelected, authCtx.searchexpenses, authCtx.expensesListLineOfCredit])
    // console.log('currentList', currentList)
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
  
    const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE);
  
    const paginatedList = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return currentList.slice(startIndex, endIndex);
    }, [currentList, currentPage]);
  
    const prevPageHandler = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
  
    const nextPageHandler = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
  
    useEffect(() => {
      setCurrentPage(1);
    }, [authCtx.searchSelected, authCtx.searchexpenses, authCtx.expensesListLineOfCredit]);

  return (
    <>
    <ul className="revenue-list">
      <h3 className="revenue-list h3">
        {authCtx.searchSelected ? "Results for Line of Credit" : "Line of Credit"}
      </h3>

      <div className="revenue-list items">
        {paginatedList.length > 0 ? (
          paginatedList.map((revenue) => (
            <ExpenseItem
              key={revenue.id}
              id={revenue.id}
              title={revenue.description}
              amount={revenue.amount}
              day={revenue.day}
              month={revenue.month}
              year={revenue.year}
              dollars={revenue.amountindollar}
              rate={authCtx.currencyRate}
              category={revenue.category}
              type={revenue.type}
            />
          ))
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </ul>

    {totalPages > 1 && (
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3 mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={prevPageHandler}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline-primary"
          onClick={nextPageHandler}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )}
    </>
  );

  
};

export default ExpensesList;
