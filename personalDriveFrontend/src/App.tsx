import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Logout from "./components/Logout";


export const ADDRESS_SERVER = "YOUR SERVER DDNS" // EDIT HERE

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [sessionID, setSessionID] = useState("");



  useEffect(() => {
    const getCSRFToken = async () => {
      const response = await fetch(ADDRESS_SERVER, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
   
      });
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } else {
        console.warn("Access to csrf token failed");
      }
    };
    getCSRFToken();

  }, []);

  return (
    <>
      <div className=" flex flex-1 flex-col bg-slate-100 h-screen">
        <div className="flex flex-1 flex-col justify-between ">
            <span>
        <div className="flex flex-row items-center ml-4 mt-4 gap-8 ">
          <h1 className="text-4xl ">Personal Drive App</h1>
          <div className="mt-1 mr-4">
            {isLoggedIn && (
              <Logout onLogin={setIsLoggedIn} csrfToken={csrfToken} sessionID={sessionID}
              setSessionID={setSessionID} />
              )}
          </div>
        </div>
        <div className=" flex flex-1  justify-center items-start mt-4 ">
          {!isLoggedIn ? (
            <Login
            csrfToken={csrfToken}
            onLogin={setIsLoggedIn}
            login={login}
            setLogin={setLogin}
            sessionID={sessionID}
              setSessionID={setSessionID}
            />

            ) : (
              <Dashboard csrfToken={csrfToken} login={login} 
              sessionID={sessionID}
              setSessionID={setSessionID}
              />
              )}
        </div>
              </span>
              <span className="mb-6 flex items-center justify-center">
              <h6>Crafted by GenaiPT - 2024</h6>

              </span>
                      </div>
      </div>
    </>
  );
}

export default App;
