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
  const [expensesList, setExpensesList] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expensesListDina, setExpensesListDina] = useState([]);
  const [expensesListLineOfCredit, setExpensesListLineOfCredit] = useState([]);
  const [revenuesList, setRevenuesList] = useState([]);
  const [accountBalanceMine, setAccountBalanceMine] = useState("");
  const [accountBalanceDina, setAccountBalanceDina] = useState("");
  const [accountBalanceSnezhana, setAccountBalanceSnezhana] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [expenseTotalPapa, setExpenseTotalPapa] = useState(0);
  const [expenseTotalDina, setExpenseTotalDina] = useState(0);
  const [expenseTotalSnezhana, setExpenseTotalSnezhana] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalVisaPages, setTotalVisaPages] = useState(1);
  const [totalChequingPages, setTotalChequingPages] = useState(1);
  const [totalLineOfCreditPages, setTotalLineOfCreditPages] = useState(1);
  const [approveDeletion, setApproveDeletion] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [searchListExpenses, setSearchListExpenses] = useState([]);
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
  const [info, setInfo] = useState([]);
  const [categories, setCategories] = useState([])
  const [categoryModalPopUpWindow, setCategoryModalPopUpWindow] = useState(false);
  const [categoryMessagePopUpWindow, setCategoryMessagePopUpWindow] = useState(false);
  const [accountCreationModalPopUpWindow, setAccountCreationModalPopUpWindow] = useState(false);
  const [accountCreationMessagePopUpWindow, setAccountCreationMessagePopUpWindow] = useState(false);
  

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

  const showCategoryMessageHandler = () => {
    setCategoryMessagePopUpWindow(true);
  };

  const closeCategoryMessageHandler = () => {
    setCategoryMessagePopUpWindow(false);
  };
  
  const newCategoryRecordShowHandler = () => {
    setCategoryModalPopUpWindow(true)
  };

  const newCategoryRecordCloseHandler = () => {
    setCategoryModalPopUpWindow(false)
  };
  const showAccountCreationMessageHandler = () => {
    setAccountCreationMessagePopUpWindow(true);
  };

  const closeAccountCreationMessageHandler = () => {
    setAccountCreationMessagePopUpWindow(false);
  };

  const newAccountCreationShowHandler = () => {
    setAccountCreationModalPopUpWindow(true)
  };

  const newAccountCreationCloseHandler = () => {
    setAccountCreationModalPopUpWindow(false)
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
        console.log(responseData)
        totalSum(responseData.totalChequing);
        totalSumDina(responseData.totalVisa);
        totalSumSnezhana(responseData.totalLineOfCredit);
        setExpenses(responseData.expenses)
        
        setAccounts(responseData.account_info.accounts)
      }
      catch(error){
        console.log("expense fetch error:", error)
      }
    };
    
    fetchExpenses()
  }, [page, authToken]);

  // console.log('accounts', accounts)
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
    setExpenses([])
    setAccounts([])
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
          // type: type,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          console.log('data', data)
          setAccounts(data.account_info.accounts)          
          if(type==='revenue'){
            setRevenuesList(data.revenues);
          }
          else{
            setExpenses(data.expenses)
            totalSum(data.totalChequing);
            totalSumDina(data.totalVisa);
            totalSumSnezhana(data.totalLineOfCredit);
          }
        });
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteEntry = (id) => {
    try {
      const myHeaders= new Headers()
      myHeaders.append('Authorization', 'Bearer ' + authToken)
      myHeaders.append("Content-Type", "application/json")
      fetch(`${process.env.REACT_APP_BACKEND_URL}/expense/deleterecord`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          id: id
          // type: type,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          console.log('data',data)
          setAccounts(data.account_info.accounts)
          totalSum(data.totalChequing);
          totalSumDina(data.totalVisa);
          totalSumSnezhana(data.totalLineOfCredit);
          setExpenses(data.expenses)
          
          
          setApproveDeletion(false);
        });
    } catch (e) {
      alert(e.message);
    }
  };

  const contextValue = {
    info,
    setInfo,
    setSearchListExpenses,
    searchListExpenses,
    setExpenses,
    expenses,
    accounts,
    setAccounts,
    page,
    setPage,
    limit,
    totalVisaPages,
    setTotalVisaPages,
    totalChequingPages,
    setTotalChequingPages,
    totalLineOfCreditPages,
    setTotalLineOfCreditPages,
    categoryMessagePopUpWindow,
    setCategoryMessagePopUpWindow,
    setAccountCreationMessagePopUpWindow,
    accountCreationMessagePopUpWindow,
    accountCreationModalPopUpWindow,
    setAccountCreationModalPopUpWindow,
    showConfirmCategoryMessage: showCategoryMessageHandler,
    closeConfirmCategoryMessage: closeCategoryMessageHandler,
    showCategoryModal:newCategoryRecordShowHandler,
    closeCategoryModal:newCategoryRecordCloseHandler,
    showConfirmAccountCreationMessage: showAccountCreationMessageHandler,
    closeConfirmAccountCreationMessage: closeAccountCreationMessageHandler,
    showAccountCreationModal:newAccountCreationShowHandler,
    closeAccountCreationModal:newAccountCreationCloseHandler,
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
