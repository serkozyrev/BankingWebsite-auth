import React, { useState, useContext } from "react";

import AuthContext from "../context/auth-context";
import Button from "../UI/Button/Button";
import "./NewCategories.css";

const NewCategories = (props) => {
  const authCtx = useContext(AuthContext);
  const [providedName, setProvidedName] = useState("");
  const [validatedName, setValidName] = useState();
  const [providedDescription, setProvidedDescription] = useState("");
  const [validatedDescription, setValidDescription] = useState();


  const nameHandler = (event) => {
    setProvidedName(event.target.value);
  };

  const validateNameHandler = () => {
    setValidName(providedName !== "");
  };

  const descriptionHandler = (event) => {
    setProvidedDescription(event.target.value);
  };

  const validateDescriptionHandler = () => {
    setValidDescription(providedDescription !== "");
  };

  const submitHandler = async(event) => {
    event.preventDefault();

    const myHeaders= new Headers()
    myHeaders.append('Authorization', 'Bearer ' + authCtx.authToken)
    myHeaders.append('Content-Type','application/json')
    
    const requestAIOptions={
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
        "category_name": providedName,
        "description": providedDescription
    }),
    }
    try{
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/categories`, requestAIOptions)

        if(!res.ok){
            const err=(await res).json().catch(()=>null)
            throw new Error(err?.detail || "Failed to add record")
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
            await postingNewRecord(requestOptions)
        }catch(e){
            console.log(e)
        }
        
    }catch(e){
        console.log(e)
    }    
};

const postingNewRecord= async(requestPostOptions)=>{
    
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/categories/all`, requestPostOptions)
    
    if(!res.ok){
        const err=(await res).json().catch(()=>null)
        throw new Error(err?.detail || "Failed to add record")
    }
    const data = await res.json()
    console.log("data", data)
      authCtx.setCategories(data)
      
  }
  
  return (
    <form onSubmit={submitHandler}>
      <div className="mt-5 text-center">
        <h2>New Category</h2>
        <p>
          Please write category name in this format "starting with small letter, if you have two words write them as one
          and start the second one with upper case letter (twoWords)".

          Please write category name in the description normally as it should be.
        </p>        
        <div className="d-flex justify-content-center">
          <div className="col-8 mb-4 mt-3">
            <div
                className={`control ${
                validatedName === false ? "invalid" : "check"
                }`}
            >
                <h6 className="form-label" htmlFor="amount">
                Record Amount{" "}
                </h6>
                <input
                type="text"
                id="amount"
                className="form-control field"
                value={providedName}
                onChange={nameHandler}
                onBlur={validateNameHandler}
                />
                {validatedName === false && (
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
        </div>
      </div>
      <div className="mb-5 d-flex justify-content-center">
        <Button type="submit" className="btn login mb-4">
          Save
        </Button>
      </div>
    </form>
  );
};

export default NewCategories;
