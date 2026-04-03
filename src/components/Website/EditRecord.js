import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/auth-context";
import Button from "../UI/Button/Button";
import Card from "../UI/Card/Card";
import Modal from "../UI/Modal/Modal";
import ConfirmMessage from "./ConfirmMessage";
import "./EditRecord.css";

const EditRecord = (props) => {
  const authCtx = useContext(AuthContext);
  const history = useNavigate();
  const [providedAmount, setProvidedAmount] = useState(0);
  const [validatedAmount, setValidAmount] = useState();
  const [providedDescription, setProvidedDescription] = useState("");
  const [validatedDescription, setValidDescription] = useState();
  const [providedCategory, setProvidedCategory] = useState("");
  const [validatedCategory, setValidCategory] = useState();
  const [providedDate, setProvidedDate] = useState("");
  const [validatedDate, setValidDate] = useState();
  const [providedAccount, setProvidedAccount] = useState("");
  const [validatedAccount, setValidAccount] = useState();

  const recordId = useParams().rid;
  const recordType = useParams().type;

  const editamountHandler = (event) => {
    setProvidedAmount(event.target.value);
  };

  const editvalidateAmountHandler = () => {
    setValidAmount(providedAmount !== "");
  };

  const editdateHandler = (event) => {
    setProvidedDate(event.target.value);
  };

  const editvalidateDateHandler = () => {
    setValidDate(providedDate !== "");
  };

  const editdescriptionHandler = (event) => {
    setProvidedDescription(event.target.value);
  };

  const editvalidateDescriptionHandler = () => {
    setValidDescription(providedDescription !== "");
  };

  const editcategoryHandler = (event) => {
    setProvidedCategory(event.target.value);
  };

  const editvalidateCategoryHandler = () => {
    setValidCategory(providedCategory !== "");
  };
  const accountHandler = (event) => {
    setProvidedAccount(event.target.value);
  };

  const validateAccountHandler = () => {
    setValidAccount(providedAccount !== "");
  };

  useEffect(() => {
  const runDelete = async () => {
    if (!authCtx.approveDeletion) return;

    try {
      await authCtx.deleteEntry(recordId, recordType);
      history("/");
    } catch (error) {
      console.error(error);
    }
  };

  runDelete();
}, [authCtx.approveDeletion, authCtx, recordId, recordType, history]);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/getbyid`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: recordId,
              type: recordType,
            }),
          }
        );
        const res = await responseData.json();
        // console.log('res',res)
        console.log('res.expense', res.expense)
        if (res.expense) {
          setProvidedAmount(res.expense.amount);
          setProvidedDescription(res.expense.description);
          setProvidedCategory(res.expense.category);
          setProvidedAccount(res.expense.accountType);
        } else if (res.revenue) {
          setProvidedAmount(res.revenue.amount);
          setProvidedDescription(res.revenue.description);
          setProvidedCategory(res.revenue.category);
          setProvidedAccount(res.revenue.accountType);
        }
        let date;
        if (res.expense) {
          if (res.expense.month < 10 || res.expense.day < 10) {
            date =
              res.expense.year +
              "-0" +
              res.expense.month +
              "-0" +
              res.expense.day;
          } else {
            date =
              res.expense.year +
              "-" +
              res.expense.month +
              "-" +
              res.expense.day;
          }
          setProvidedDate(date);
        } else if (res.revenue) {
          if (res.revenue.month < 10 || res.revenue.day < 10) {
            date =
              res.revenue.year +
              "-0" +
              res.revenue.month +
              "-0" +
              res.revenue.day;
          } else {
            date =
              res.revenue.year +
              "-" +
              res.revenue.month +
              "-" +
              res.revenue.day;
          }
          setProvidedDate(date);
        }
      } catch (err) {}
    };
    fetchPlace();
  }, [recordId, recordType]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')

    try{
      if(recordType==='revenue'){
        console.log('test')
        const requestPatchOptions={
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            "id": recordId,
            "transaction_type": recordType,
            "description": providedDescription,
            "revenue_balance": providedAmount,
            "date": providedDate,
            "category": providedCategory,
            "account_type":providedAccount,
          }),
        }
        
        await postingEditedRecord('revenue',requestPatchOptions)
      }
      else if(recordType==='transfer'){
        const requestPostOptions={
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            "id": recordId,
            "transaction_type": recordType,
            "description": providedDescription,
            "date": providedDate,
            "category": providedCategory,
            "revenue_balance": providedAmount,
            "account_type": providedAccount
          }),
        }
        try{
          await postingEditedRecord('revenue',requestPostOptions)
        }catch(e){
          console.log(e)
        }
      }
      else{
        const requestPatchOptions={
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            "id": recordId,
            "transaction_type": recordType,
            "description": providedDescription,
            "expense_balance": providedAmount,
            "date": providedDate,
            "account_type":providedAccount,
            "category": providedCategory
          }),
        }      
        await postingEditedRecord('expense',requestPatchOptions)
      }
      history(`/`);
    }catch(e){
        console.log(e)
      }
  };

  const postingEditedRecord=async (transactionType, requestPatchOptions)=>{
    
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${transactionType}/editrecord`, requestPatchOptions)

      const responseData=await res.json().catch(()=>null)
      console.log("status:", res.status);
      console.log("responseData:", responseData);
      if(!res.ok){
        throw new Error(responseData?.detail ? JSON.stringify(responseData.detail) : "Failed to edit record")
      }
      const data = responseData
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
    <Card className="editing">
      <form onSubmit={submitHandler}>
        <div className="mt-5 text-center">
          <h2>Edit Existing Record</h2>
          <p>
            Please select revenue or expense and add description to this record.
            When you finish, press Save. All fields should be filled.
          </p>
          <div className="d-flex justify-content-center">
            <div className="col-8 mb-4 mt-3">
              <div
                className={`control ${
                  validatedDate === false ? "invalid" : "check"
                }`}
              >
                <h6 className="form-label" htmlFor="description">
                  Record Date
                </h6>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-select field"
                  value={providedDate}
                  onChange={editdateHandler}
                  onBlur={editvalidateDateHandler}
                  min="2018-01-01"
                  max="2099-12-31"
                />
                {validatedDate === false && (
                  <p className="error-check">Please select record's date</p>
                )}
              </div>
              {recordType === "revenue" && (
                <div>
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
                      onChange={editcategoryHandler}
                      onBlur={editvalidateCategoryHandler}
                      required
                    >
                      <option defaultValue>Choose...</option>
                      {(providedAccount==='Chequing')&& (<option value="salary">Salary</option>)}
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
                        Please, select category
                      </p>
                    )}
                  </div>
                </div>
              )}
              {recordType === "transfer" && (
                <div>
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
                      <option value="Visa">Visa</option>
                      <option value="LineOfCredit">Line of Credit</option>
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
                      onChange={editcategoryHandler}
                      onBlur={editvalidateCategoryHandler}
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
                        Please, select category
                      </p>
                    )}
                  </div>
                </div>
              )}
              {recordType === "expense" && (
                <>
                <div
                  className={`control ${
                    validatedCategory === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="description">
                    Type of expense
                  </h6>
                  <select
                    id="gender"
                    className="form-select field"
                    value={providedCategory}
                    onChange={editcategoryHandler}
                    onBlur={editvalidateCategoryHandler}
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
              
                <div className={`control ${
                    validatedAccount === false ? "invalid" : "check"
                  }`}
                >
                  <h6 className="form-label" htmlFor="description">
                    Account Type
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
                      Please, choose type of expense category
                    </p>
                  )}
                </div>
              </>)}
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
                  onChange={editamountHandler}
                  onBlur={editvalidateAmountHandler}
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
                  onChange={editdescriptionHandler}
                  onBlur={editvalidateDescriptionHandler}
                />
                {validatedDescription === false && (
                  <p className="error-check">
                    Please, enter record description
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-5 d-flex justify-content-center">
          <Button type="submit" className="btn login mb-4">
            Save
          </Button>
          <Button className="btn login mb-4" to={"/"}>
            Cancel
          </Button>
          <Button
            className="btn login mb-4"
            onClick={authCtx.showMessage}
            type="button"
          >
            Delete
          </Button>
        </div>

        {authCtx.messageIsShown && (
          <Modal
            onClose={authCtx.closeMessage}
            info={<ConfirmMessage infoBool={authCtx.deleteTask} />}
          />
        )}
      </form>
    </Card>
  );
};

export default EditRecord;
