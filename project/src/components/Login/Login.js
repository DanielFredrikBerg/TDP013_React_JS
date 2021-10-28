import React, { useState } from 'react';
import {Form} from 'react-bootstrap';
import './Login.css';
const md5 = require('md5');

async function loginUser(credentials) {
  let token = null
  await fetch('http://localhost:8080/Login', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(credentials)
 }).then(res => {
   if (res.status === 200) {
    token = credentials;
   } 
 }).catch((err) => {
  console.log("Error in loginUser within Login.js", err);    
});
 return token
}

async function createUser(credentials) {
  let token = null
  await fetch('http://localhost:8080/CreateAccount', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials)
  }).then(res => {
    if (res.status === 200) {
      token = credentials;
    } else {
      throw new Error("Error createUser in Login.js")
    }
  }).catch((err) => {
    console.log(err);    
  });
  return token;
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("")

  function validateUsername(username) {
    const acceptedPattern = /^[A-Za-z0-9_]+$/
    if (username !== null && typeof username === 'string') {
        if (username.length <= 3 || username.length >= 20)  {
            return -1
        } else if (!username.match(acceptedPattern)) {
            return -2
        }
        return 1
    } 
    return 0
  }

  function validatePassword(password) {
    const acceptedPattern = /^[A-Za-z0-9_]+$/
    if (password !== null && typeof username === 'string') {
        if (password.length <= 5 || password.length >= 22) {
            return -1
        } else if  (!password.match(acceptedPattern)){
            return -2
        }
        return 1
    } 
    return 0
  }

    const errorMsgHelper = (usernameValidationCode, passwordValidationCode) => {
      if (usernameValidationCode == -1) {
        setErrorMsg("Username need to be 4-19 characters long.")
      } else if (usernameValidationCode == -2) {
        setErrorMsg("Username can only letters,\n numbers, and underscores.")
      } else if (passwordValidationCode == -1) {
        setErrorMsg("Password need to be 6-21 characters long.")
      } else if (passwordValidationCode == -2) {  
        setErrorMsg("Password can only letters,\n numbers, and underscores.")
      }
    }

  	const handleLogin = async () => {
      const usernameValidationCode = validateUsername(username)
      const passwordValidationCode = validatePassword(password)
      if (usernameValidationCode == 1 && passwordValidationCode == 1) {
        const md5password = md5(password)
        loginUser({username, md5password}).then(token => {
          setToken(token);
          if (token) {
            setErrorMsg("")
            setUserName("")
            window.location.href="http://localhost:3000/Dashboard"
          } else {
            setErrorMsg("Invalid Username / Password")
          }     
        }).catch(err => console.log("loginUser in Login.js Error: ", err))
      } else {
        errorMsgHelper(usernameValidationCode, passwordValidationCode)
      }
      setPassword("")    
  	}

    const handleCreate = async () => {
      const usernameValidationCode = validateUsername(username)
      const passwordValidationCode = validatePassword(password)
      if (usernameValidationCode == 1 && passwordValidationCode == 1) {
        const md5password = md5(password)
        createUser({username, md5password}).then(token => {
          setToken(token);
          if (token) {
            setErrorMsg("")
            setUserName("")
            window.location.href="http://localhost:3000/Dashboard"
          } else {
            setErrorMsg("Username already Exist")
          }
        });
      } else {
        errorMsgHelper(usernameValidationCode, passwordValidationCode)
      }
      setPassword("")
    }

  return(
    <div className="loginWrapper">
        <div className="loginDiv">
          <Form className="loginForm">
            <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control placeholder="Enter username" 
                              value={username} 
                              onChange={e => setUserName(e.target.value)}
                              required
                              minlength="4"/>
            </Form.Group>
            <Form.Group className="mb-3" 
                        controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                              placeholder="Password" 
                              value={password} 
                              onChange={e => setPassword(e.target.value)}
                              required
                              minlength="4"/>
            </Form.Group>
            <div className="linkDiv">
                <a href="#" 
                   onClick={handleLogin}>
                   Log In
                </a> 
                <a href="#" 
                   className="createAccountLink"
                   onClick={handleCreate}>
                   Create Account
                </a> 
            </div>
            {errorMsg && 
            <div className="loginFormDiv"> 
                  <p className="loginFormStatusMsg">
                      {errorMsg}
                  </p>
            </div>}
          </Form>

       </div>
    </div>
  )
}