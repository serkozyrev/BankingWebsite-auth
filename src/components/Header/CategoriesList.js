import React, { useState, useContext, useEffect } from "react";

import AuthContext from "../context/auth-context";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import ConfirmMessage from "../Website/ConfirmMessage";
import "./CategoriesList.css";

const CategoriesList = (props) => {
  const authCtx = useContext(AuthContext);
  const [providedName, setProvidedName] = useState([]);
  const [validatedName, setValidName] = useState();
  const [categoryDeletionApproved, setCategoryDeletionApproved] = useState(false);


  const nameHandler = (event) => {
    let categoryId = Number(event.target.id.split("-")[1])
    let isChecked = event.target.checked
    setProvidedName((prev)=>{
      if(isChecked){
        return [...prev, categoryId]
      }else{
        return prev.filter((id)=> id!== categoryId)
      }
    });
  };
  console.log('providedName', providedName)

  const validateNameHandler = () => {
    setValidName(providedName.length !==0);
  };
  // console.log('validName',providedName.length, validatedName)

  const categoryDeletionConfirmationHandler = () => {
    setCategoryDeletionApproved(true);
    authCtx.closeConfirmCategoryMessage()
  };


  const hostAllCategories= async(requestPostOptions)=>{
    try{
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/categories/all`, requestPostOptions)
      
        if(!res.ok){
            const err=(await res).json().catch(()=>null)
            throw new Error(err?.detail || "Failed to add record")
        }
        const data = await res.json()
        // console.log("data", data)
          authCtx.setCategories(data)
      }catch(e){
        console.log(e)
    }   
  }
  useEffect(() => {
    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    const requestOptions={
        method:'GET',
        headers:myHeaders
    }
    
    hostAllCategories(requestOptions)
  },[])

  useEffect(()=>{
    if(!categoryDeletionApproved) return

    submitHandler()
    
  },[categoryDeletionApproved])
  
  const submitHandler = async(event) => {
    event?.preventDefault();

    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')
    
    const requestAIOptions={
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
        "category_id": providedName
    }),
    }
    try{
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/categories/deleterecord`, requestAIOptions)

      if(!res.ok){
          const err=(await res).json().catch(()=>null)
          throw new Error(err?.detail || "Failed to delete record")
      }
      const data = await res.json()

      props.dataFunc(data.message);
      
      authCtx.closeCategoryModal();
      props.infoBool();
      
      const myHeaders= new Headers()
      myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
      const requestOptions={
          method:'GET',
          headers:myHeaders
      }
      try{
          await hostAllCategories(requestOptions)
      }catch(e){
          console.log(e)
      }
      setCategoryDeletionApproved(false)
      setProvidedName([])
    }catch(e){
        console.log(e)
    }    
  };
  

  const isDisabled = providedName.length === 0
  return (
    <form>
      <div className="mt-5 text-center">
        <h2>New Category</h2>
        <p>
          Please select the category you want to delete.
        </p>        
        <div className="d-flex justify-content-center">
            <div className="form-check d-flex flex-row flex-wrap gap-3">
                {authCtx.categories.map((category) => (
                  <div key={category.category_id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`check-${category.category_id}`}
                      value={category.category_name}
                      onChange={nameHandler}
                      onBlur={validateNameHandler}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`check-${category.category_id}`}
                    >
                      {category.description}
                    </label>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <div className="mb-5 d-flex justify-content-center">
        <Button type="button" className={`btn login mb-4 ${isDisabled ? "disabled-btn" : ""}`} disabled={isDisabled} onClick={authCtx.showConfirmCategoryMessage}>
          Delete
        </Button>
      </div>

      {authCtx.categoryMessagePopUpWindow && (
          <Modal
            onClose={authCtx.closeConfirmCategoryMessage}
            info={<ConfirmMessage infoBool={categoryDeletionConfirmationHandler} />}
          />
        )}
    </form>
  );
};

export default CategoriesList;
