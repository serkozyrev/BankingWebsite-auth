import React, { useContext } from "react";
import AuthContext from "../context/auth-context";
import Button from "../UI/Button/Button";

const ConfirmMessage = (props) => {
  const authCtx = useContext(AuthContext);
  return (
    <>
      <h3>Do you really want to delete this record?</h3>
      <Button onClick={props.infoBool}>Confirm</Button>
      <Button onClick={authCtx.closeMessage}>Cancel</Button>
    </>
  );
};

export default ConfirmMessage;
