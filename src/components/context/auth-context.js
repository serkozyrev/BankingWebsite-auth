import React, { createContext, useCallback, useEffect, useState } from "react";



const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: (token) => {},
});

let logoutTimer;
export const AuthContextProvider = (props) => {
  
  const [popupIsShown, setpopupIsShown] = useState(false);
  const [searchSelected, setSearchSelected] = useState(false);
  const [messageIsShown, setMessageIsShown] = useState(false);
  const [currencyRate, setCurrencyRate] = useState("");
  const [expenseTotalPapa, setExpenseTotalPapa] = useState(0);
  const [expensesList, setExpensesList] = useState([]);
  const [expensesListDina, setExpensesListDina] = useState([]);
  const [expensesListLineOfCredit, setExpensesListLineOfCredit] = useState([]);
  const [revenuesList, setRevenuesList] = useState([]);
  const [accountBalanceMine, setAccountBalanceMine] = useState("");
  const [accountBalanceDina, setAccountBalanceDina] = useState("");
  const [accountBalanceSnezhana, setAccountBalanceSnezhana] = useState("");
  const [expenseTotalDina, setExpenseTotalDina] = useState(0);
  const [expenseTotalSnezhana, setExpenseTotalSnezhana] = useState(0);
  const [approveDeletion, setApproveDeletion] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [searchexpenseDina, setSearchExpenseDina] = useState([]);
  const [searchexpenses, setSearchExpenses] = useState([]);
  const [searchexpenseChequing, setSearchExpenseChequing] = useState([]);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [usernameLocal, setLocalUsername] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [authToken,setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)
  const [userId, setUserId] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)
  const [infoAnalysis, setInfoAnalysis] = useState([]);
  const [infoAnalysisMine, setInfoAnalysisMine] = useState([]);
  const [infoAnalysisLineOfCredit, setInfoAnalysisLineOfCredit] = useState([]);
  const [categories, setCategories] = useState([])
  const [categoryModalPopUpWindow, setCategoryModalPopUpWindow] = useState(false);
  const [categoryMessagePopUpWindow, setCategoryMessagePopUpWindow] = useState(false);
  

  // const rateHandler = (data) => {
  //   setCurrencyRate(data);
  // };

  const totalSum = (data) => {
    setExpenseTotalPapa(data);
  };

  const totalSumSnezhana = (data) => {
    setExpenseTotalSnezhana(data);
  };

  const totalSumDina = (data) => {
    setExpenseTotalDina(data);
  };
  const usernameHandler = (event) => {
    setUsername(event.target.value);
  };
  const emailHandler = (event) => {
    setEmail(event.target.value);
  };
  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const showModalHandler = () => {
    setpopupIsShown(true);
  };

  const closeModalHandler = () => {
    setpopupIsShown(false);
  };

  const showMessageHandler = () => {
    setMessageIsShown(true);
  };

  const closeMessageHandler = () => {
    setMessageIsShown(false);
  };
  const showCategoryMessageHandler = () => {
    setCategoryMessagePopUpWindow(true);
  };

  const closeCategoryMessageHandler = () => {
    setCategoryMessagePopUpWindow(false);
  };

  const deletionConfirmHandler = () => {
    setApproveDeletion(true);
    closeMessageHandler();
  };

  const showSignInHandler = () => {
    setOpenSignIn(!openSignIn);
  }
  const showSignUpHandler = () => {
    setOpenSignUp(!openSignUp);
  };  
  const newCategoryRecordShowHandler = () => {
    setCategoryModalPopUpWindow(true)
  };

  const newCategoryRecordCloseHandler = () => {
    setCategoryModalPopUpWindow(false)
  };

  useEffect(()=>{
    if(!authToken) return
    const fetchCategories = async()=>{
      try{
        const myHeaders= new Headers()
        myHeaders.append('Authorization', 'Bearer ' + authToken)
        const requestOptions={
              method:'GET',
              headers:myHeaders
        }
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/categories/all`, requestOptions
        )
        if (!response.ok) {
            const err = await response.json().catch(() => null);
            console.log("fetch /categories/all failed", response.status, err);
            throw new Error(err?.detail || "Something went wrong!");
          }
          const responseData = await response.json();
          // console.log('responseData',responseData)
          setCategories(responseData)
        }catch(e){
          console.log('categories fetch error: ',e)
        }
      }
      fetchCategories()
    },[authToken])
  useEffect(() => {
      if(!authToken) return;
      const fetchRevenues = async () => {
        try{
          const myHeaders= new Headers()
          myHeaders.append('Authorization', 'Bearer ' + authToken)
          const requestOptions={
                method:'GET',
                headers:myHeaders
            }
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/revenue/all`, requestOptions
          );
    
          if (!response.ok) {
            const err = await response.json().catch(() => null);
            console.log("fetch /revenue/all failed", response.status, err);
            throw new Error(err?.detail || "Something went wrong!");
          }
          const responseData = await response.json();
          // console.log('responseData', responseData)
          setRevenuesList(responseData.revenues);
          setAccountBalanceDina(responseData.account_info.visa);
          setAccountBalanceMine(responseData.account_info.chequing); 
          setAccountBalanceSnezhana(responseData.account_info.line_of_credit);
        }
        catch(error){
          console.log("expense fetch error:", error)
        }
      };
      
      fetchRevenues()
    }, [authToken]);

  useEffect(() => {
    if(!authToken) return;
    const fetchExpenses = async () => {
      try{
        const myHeaders= new Headers()
        myHeaders.append('Authorization', 'Bearer ' + authToken)
        const requestOptions={
              method:'GET',
              headers:myHeaders
          }
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/expense/all`, requestOptions
        );

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          console.log("fetch /expense/all failed", response.status, err);
          throw new Error(err?.detail || "Something went wrong!");
        }
        const responseData = await response.json();
        setExpensesListDina(responseData.expensesVisa);
        setExpensesList(responseData.expensesChequing);
        setExpensesListLineOfCredit(responseData.expensesLineOfCredit);
        totalSum(responseData.totalChequing);
        totalSumDina(responseData.totalVisa);
        totalSumSnezhana(responseData.totalLineOfCredit);
        setAccountBalanceDina(responseData.account_info.visa);
        setAccountBalanceMine(responseData.account_info.chequing); 
        setAccountBalanceSnezhana(responseData.account_info.line_of_credit);
      }
      catch(error){
        console.log("expense fetch error:", error)
      }
    };
    
    fetchExpenses()
  }, [authToken]);
  const signIn = async(e)=>{
    e?.preventDefault();

    // let formData= new FormData()
    // formData.append('username', username)
    // formData.append('password', password)
    let formData= new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      
      const data = await response.json();
      // console.log('data', data)
      setAuthToken(data.access_token);
      setAuthTokenType(data.token_type);
      setUserId(data.user_id);
      setLocalUsername(data.username);
      login(data.access_token, data.user_id, data.token_type, data.username)
      setUsername("");
      setPassword("");
      setEmail("");
      showSignInHandler()
    } catch (error) {
      console.log(error);
      alert(error.message || "Login failed");
    }
  }
  const signUp = async (e)=>{
    e?.preventDefault();
    
    let formDataSignUp= JSON.stringify({
      username:username,
      email:email,
      password:password
    })

    const requestOptions = {
      method:'POST',
      headers:{"Content-Type": "application/json"},
      body:formDataSignUp
    }
    try{
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/user/', requestOptions)

      const result = await response.json()
      if(!response.ok){
        throw new Error(result.detail)
      }
      signIn()  
    }catch(e){
      alert(e.message)
    }
  }  

  const signOut= useCallback((event)=>{
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId(null)
    setTokenExpirationDate(null)
    localStorage.removeItem("userData")
    setLocalUsername('')
    setUsername("")
    setPassword("")
    setEmail("")
    setRevenuesList([]);
    setExpensesListDina([]);
    setExpensesListLineOfCredit([]);
    setExpensesList([]);
    setExpenseTotalPapa(0);
    setExpenseTotalDina(0);
    setExpenseTotalSnezhana(0);
    setAccountBalanceDina("");
    setAccountBalanceMine(""); 
    setAccountBalanceSnezhana("");
    setInfoAnalysis([])
    setInfoAnalysisMine([])
    setInfoAnalysisLineOfCredit([])
    setCategories([])
  },[])
  
  const login = useCallback((token,uid, authTokenType, username, expirationDate)=>{
    setAuthToken(token)
    setAuthTokenType(authTokenType)
    setLocalUsername(username)
    setUserId(uid)
    const tokenExpirationDate = expirationDate ? new Date(expirationDate) : new Date(new Date().getTime()+1000*60*60)
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem("userData", JSON.stringify({
      token: token,
      tokenType: authTokenType,
      userId: uid,
      username:username,
      expiration: tokenExpirationDate.toISOString()
    }))
  },[])
  useEffect(() => {
    
    if (authToken && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      
      if (remainingTime <=0){
        signOut()
        return
      }
      // console.log('tokenexpiration', remainingTime)
      logoutTimer = setTimeout(signOut, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
    return () => clearTimeout(logoutTimer);
  }, [authToken, signOut, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.token,
        storedData.userId,
        storedData.tokenType,
        storedData.username,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  const copyPreviousEntry = (id, type) => {
    try {
      const myHeaders= new Headers()
      myHeaders.append('Authorization', 'Bearer ' + authToken)
      myHeaders.append("Content-Type", "application/json")
      fetch(`${process.env.REACT_APP_BACKEND_URL}/${
        type === "revenue" ? "revenue" : "expense"
      }/copyrecord`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          id: id,
          type: type,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          console.log('data', data)
          setAccountBalanceDina(data.account_info.visa);
          setAccountBalanceMine(data.account_info.chequing); 
          setAccountBalanceSnezhana(data.account_info.line_of_credit);            
          if(type==='revenue'){
            setRevenuesList(data.revenues);
          }
          else{
            setExpensesList(data.expensesChequingLineOfCredit);
            setExpensesListDina(data.expensesVisa);
            totalSum(data.totalChequing);
            totalSumDina(data.totalVisa);
            totalSumSnezhana(data.totalLineOfCredit);
          }
        });
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteEntry = (id, type) => {
    try {
      const myHeaders= new Headers()
      myHeaders.append('Authorization', 'Bearer ' + authToken)
      myHeaders.append("Content-Type", "application/json")
      fetch(`${process.env.REACT_APP_BACKEND_URL}/${
        type === "revenue" ? "revenue" : "expense"
      }/deleterecord`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          id: id,
          type: type,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          setAccountBalanceDina(data.account_info.visa);
          setAccountBalanceMine(data.account_info.chequing); 
          setAccountBalanceSnezhana(data.account_info.line_of_credit);            
          if(type==='revenue'){
            setRevenuesList(data.revenues);
          }
          else{
            setExpensesList(data.expensesChequingLineOfCredit);
            setExpensesListDina(data.expensesVisa);
            totalSum(data.totalChequing);
            totalSumDina(data.totalVisa);
            totalSumSnezhana(data.totalLineOfCredit);
          }
          setApproveDeletion(false);
        });
    } catch (e) {
      alert(e.message);
    }
  };

  const contextValue = {
    categoryMessagePopUpWindow,
    setCategoryMessagePopUpWindow,
    showConfirmCategoryMessage: showCategoryMessageHandler,
    closeConfirmCategoryMessage: closeCategoryMessageHandler,
    showCategoryModal:newCategoryRecordShowHandler,
    closeCategoryModal:newCategoryRecordCloseHandler,
    categoryModalPopUpWindow,
    setInfoAnalysis,
    setInfoAnalysisMine,
    setInfoAnalysisLineOfCredit,
    infoAnalysisLineOfCredit,
    infoAnalysis,
    infoAnalysisMine,
    formIsValid,
    setFormIsValid,
    deleteTask: deletionConfirmHandler,
    messageIsShown,
    approveDeletion,
    showMessage: showMessageHandler,
    closeMessage: closeMessageHandler,
    currencyRate,
    expenseTotalPapa,
    expenseTotalDina,
    searchSelected,
    setSearchSelected,
    expenseTotalSnezhana,
    searchexpenses,
    searchexpenseDina,
    searchexpenseChequing,
    setSearchExpenses,
    setSearchExpenseDina,
    setSearchExpenseChequing,
    // rateHandler,
    totalSum,
    totalSumDina,
    totalSumSnezhana,
    setExpensesList,
    setExpensesListDina,
    setExpensesListLineOfCredit,
    setRevenuesList,
    copyPreviousEntry,
    deleteEntry,
    revenuesList,
    expensesList,
    expensesListDina,
    expensesListLineOfCredit,
    popupIsShown,
    accountBalanceDina,
    accountBalanceMine,
    accountBalanceSnezhana,
    setAccountBalanceDina,
    setAccountBalanceMine,
    setAccountBalanceSnezhana,
    showModal: showModalHandler,
    closeModal: closeModalHandler,
    usernameLocal, 
    username, 
    password, 
    email, 
    authToken, 
    authTokenType, 
    userId,
    openSignIn,
    openSignUp,
    signUp,
    signIn,
    signOut,
    usernameHandler,
    emailHandler,
    passwordHandler,
    showSignInHandler,
    showSignUpHandler,
    categories,
    setCategories
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
