import React, { useContext, useEffect, useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import AuthContext from "../context/auth-context";

import "./Search.css";

const Search = (props) => {
  const authCtx = useContext(AuthContext);
  const [providedSearch, setProvidedSearch] = useState("");

  const searchHandler = (event) => {
    setProvidedSearch(event.target.value);
  };

  useEffect(() => {
  if (providedSearch === "") {
    authCtx.setSearchSelected(false);
  }
}, [providedSearch, authCtx]);

  const submitHandler = (event) => {
    event.preventDefault();
    const myHeaders= new Headers()
      myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
      myHeaders.append('Content-Type','application/json')
    try {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/search`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          description: providedSearch,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          authCtx.setSearchSelected(true);
          authCtx.setSearchListExpenses(data.searchExpenses)
          authCtx.setSearchExpenses(data.expensesList);
          authCtx.setSearchExpenseDina(data.expensesListVisa);
          authCtx.setSearchExpenseChequing(data.expenseListCheqing);
        });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Form className="d-flex" onSubmit={submitHandler}>
      <FormControl
        type="search"
        placeholder="Expense Description"
        className="me-2"
        aria-label="Search"
        value={providedSearch}
        onChange={searchHandler}
      />
      <Button variant="outline-success" className="buttonSearch" type="submit">
        Search
      </Button>
    </Form>
  );
};

export default Search;
