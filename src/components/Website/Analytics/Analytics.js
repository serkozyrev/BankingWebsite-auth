import React, { useEffect, useContext } from "react";
import AuthContext from "../../context/auth-context";
// import { useNavigate } from "react-router-dom";

import Card from "../../UI/Card/Card";

import "./Analytics.css";
import AnalyticsItem from "./AnalyticsItem";

const Analytics = () => {
  const authCtx = useContext(AuthContext);
  // const history = useNavigate();
  useEffect(() => {
    if(!authCtx.authToken) return;
    const fetchMovies = async () => {
      const myHeaders= new Headers()
        myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
        const requestOptions={
              method:'GET',
              headers:myHeaders
          }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/analytics`, requestOptions
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseData = await response.json();
      console.log('responsedata.revenue', responseData.infoRevenue)
      authCtx.setInfoAnalysis(responseData.infoVisa.info);
      authCtx.setInfoAnalysisMine(responseData.infoChequing.info);
      authCtx.setInfoAnalysisLineOfCredit(responseData.infoLineOfCredit.info)
    };
    try {
      fetchMovies().catch((error) => {});
    } catch (err) {}
  }, []);
  return (
    <div className="analysis-container">
      <strong><div className="text-center">!!!Scroll down to check other accounts!!!</div></strong>
      <Card className="analysis">
        <h3>Chequing</h3>
        <div className="container">
          {authCtx.infoAnalysisMine &&
            authCtx.infoAnalysisMine.map((info) => (
              <AnalyticsItem
                key={info.id}
                infoSummary={info.summary}
                amount={info.amount}
                title={info.title}
                year={info.year}
                type={info.type}
              />
            ))}
        </div>
      </Card>
      <Card className="analysis">
        <h3>Visa</h3>
        <div className="container">
          {authCtx.infoAnalysis &&
            authCtx.infoAnalysis.map((info) => (
              <AnalyticsItem
                key={info.id}
                infoSummary={info.summary}
                amount={info.amount}
                title={info.title}
                year={info.year}
                type={info.type}
              />
            ))}
        </div>
      </Card>
      <Card className="analysis">
        <h3>Line of Credit</h3>
        <div className="container">
          {authCtx.infoAnalysisLineOfCredit &&
            authCtx.infoAnalysisLineOfCredit.map((info) => (
              <AnalyticsItem
                key={info.id}
                infoSummary={info.summary}
                amount={info.amount}
                title={info.title}
                year={info.year}
                type={info.type}
              />
            ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
