import React, { useState, useContext } from "react";

import AuthContext from "../context/auth-context";
import Button from "../UI/Button/Button";
import "./NewRecord.css";

const NewRecord = (props) => {
  const authCtx = useContext(AuthContext);
  const [providedAmount, setProvidedAmount] = useState(0);
  const [validatedAmount, setValidAmount] = useState();
  const [providedDescription, setProvidedDescription] = useState("");
  const [validatedDescription, setValidDescription] = useState();
  const [providedType, setProvidedType] = useState("");
  const [validatedType, setValidType] = useState();
  const [providedCategory, setProvidedCategory] = useState("");
  const [validatedCategory, setValidCategory] = useState();
  const [providedDate, setProvidedDate] = useState("");
  const [validatedDate, setValidDate] = useState();
  const [providedAccount, setProvidedAccount] = useState("");
  const [validatedAccount, setValidAccount] = useState();
  const [isChecked, setIsChecked] = useState(false)
  const [aiAgentUserRequest, setAiAgentUserRequest]=useState("")

  const handleIsChecked = ()=>{
    setIsChecked(!isChecked)
  }

  const aiUserRequestHandler = (event) => {
    setAiAgentUserRequest(event.target.value);
  };

  const amountHandler = (event) => {
    setProvidedAmount(event.target.value);
  };

  const validateAmountHandler = () => {
    setValidAmount(providedAmount !== "");
  };

  const dateHandler = (event) => {
    setProvidedDate(event.target.value);
  };

  const validateDateHandler = () => {
    setValidDate(providedDate !== "");
  };

  const descriptionHandler = (event) => {
    setProvidedDescription(event.target.value);
  };

  const validateDescriptionHandler = () => {
    setValidDescription(providedDescription !== "");
  };

  const typeHandler = (event) => {
    setProvidedType(event.target.value);
  };

  const validateTypeHandler = () => {
    setValidType(providedType !== "");
  };

  const categoryHandler = (event) => {
    setProvidedCategory(event.target.value);
  };

  const validateCategoryHandler = () => {
    setValidCategory(providedCategory !== "");
  };

  const accountHandler = (event) => {
    setProvidedAccount(event.target.value);
  };

  const validateAccountHandler = () => {
    setValidAccount(providedAccount !== "");
  };

  const submitHandler = async(event) => {
    event.preventDefault();

    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')
    if(isChecked){
      const requestPostOptions={
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            "description": providedDescription
          }),
        }
        try{
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/ai/parse-entry`, requestPostOptions)
      
          if(!res.ok){
            const err=(await res).json().catch(()=>null)
            throw new Error(err?.detail || "Failed to add record")
          }
          const data = await res.json()
          props.dataFunc(data.message);

          authCtx.closeModal();
          props.infoBool();
          console.log("data", data)
          
        }catch(e){
          console.log(e)
        }
    }else{
      if(providedType==='revenue'){
        console.log('test')
        const requestPostOptions={
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            "transaction_type": providedType,
            "description": providedDescription,
            "date": providedDate,
            "category": providedCategory,
            "revenue_balance": providedAmount,
            "account_type": providedAccount
          }),
        }
        try{
          await postingNewRecord('revenue',requestPostOptions)
        }catch(e){
          console.log(e)
        }
      }
      else if(providedType ==='transfer'){
        const requestPostOptions={
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            "transaction_type": providedType,
            "description": providedDescription,
            "date": providedDate,
            "category": providedCategory,
            "revenue_balance": providedAmount,
            "account_type": providedAccount
          }),
        }
        try{
          await postingNewRecord('revenue',requestPostOptions)
        }catch(e){
          console.log(e)
        }
      }
      else{
        const requestPostOptions={
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            "transaction_type": providedType,
            "description": providedDescription,
            "date": providedDate,
            "category": providedCategory,
            "expense_balance": providedAmount,
          }),
        }
        try{
          await postingNewRecord('expense',requestPostOptions)
        }catch(e){
          console.log(e)
        }
      }
    }
  };

  const postingNewRecord= async(transactionType, requestPostOptions)=>{
    
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${transactionType}`, requestPostOptions)
      
      if(!res.ok){
        const err=(await res).json().catch(()=>null)
        throw new Error(err?.detail || "Failed to add record")
      }
      const data = await res.json()
      props.dataFunc(data.message);

      authCtx.closeModal();
      props.infoBool();
      authCtx.setAccountBalanceDina(data.account_info.visa);
      authCtx.setAccountBalanceMine(data.account_info.chequing); 
      authCtx.setAccountBalanceSnezhana(data.account_info.line_of_credit);            
      if(transactionType==='revenue'){
        authCtx.setRevenuesList(data.revenues);
      }
      else{
        authCtx.setExpensesList(data.expensesChequingLineOfCredit);
        authCtx.setExpensesListDina(data.expensesVisa);
        authCtx.totalSum(data.totalChequing);
        authCtx.totalSumDina(data.totalVisa);
        authCtx.totalSumSnezhana(data.totalLineOfCredit);
      }
      
  }
  
  return (
    <form onSubmit={submitHandler}>
      <div className="mt-5 text-center">
        <h2>New Record into Account</h2>
        <p>
          Please select income or expense and add description to this record.
          When you finish, press Save. All fields should be filled. 

          {/* You can also check the box and right request to AI to create a record for you.
          eg. "create income record for transfer from chequing to visa 115.26 with today date" */}
        </p>
        {/* <div className="d-flex justify-content-center">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="flexCheckDefault"
              value={isChecked}
              checked={isChecked}
              onChange={handleIsChecked}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              {isChecked ? "Checked" : "Unchecked"}
            </label>
          </div>
        </div> */}
        {!isChecked && (<div className="d-flex justify-content-center">
          <div className="col-8 mb-4 mt-3">
            <div
              className={`control ${
                validatedType === false ? "invalid" : "check"
              }`}
            >
              <h6 className="form-label" htmlFor="description">
                Type of record
              </h6>
              <select
                id="gender"
                className="form-select field"
                value={providedType}
                onChange={typeHandler}
                onBlur={validateTypeHandler}
                required
              >
                <option defaultValue>Choose...</option>
                <option value="revenue">Deposit</option>
                <option value="transfer">Transfer</option>
                <option value="expense">Expense</option>
              </select>
              {validatedType === false && (
                <p className="error-check">Please select type of transaction</p>
              )}
            </div>
            {providedType === "revenue" && (
              <div>
                <div
                  className={`control ${
                    validatedDate === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="date">
                    Record Date
                  </h6>
                  <input
                    type="date"
                    className="form-select field"
                    id="date"
                    name="date"
                    value={providedDate}
                    onChange={dateHandler}
                    onBlur={validateDateHandler}
                    min="2018-01-01"
                    max="2099-12-31"
                  />
                  {validatedDate === false && (
                    <p className="error-check">Please select record's date</p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedAccount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="account">
                    Type of Account
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedAccount}
                    onChange={accountHandler}
                    onBlur={validateAccountHandler}
                    required
                  >
                    <option defaultValue>Choose...</option>
                    <option value="Chequing">Chequing</option>
                    {/* <option value="Visa">Visa</option> */}
                    {/* <option value="LineOfCredit">Line of Credit</option> */}
                  </select>
                  {validatedAccount === false && (
                    <p className="error-check">
                      Please, select type of account
                    </p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedCategory === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="category">
                    Category
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedCategory}
                    onChange={categoryHandler}
                    onBlur={validateCategoryHandler}
                    required
                  >
                    <option defaultValue>Choose...</option>
                    <option value="salary">Salary</option>
                  </select>
                  {validatedCategory === false && (
                    <p className="error-check">
                      Please, select income category
                    </p>
                  )}
                </div>
                
                <div
                  className={`control ${
                    validatedAmount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="amount">
                    Record Amount{" "}
                  </h6>
                  <input
                    type="number"
                    id="amount"
                    className="form-control field"
                    value={providedAmount}
                    onChange={amountHandler}
                    onBlur={validateAmountHandler}
                  />
                  {validatedAmount === false && (
                    <p className="error-check">
                      Please, enter amount for record
                    </p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedDescription === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="description">
                    Description{" "}
                  </h6>
                  <textarea
                    rows="3"
                    id="description"
                    className="form-control field"
                    value={providedDescription}
                    onChange={descriptionHandler}
                    onBlur={validateDescriptionHandler}
                  />
                  {validatedDescription === false && (
                    <p className="error-check">
                      Please, enter description for record
                    </p>
                  )}
                </div>
              </div>
            )}

            {providedType === "transfer" && (
              <div>
                <div
                  className={`control ${
                    validatedDate === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="date">
                    Record Date
                  </h6>
                  <input
                    type="date"
                    className="form-select field"
                    id="date"
                    name="date"
                    value={providedDate}
                    onChange={dateHandler}
                    onBlur={validateDateHandler}
                    min="2018-01-01"
                    max="2099-12-31"
                  />
                  {validatedDate === false && (
                    <p className="error-check">Please select record's date</p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedAccount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="account">
                    Type of Account
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedAccount}
                    onChange={accountHandler}
                    onBlur={validateAccountHandler}
                    required
                  >
                    <option defaultValue>Choose...</option>
                    <option value="Chequing">Chequing</option>{/* PapaAccount */}
                    <option value="Visa">Visa</option>{/* DinaAccount */}
                    <option value="LineOfCredit">Line of Credit</option>{/* SnezhanaAccount */}
                  </select>
                  {validatedAccount === false && (
                    <p className="error-check">
                      Please, select type of account
                    </p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedCategory === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="category">
                    Category
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedCategory}
                    onChange={categoryHandler}
                    onBlur={validateCategoryHandler}
                    required
                  >
                    <option defaultValue>Choose...</option>                    
                    {(providedAccount==='Chequing' || providedAccount==='LineOfCredit') && (<option value="transferToVisa">
                      Transfer to Visa
                    </option>)}
                    {(providedAccount==='Visa' || providedAccount==='Chequing') && (<option value="transferToLineOfCredit">
                      Transfer to Line of Credit
                    </option>)}
                    {(providedAccount==='Visa' || providedAccount==='LineOfCredit') && (<option value="transferToChequing">
                      Transfer to Chequing
                    </option>)}
                  </select>
                  {validatedCategory === false && (
                    <p className="error-check">
                      Please, select transfer category
                    </p>
                  )}
                </div>
                
                <div
                  className={`control ${
                    validatedAmount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="amount">
                    Record Amount{" "}
                  </h6>
                  <input
                    type="number"
                    id="amount"
                    className="form-control field"
                    value={providedAmount}
                    onChange={amountHandler}
                    onBlur={validateAmountHandler}
                  />
                  {validatedAmount === false && (
                    <p className="error-check">
                      Please, enter amount for record
                    </p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedDescription === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="description">
                    Description{" "}
                  </h6>
                  <textarea
                    rows="3"
                    id="description"
                    className="form-control field"
                    value={providedDescription}
                    onChange={descriptionHandler}
                    onBlur={validateDescriptionHandler}
                  />
                  {validatedDescription === false && (
                    <p className="error-check">
                      Please, enter description for record
                    </p>
                  )}
                </div>
              </div>
            )}

            {providedType === "expense" && (
              <div>
                <div
                  className={`control ${
                    validatedDate === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="date">
                    Record Date
                  </h6>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-select field"
                    value={providedDate}
                    onChange={dateHandler}
                    onBlur={validateDateHandler}
                    min="2018-01-01"
                    max="2099-12-31"
                  />
                  {validatedDate === false && (
                    <p className="error-check">Please select record's date</p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedAccount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="account">
                    Type of Account
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedAccount}
                    onChange={accountHandler}
                    onBlur={validateAccountHandler}
                    required
                  >
                    <option defaultValue>Choose...</option>
                    <option value="Visa">Visa</option>{/* DinaAccount */}
                    <option value="Chequing">Chequing</option>{/* PapaAccount */}
                    <option value="LineOfCredit">Line of Credit</option>{/* SnezhanaAccount */}
                  </select>
                  {validatedAccount === false && (
                    <p className="error-check">
                      Please, select type of account
                    </p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedCategory === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="category">
                    Type of expense
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedCategory}
                    onChange={categoryHandler}
                    onBlur={validateCategoryHandler}
                    required
                  >
                    <option defaultValue>Choose...</option>
                    <option value="grocery">Grocery</option>                    
                    <option value="utilitiesPayment">Utilities</option>
                    <option value="otherPayment">Other Payments</option>
                    <option value="medicine">Medicine</option>
                  </select>
                  {validatedCategory === false && (
                    <p className="error-check">
                      Please, select type of expense
                    </p>
                  )}
                </div>

                <div
                  className={`control ${
                    validatedAmount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="amount">
                    Record Amount{" "}
                  </h6>
                  <input
                    type="number"
                    id="amount"
                    step=".01"
                    className="form-control field"
                    value={providedAmount}
                    onChange={amountHandler}
                    onBlur={validateAmountHandler}
                  />
                  {validatedAmount === false && (
                    <p className="error-check">Please, enter record amount</p>
                  )}
                </div>
                <div
                  className={`control ${
                    validatedDescription === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="description">
                    Description{" "}
                  </h6>
                  <textarea
                    rows="3"
                    id="description"
                    className="form-control field"
                    value={providedDescription}
                    onChange={descriptionHandler}
                    onBlur={validateDescriptionHandler}
                  />
                  {validatedDescription === false && (
                    <p className="error-check">
                      Please, enter record description
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>)}
        {isChecked &&(
          <div className="d-flex justify-content-center">
            <div className="col-8 mb-4 mt-3">
              <div
                  className={`control ${
                    validatedDescription === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="description">
                    Description{" "}
                  </h6>
                  <textarea
                    rows="3"
                    id="description"
                    className="form-control field"
                    value={providedDescription}
                    onChange={descriptionHandler}
                    onBlur={validateDescriptionHandler}
                  />
                  {validatedDescription === false && (
                    <p className="error-check">
                      Please, enter description for record
                    </p>
                  )}
                </div>
            </div>
          </div>)}
      </div>
      <div className="mb-5 d-flex justify-content-center">
        <Button type="submit" className="btn login mb-4">
          Save
        </Button>
      </div>
    </form>
  );
};

export default NewRecord;
