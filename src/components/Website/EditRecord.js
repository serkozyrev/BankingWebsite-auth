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
  const [providedType, setProvidedType] = useState("");

  const [providedTargetAccountId, setProvidedTargetAccountId] = useState("");
  const [validatedTargetAccount, setValidTargetAccount] = useState();

  const recordId = useParams().rid;

  const targetAccountHandler = (event) => {
    setProvidedTargetAccountId(event.target.value);
  };

  const validateTargetAccountHandler = () => {
    setValidTargetAccount(providedTargetAccountId !== "");
  };

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

  const isDisabled = !providedAmount || Number(providedAmount) <=0 || !providedDescription || !providedDate || !providedCategory

  useEffect(() => {
    const runDelete = async () => {
      if (!authCtx.approveDeletion) return;

      try {
        await authCtx.deleteEntry(recordId);
        history("/");
      } catch (error) {
        console.error(error);
      }
    };

    runDelete();
  }, [authCtx.approveDeletion, authCtx, recordId, history]);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const myHeaders= new Headers()
        myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
        myHeaders.append('Content-Type','application/json')
        const responseData = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/getbyid`,
          {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
              id: recordId
              // type: recordType,
            }),
          }
        );
        const res = await responseData.json();
        // console.log('res',res)
        console.log('res.expense', res.expense)
        
        setProvidedAmount(res.expense.amount);
        setProvidedDescription(res.expense.description);
        setProvidedCategory(res.expense.category);
        setProvidedAccount(res.expense.account_id);
        setProvidedType(res.expense.type)
        setProvidedTargetAccountId(res.expense.transactionById)
        
        let date;
        
        
        date =
            res.expense.year +
            (res.expense.month < 10?"-0":"-") +
            res.expense.month +
            (res.expense.day < 10?"-0":"-") +
            res.expense.day;
        setProvidedDate(date);
        
      } catch (err) {}
    };
    fetchPlace();
  }, [recordId]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')

    try{
     
        const requestPatchOptions={
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify({
            "id": recordId,
            "description": providedDescription,
            "expense_balance": providedAmount,
            "date": providedDate,
            "category": providedType === "transfer" ? "transfer" : providedCategory,
            "transaction_type": providedType,
            "account_id": Number(providedAccount),
            "account_type": providedDescription,
            ...(providedType === "transfer" && {
              "target_account_id": Number(providedTargetAccountId)})
          }),
        }      
        await postingEditedRecord('expense',requestPatchOptions)
      
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
      authCtx.setAccounts(data.account_info.accounts)         
      if(transactionType==='revenue'){
        authCtx.setRevenuesList(data.revenues);
      }
      else{
        authCtx.totalSum(data.totalChequing);
        authCtx.totalSumDina(data.totalVisa);
        authCtx.totalSumSnezhana(data.totalLineOfCredit);
        authCtx.setExpenses(data.expenses)
      }
  }

  return (
    <Card className="editing">
      <form onSubmit={submitHandler}>
        <div className="mt-5 text-center">
          <h2>Edit Existing Record</h2>
          <p>
            You can update by pressing Save, delete record or press cancel to return to previous page.
            All fields should be filled.
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
              {providedType === "revenue" && (
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
                      {authCtx.accounts
                        .filter((account) => account.account_kind==='asset')
                        .map((account) => (
                          <option key={account.id} id={account.id} value={account.id}>
                            {account.description}
                          </option>
                      ))}
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
                      <option value="salary">Salary</option>
                    </select>
                    {validatedCategory === false && (
                      <p className="error-check">
                        Please, select category
                      </p>
                    )}
                  </div>
                </div>
              )}
              {providedType === "transfer" && (
                <div>
                  <div
                    className={`control ${
                      validatedAccount === false ? "invalid" : "check"
                    }`}
                  >
                    <h6 className="form-label" htmlFor="account">
                      From
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
                      {authCtx.accounts.map((account) => (
                        <option key={account.id} id={account.id} value={account.id}>
                          {account.description}
                        </option>
                      ))}
                    </select>
                    {validatedAccount === false && (
                      <p className="error-check">
                        Please, select from what account you want to grab money
                      </p>
                    )}
                  </div>
                  <div
                    className={`control ${
                      validatedCategory === false ? "invalid" : "check"
                    }`}
                  >
                    <h6 className="form-label" htmlFor="category">
                      To
                    </h6>
                    <select
                      id="gender"
                      className="form-select field"
                      value={providedCategory}
                      onChange={editcategoryHandler}
                      onBlur={editvalidateCategoryHandler}
                      required
                    >
                      <option value="transfer">Transfer</option>
                    </select>
                    
                  </div>
                  <div
                    className={`control ${
                      validatedTargetAccount === false ? "invalid" : "check"
                    }`}
                  >
                    <h6 className="form-label" htmlFor="category">
                      To
                    </h6>
                    <select
                      id="gender"
                      className="form-select field"
                      value={providedTargetAccountId}
                      onChange={targetAccountHandler}
                      onBlur={validateTargetAccountHandler}
                      required
                    >
                      <option defaultValue>Choose...</option>                    
                      {authCtx.accounts.map((account) => (
                          <option key={account.id} id={account.id} value={account.id}>
                            {account.description}
                          </option>
                        ))}
                    </select>
                    {(validatedTargetAccount === false || providedAccount === providedTargetAccountId) && (
                      <p className="error-check">
                        Please, select where you want to transfer money. From and To options cannot be the same.
                      </p>
                    )}
                  </div>
                </div>
              )}
              {providedType === "expense" && (
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
                    {authCtx.categories.map((category) => (
                      <option key={category.category_id} id={category.category_id} value={category.category_name}>
                        {category.description}</option>
                    ))}
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
                    {authCtx.accounts.map((account) => (
                        <option key={account.id} id={account.id} value={account.id}>
                          {account.description}
                        </option>
                      ))}
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
          <Button type="submit" className={`btn login mb-4 ${isDisabled ? "disabled-btn" : ""}`} disabled={isDisabled}>
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
