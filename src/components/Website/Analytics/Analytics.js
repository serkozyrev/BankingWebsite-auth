import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../context/auth-context";
// import { useNavigate } from "react-router-dom";

import Card from "../../UI/Card/Card";

import "./Analytics.css";
import AnalyticsItem from "./AnalyticsItem";


const Analytics = () => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authCtx.authToken) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + authCtx.authToken);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/analytics`,
          requestOptions
        );

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.detail || "Something went wrong!");
        }

        const responseData = await response.json();
        console.log("analytics response", responseData);

        authCtx.setInfo(responseData.info.info || []);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to load analytics");
        authCtx.setInfo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authCtx.authToken]);

  if (loading) {
    return (
      <div className="analysis-container">
        <p className="text-center">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-container">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <strong>
        <div className="text-center">Scroll down to check other accounts</div>
      </strong>

      {authCtx.info?.length > 0 ? (
        authCtx.info.map((account) => {
          const expenses = account.expenses_info || [];

          return (
            <Card className="analysis" key={account.id}>
              <div>
                <h3 className="revenue-list h3">{account.description}</h3>

                <div className="container">
                  {expenses.length > 0 ? (
                    expenses.map((info, index) => (
                      <AnalyticsItem
                        key={`${account.id}-${info.type || info.title}-${index}`}
                        infoSummary={info.summary || []}
                        amount={info.amount}
                        title={info.title}
                        year={info.year}
                        type={info.type}
                      />
                    ))
                  ) : (
                    <p>No records found.</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <p className="text-center">No analytics data found.</p>
      )}
    </div>
  );
};

export default Analytics;
