import React, { useState, useContext, useEffect } from "react";

import AuthContext from "../context/auth-context";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import ConfirmMessage from "../Website/ConfirmMessage";
import "./AccountCreation.css";

const AccountCreation = (props) => {
  const authCtx = useContext(AuthContext);
  const [providedAccountDescription, setProvidedAccountDescription] = useState("");
  const [validatedAccountDescription, setValidAccountDescription] = useState();
  const [providedAccountKind, setProvidedAccountKind] = useState("");
  const [validatedAccountKind, setValidAccountKind] = useState();
  const [accountCreationApproved, setAccountCreationApproved] = useState(false);


  const descriptionHandler = (event) => {
    setProvidedAccountDescription(event.target.value);
  };

  const validateDescriptionHandler = () => {
    setValidAccountDescription(providedAccountDescription !== "");
  };

  const accountKindHandler = (event) => {
    setProvidedAccountKind(event.target.value);
  };

  const validateAccountKindHandler = () => {
    setValidAccountKind(providedAccountKind !== "");
  };

  const accountCreationConfirmationHandler = () => {
    setAccountCreationApproved(true);
    authCtx.closeConfirmAccountCreationMessage()
  };

  useEffect(()=>{
    if(!accountCreationApproved) return

    submitHandler()
    
  },[accountCreationApproved])
  
  const submitHandler = async(event) => {
    event?.preventDefault();

    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')
    
    const requestAIOptions={
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
        "description": providedAccountDescription,
        "user_balance": 0,
        "account_kind": providedAccountKind
    }),
    }
    try{
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/account`, requestAIOptions)

      if(!res.ok){
          const err=(await res).json().catch(()=>null)
          throw new Error(err?.detail || "Failed to create account")
      }
      const data = await res.json()
      props.dataFunc(data.message);
      console.log('data', data) 
      authCtx.setAccounts(data.accounts.account_info.accounts)
      authCtx.setExpenses(data.accounts.expenses)
      authCtx.closeAccountCreationModal();
      props.infoBool();
      
      setAccountCreationApproved(false)
      setProvidedAccountDescription("")
    }catch(e){
        console.log(e)
    }    
};
  

  const isDisabled = providedAccountDescription.length === 0 || providedAccountKind === ""
  return (
    <form>
      <div className="mt-5 text-center">
        <h2>Account Creation</h2>
        <p>
          Please write the name of the account. Also, select asset or debt kind of the account so the system knows if it is Debit account or Credit.
        </p>        
        <div className="d-flex justify-content-center">
            <div className="col-8 mb-4 mt-3">
                <div
                    className={`control ${
                    validatedAccountDescription === false ? "invalid" : "check"
                    }`}
                >
                    <h6 className="form-label" htmlFor="accountDescription">
                    Account name
                    </h6>
                    <textarea
                        rows="1"
                        className="form-control field"
                        id="accountInformation"
                        name="accountInformation"
                        value={providedAccountDescription}
                        onChange={descriptionHandler}
                        onBlur={validateDescriptionHandler}
                    />
                    {validatedAccountDescription === false && (
                    <p className="error-check">Please select record's date</p>
                    )}
                </div>
            </div>
            <div className="col-8 mb-4 mt-3">
                <div
                    className={`control ${
                    validatedAccountKind === false ? "invalid" : "check"
                    }`}
                >
                    <h6 className="form-label" htmlFor="accountDescription">
                    Account type
                    </h6>
                    <select
                        id="accountType"
                        className="form-select field"
                        value={providedAccountKind}
                        onChange={accountKindHandler}
                        onBlur={validateAccountKindHandler}
                        required
                    >
                        <option defaultValue>Choose...</option>
                        <option id="asset" value="asset">Asset</option>
                        <option id="debt" value="debt">Debt</option>
                        
                    </select>
                    {validatedAccountKind === false && (
                    <p className="error-check">Please select account type </p>
                    )}
                </div>
            </div>
        </div>
      </div>
      <div className="mb-5 d-flex justify-content-center">
        <Button type="button" className={`btn login mb-4 ${isDisabled ? "disabled-btn" : ""}`} disabled={isDisabled} onClick={authCtx.showConfirmAccountCreationMessage}>
          Submit
        </Button>
      </div>

      {authCtx.accountCreationMessagePopUpWindow && (
          <Modal
            onClose={authCtx.closeConfirmAccountCreationMessage}
            info={<ConfirmMessage infoBool={accountCreationConfirmationHandler} account="Do you want to create this account?"/>}
          />
        )}
    </form>
  );
};

export default AccountCreation;
