import React, { useState, useContext, useEffect, useCallback } from "react";

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
  const [accountDeletionApproved, setAccountDeletionApproved] = useState(false);
  const [isChecked, setIsChecked] = useState(false)
  const [providedAccountID, setProvidedAccountID] = useState([]);
  const [validatedName, setValidName] = useState();

  const handleIsChecked = ()=>{
    setIsChecked(!isChecked)
  }

  const nameHandler = (event) => {
    let categoryId = Number(event.target.id.split("-")[1])
    let isChecked = event.target.checked
    setProvidedAccountID((prev)=>{
      if(isChecked){
        return [...prev, categoryId]
      }else{
        return prev.filter((id)=> id!== categoryId)
      }
    });
  };
  

  const validateNameHandler = () => {
    setValidName(providedAccountID.length !==0);
  };

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
  const accountDeletionConfirmationHandler = () => {
    setAccountDeletionApproved(true);
    authCtx.closeConfirmAccountCreationMessage()
  };  

  const hostAllAccounts= useCallback(async(requestPostOptions)=>{
    try{
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/account/all`, requestPostOptions)
      
        if(!res.ok){
            const err=(await res).json().catch(()=>null)
            throw new Error(err?.detail || "Failed to add record")
        }
        const data = await res.json()
        console.log("data", data)
        // authCtx.setAccounts(data)
        authCtx.setAccountSelection(data)
        // setProvidedAccountID([])
      }catch(e){
        console.log(e)
    }   
  },[])

  useEffect(() => {
    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    const requestOptions={
        method:'GET',
        headers:myHeaders
    }
    
    hostAllAccounts(requestOptions)
  },[authCtx.authToken, hostAllAccounts])
  
  const submitHandler = useCallback(async(event) => {
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
          const err=await res.json().catch(()=>null)
          throw new Error(err?.detail || "Failed to create account")
      }
      const data = await res.json()
      props.dataFunc(data.message);
      // console.log('data', data) 
      authCtx.setAccounts(data.accounts.account_info.accounts)
      authCtx.setExpenses(data.accounts.expenses)
      authCtx.closeAccountCreationModal();
      props.infoBool();
      
      setAccountCreationApproved(false)
      
      setProvidedAccountDescription("")
      setProvidedAccountKind("")
    }catch(e){
        console.log(e)
    }    
  },[props, providedAccountDescription, providedAccountKind])
  
  useEffect(()=>{
    if(!accountCreationApproved) return

    submitHandler()
    
  },[accountCreationApproved, submitHandler])

  const submitAccountHandler = useCallback(async(event) => {
    event?.preventDefault();

    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')
    
    // console.log('requestoptions', providedAccountID)
    const requestDeletionOptions={
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      "account_id": providedAccountID
    }),
    }
    try{
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/account/deleterecord`, requestDeletionOptions)

      if(!res.ok){
          const err=await res.json().catch(()=>null)
          throw new Error(err?.detail || "Failed to delete record")
      }
      const data = await res.json()
      // console.log('data after deletion', data)

      props.dataFunc(data.message);
      authCtx.setAccounts(data.info.account_info.accounts)
      authCtx.setExpenses(data.info.expenses)
      authCtx.closeAccountCreationModal();
      props.infoBool();
      
      const myHeaders= new Headers()
      myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
      const requestOptions={
          method:'GET',
          headers:myHeaders
      }
      try{
          await hostAllAccounts(requestOptions)
      }catch(e){
          console.log(e)
      }
      setAccountDeletionApproved(false)
      
    }catch(e){
        console.log(e)
    }    
  },[providedAccountID, props, hostAllAccounts])

  useEffect(()=>{
    if(!accountDeletionApproved) return
    // console.log("providedname", providedAccountID)
    submitAccountHandler()
    
  },[accountDeletionApproved, submitAccountHandler])

  const isDisabled = providedAccountDescription.length === 0 || providedAccountKind === ""
  const isAccountSelectionDisabled = providedAccountID.length === 0
  return (
    <form>
      <div className="mt-5 text-center">
        <h2>Account Creation</h2>
        <p>
          Put a check mark in the box if you want to delete any of the accounts. Please write the name of the account. 
          Also, select asset or debt kind of the account so the system knows if it is Debit account or Credit.
        </p>
        <div className="d-flex justify-content-center">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="flexCheckDefault"
              
              checked={isChecked}
              onChange={handleIsChecked}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              {isChecked ? "Using Delete Account":"Using Create Account"}
            </label>
          </div>
        </div>     
        {!isChecked && (<div className="d-flex justify-content-center">
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
                  <option id="asset" value="asset">Debit</option>
                  <option id="debt" value="debt">Credit</option>
                  
              </select>
              {validatedAccountKind === false && (
              <p className="error-check">Please select account type </p>
              )}
            </div>
          </div>
        </div>)}
        {isChecked && (<div className="d-flex justify-content-center">
          <div  style={{ minWidth: "250px" }} className="text-start">
            {authCtx.accountSelection.map((account) => (
              <div key={account.account_id} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`check-${account.account_id}`}
                  value={account.description}
                  onChange={nameHandler}
                  onBlur={validateNameHandler}
                />
                <label
                  className="form-check-label justify-content-start"
                  htmlFor={`check-${account.account_id}`}
                >
                  {account.description}
                </label>
              </div>
            ))}
          </div>
        </div>)}
      </div>
      {!isChecked &&(<div className="mb-5 d-flex justify-content-center">
        <Button type="button" className={`btn login mb-4 ${isDisabled ? "disabled-btn" : ""}`} disabled={isDisabled} onClick={authCtx.showConfirmAccountCreationMessage}>
          Submit
        </Button>
      </div>)}
      {isChecked &&(<div className="mb-5 d-flex justify-content-center">
        <Button type="button" className={`btn login mb-4 ${isAccountSelectionDisabled ? "disabled-btn" : ""}`} disabled={isAccountSelectionDisabled} onClick={authCtx.showConfirmAccountCreationMessage}>
          Delete
        </Button>
      </div>)}

      {!isChecked &&(<>{authCtx.accountCreationMessagePopUpWindow && (
          <Modal
            onClose={authCtx.closeConfirmAccountCreationMessage}
            info={<ConfirmMessage infoBool={accountCreationConfirmationHandler} account="Do you want to create this account?"/>}
          />
        )}</>)}
      {isChecked &&(<>{authCtx.accountCreationMessagePopUpWindow && (
          <Modal
            onClose={authCtx.closeConfirmAccountCreationMessage}
            info={<ConfirmMessage infoBool={accountDeletionConfirmationHandler} account="Do you want to delete this account?"/>}
          />
        )}</>)}
    </form>
  );
};

export default AccountCreation;
