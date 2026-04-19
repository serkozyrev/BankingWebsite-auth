import React, { useContext, useState } from "react";
import { Nav, Container, Navbar } from "react-bootstrap";

import "./Header.css";

import AuthContext from "../context/auth-context";
import Modal from "../UI//Modal/Modal";
import NewRecord from "./NewRecord";
import Button from "../UI/Button/Button";
import Search from "./Search";
import CategoriesList from "./CategoriesList"
import AccountCreation from "./AccountCreation";

const Header = (props) => {
  const [dataInfo, setDataInfo] = useState("");
  const [infoAfterMessage, setInfoAfterMessage] = useState(false);
  const [categoryModalWindow, setCategoryModalWindow] = useState(false);
  const [accountCreationModalWindow, setAccountCreationModalWindow] = useState(false);
  // const [categoryModalPopUpWindow, setCategoryModalPopUpWindow] = useState(false);
  const authCtx = useContext(AuthContext);

  const newRecordHandler = () => {
    authCtx.showModal();
  };

  const newCategoryRecordHandler = () => {
    authCtx.showCategoryModal()
  };

  const newAccountCreationHandler = () => {
    authCtx.showAccountCreationModal()
  };

  const dataInformation = (data) => {
    setDataInfo(data);
  };

  const showCloseCategoryModalHandler=()=>{
    setCategoryModalWindow(!categoryModalWindow)
  }

  const showCloseAccountCreationModalHandler=()=>{
    setAccountCreationModalWindow(!accountCreationModalWindow)
  }

  const showCloseModalHandler = () => {
    setInfoAfterMessage(!infoAfterMessage);
  };

  

  // console.log('opensignup',authCtx.openSignUp)
  return (
    <Navbar className="navigation" expand="lg">
      {authCtx.openSignIn && (
      <Modal
        onClose={authCtx.showSignInHandler}
          info={
          <form className='app_signIn' onSubmit={authCtx.signIn}>
            
            <input placeholder='username' type="text" className="form-control field" value={authCtx.username} onChange={authCtx.usernameHandler} autoFocus/>
            <input placeholder='password' type="password" className="form-control field" value={authCtx.password} onChange={authCtx.passwordHandler}/>
            <Button type='submit'>Login</Button>
          </form>
          }
      /> 
      )}
      {authCtx.openSignUp && (
        <Modal
          onClose={authCtx.showSignUpHandler}
          
          info={
            <form className='app_signIn' onSubmit={authCtx.signUp}>           
            
            <input placeholder='username' type="text" className="form-control field" value={authCtx.username} onChange={authCtx.usernameHandler} autoFocus/>
            <input placeholder='email' type="email" className="form-control field"value={authCtx.email} onChange={authCtx.emailHandler}/>
            <input placeholder='password' type="password" className="form-control field" value={authCtx.password} onChange={authCtx.passwordHandler}/>
            <Button type='submit'>Sign Up</Button>
          </form>
          }
        />
      )}
      
      <Container fluid>
        <Navbar.Brand href="/">Home Bookkeeping</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {!authCtx.authToken && (<strong>!!!Please login or sign up to start using the features of this website!!!</strong>)}
          {authCtx.authToken &&(<>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link
                type="button"
                className="forgot_pass d-flex justify-content-start"
                onClick={newRecordHandler}
              >
                New Record
              </Nav.Link>
              {/* <Nav.Link
                type="button"
                href="/analysis"
                className="forgot_pass d-flex justify-content-start"
              >
                Analytics
              </Nav.Link> */}
              <Nav.Link
                type="button"
                href="/graphs "
                className="forgot_pass d-flex justify-content-start"
              >
                Analytics
              </Nav.Link>
              <Nav.Link
                type="button"
                onClick={newCategoryRecordHandler}
                className="forgot_pass d-flex justify-content-start"
              >
                List of Categories
              </Nav.Link>
              <Nav.Link
                type="button"
                onClick={newAccountCreationHandler}
                className="forgot_pass d-flex justify-content-start"
              >
                Accounts
              </Nav.Link>
            </Nav>
          <Search /></>)
          }
        </Navbar.Collapse>
          {authCtx.authToken ?(
            <Button className='nav-bar' onClick={authCtx.signOut}>Logout</Button>
            ):(<div className='nav-bar'>
              <Button type="submit" onClick={authCtx.showSignInHandler}>Login</Button>
              <Button type="submit" onClick={authCtx.showSignUpHandler}>SignUp</Button>
            </div>)
          }
      </Container>
      {authCtx.popupIsShown && (
        <Modal
          onClose={authCtx.closeModal}
          info={
            <NewRecord
              rate={props.rateNumber}
              dataFunc={dataInformation}
              infoBool={showCloseModalHandler}
            />
          }
        />
      )}
      {authCtx.categoryModalPopUpWindow && (
        <Modal
          onClose={authCtx.closeCategoryModal}
          info={
            <CategoriesList
              dataFunc={dataInformation}
              infoBool={showCloseCategoryModalHandler}
            />
          }
        />
      )} 
      {authCtx.accountCreationModalPopUpWindow && (
        <Modal
          onClose={authCtx.closeAccountCreationModal}
          info={
            <AccountCreation
              dataFunc={dataInformation}
              infoBool={showCloseAccountCreationModalHandler}
            />
          }
        />
      )} 
      {infoAfterMessage && authCtx.popupIsShown === false && (
        <Modal onClose={showCloseModalHandler} info={dataInfo} time />
      )}

      {categoryModalWindow && authCtx.categoryModalPopUpWindow === false && (
        <Modal onClose={showCloseCategoryModalHandler} info={dataInfo} time />
      )}

      {accountCreationModalWindow && authCtx.accountCreationModalPopUpWindow === false && (
        <Modal onClose={showCloseAccountCreationModalHandler} info={dataInfo} time />
      )}
    </Navbar>
  );
};

export default Header;
