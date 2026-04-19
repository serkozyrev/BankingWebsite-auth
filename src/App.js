import React, { Suspense } from "react";
import { Routes, Route} from "react-router-dom";

import Header from "./components/Header/Header";

import "./App.css";
import LoadingSpinner from "./components/UI/LoadingSpinner";
const ExpensesWebsite = React.lazy(() =>
  import("./components/Website/ExpensesWebsite")
);
const EditRecord = React.lazy(() => import("./components/Website/EditRecord"));
const Analytics = React.lazy(() =>
  import("./components/Website/Analytics/Analytics")
);
const Graphs = React.lazy(() =>
  import("./components/Website/Analytics/Graphs")
);

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="centered">
          <LoadingSpinner />
        </div>
      }
    >
      <Header />
      <Routes>
        <Route exact path="/" element={<ExpensesWebsite />} />
        <Route path="/edit/:rid" element={<EditRecord />} />
        <Route path="analysis" element={<Analytics />}  />
        <Route path="graphs" element={<Graphs />}  />
      </Routes>
    </Suspense>
  );
};

export default App;
