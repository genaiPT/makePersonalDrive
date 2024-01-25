import React from "react";
import {ButtonWarning} from "../atoms/Button";
import { ADDRESS_SERVER } from "../App";

type Props = {
  csrfToken: string;
  onLogin: React.Dispatch<React.SetStateAction<boolean>>;
  sessionID:string;
  setSessionID:React.Dispatch<React.SetStateAction<string>>;
};

const Logout = (props: Props) => {
  const handleLogout = async () => {
    try {
      const response = await fetch(`${ADDRESS_SERVER}/logout`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "session":props.sessionID
        },
        credentials: "include",
        body: JSON.stringify({ csrfToken: props.csrfToken }),
      });
      props.setSessionID("")
      if (response.ok) {
        const data = await response.json();
        //alert(data.message);
        if (data.success) {
          props.onLogin(false);
        } else {
          console.log("logout failed");
         
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <ButtonWarning 
      onClick={handleLogout} text="Logout"/>
    </div>
  );
};

export default Logout;
