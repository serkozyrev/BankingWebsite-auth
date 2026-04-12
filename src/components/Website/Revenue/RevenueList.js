import React, { useContext, useState, useEffect, useMemo } from "react";

import AuthContext from "../../context/auth-context";
import RevenueItem from "./RevenueItem";
import Card from "../../UI/Card/Card";

import "./RevenueList.css";

const RevenueList = (props) => {
  const authCtx = useContext(AuthContext);
  const ITEMS_PER_PAGE = 5;
  const [currentPages, setCurrentPages] = useState({});

  const currentList = useMemo(() => {
    return authCtx.searchSelected
      ? authCtx.searchListExpenses || []
      : authCtx.expenses || [];
  }, [authCtx.searchSelected, authCtx.searchListExpenses, authCtx.expenses]);
  // console.log('currentList', currentList)

  const getCurrentPage = (accountId) => currentPages[accountId] || 1;

  const getTotalPages = (expenses) => {
    return expenses?.length ? Math.ceil(expenses.length / ITEMS_PER_PAGE) : 1;
  };

  const getPaginatedExpenses = (accountId, expenses) => {
    const currentPage = getCurrentPage(accountId);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return expenses.slice(startIndex, endIndex);
  };

  const prevPageHandler = (accountId) => {
    setCurrentPages((prev) => ({
      ...prev,
      [accountId]: Math.max((prev[accountId] || 1) - 1, 1),
    }));
  };

  const nextPageHandler = (accountId, totalPages) => {
    setCurrentPages((prev) => ({
      ...prev,
      [accountId]: Math.min((prev[accountId] || 1) + 1, totalPages),
    }));
  };

  useEffect(() => {
    const initialPages = {};

    currentList.forEach((account) => {
      initialPages[account.id] = 1;
    });

    setCurrentPages(initialPages);
  }, [currentList]);

  return (
    <>
    {currentList.length > 0 ? (<>
      {currentList.map((account) => {
        const expenses = account.expenses || [];
        const totalPages = getTotalPages(expenses);
        const paginatedExpenses = getPaginatedExpenses(account.id, expenses);
        const currentPage = getCurrentPage(account.id);

        return (
          
          <Card className="transaction-body" key={account.id}>
            <div >
              <h3 className="revenue-list h3">{account.description}</h3>
              <ul className="revenue-list">
                {paginatedExpenses.length > 0 ? (
                  paginatedExpenses.map((expense) => (
                    <RevenueItem
                      key={expense.id}
                      id={expense.id}
                      title={expense.description}
                      amount={expense.amount}
                      day={expense.day}
                      month={expense.month}
                      year={expense.year}
                      category={expense.category}
                      type={expense.type}
                    />
                  ))
                ) : (
                  <p>No records found.</p>
                )}
              </ul>

              {expenses.length > ITEMS_PER_PAGE && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3 mb-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => prevPageHandler(account.id)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => nextPageHandler(account.id, totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </Card>
          
        );
      })}</>
    ):(
    <Card className="transaction-body">
      <p>No records found.</p>
    </Card>)}
    </>
  );
};

export default RevenueList;
