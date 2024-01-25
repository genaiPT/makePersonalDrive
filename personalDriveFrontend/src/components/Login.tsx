import React, { ChangeEvent, FormEvent, useState } from "react";
import {Button} from "../atoms/Button";
import InputC from "../atoms/InputC";
import { ADDRESS_SERVER } from "../App";

type LoginDataType = {
  login: string;
  password: string;
  csrfToken: string;
};

type Props = {
  onLogin: React.Dispatch<React.SetStateAction<boolean>>;
  csrfToken: string;
  login: string;
  sessionID:string,
  setSessionID:React.Dispatch<React.SetStateAction<string>>;
  setLogin: React.Dispatch<React.SetStateAction<string>>;
};

const Login = (props: Props) => {

  const [password, setPassword] = useState("");


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "login") {
      props.setLogin(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData: LoginDataType = {
      login: props.login,
      password: password,
      csrfToken: props.csrfToken,
    };

    try {
      const response = await fetch(`${ADDRESS_SERVER}/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
     
        if (data.success) {
          props.setSessionID(data.sessionID)
          props.onLogin(true);
          // Redirect to dashboard or perform other actions
        } else {
          alert("Login failed");
        }
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="flex flex-col  items-center justify-start mt-4 flex-1 ">
      <form
        className="bg-gray-200 p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3 mb-3">
        <InputC
          type="text"
          placeholder="Username"
          name="login"
          onChange={handleChange}
        />

        <InputC
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        /></div>
        <div>
          <Button isSubmitType={true} text="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
