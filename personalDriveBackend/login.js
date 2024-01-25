const jwt = require("jsonwebtoken")
const USERS = require("./USERS")


const SECRET = "Inser a super secret secret here" //EDIT HERE

function login(req, res, next) {
  const login = req.body.login;
  const password  = req.body.password 
  let userExists = USERS.find((user) => user.name === login);
  let passwordsMatch = password === userExists.password
  if (userExists && passwordsMatch ) {
    const acessToken = jwt.sign({id:userExists.id}, SECRET, {expiresIn:"20m"})
    res.status(200).json({ success: true, message: "Login successful", sessionID:acessToken });
  } else {res.status(400).send("ERRO");}

}


function isLoggedin(req, res, next) {
  const sessionToken = req.headers.session
  if (sessionToken) {
    jwt.verify(sessionToken, SECRET, (error, user) => {
      if (error) return res.status(403).json({ success: false, message: "Not valid token access" });
      req.user = user
      next();
    })

  } else {
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
}



function logout(req, res, next) {
  const sessionToken = req.headers.session
  jwt.verify(sessionToken, SECRET, (error, user) => {
    if (error) return res.status(403).json({ success: false, message: "Not valid token access" });
    req.user = null
    console.log("user", user)
    res.json({ success: true, message: "Logout successful" });
  })
}

module.exports = { login, isLoggedin, logout, checkLoggin};
