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

  function validateInput(input, minLength, maxLength) {
    const acceptedPattern = /^[A-Za-z0-9_]+$/
    return input !== null
        && typeof input === 'string'
        && input.length >= minLength
        && input.length <= maxLength
        && input.match(acceptedPattern)
  }

  const errorMsgHelper = () => {
    const acceptedPattern = /^[A-Za-z0-9_]+$/
    if (username.length > 0 && !username.match(acceptedPattern)) {
      setErrorMsg("Username can only contain letters,\n numbers, and underscores.")
    } else if (password.length > 0 && !password.match(acceptedPattern)) {
      setErrorMsg("Password can only contain letters,\n numbers, and underscores.")
    }
  }

  const handleLogin = async () => {
    if (validateInput(username, 4, 19) && validateInput(password, 6, 21)) {
      alert("sdf")
      const md5password = md5(password)
      loginUser({username, md5password}).then(token => {
        setToken(token);
        if (token) {
          setErrorMsg("")
          setUserName("")
          window.location.href="http://localhost:3000/Dashboard"
        } else {
          setErrorMsg("Account not found")
        }     
      }).catch(err => console.log("loginUser in Login.js Error: ", err))
    } else {
      errorMsgHelper()
    }
  }

  const handleCreate = async () => {
    alert("1")
    if (validateInput(username, 4, 19) && validateInput(password, 6, 21)){
      const md5password = md5(password)
      createUser({username, md5password}).then(token => {
        setToken(token);
        alert("sdf")
        alert(token)
        if (token) {
          setErrorMsg("")
          setUserName("")
          window.location.href="http://localhost:3000/Dashboard"
        } else {
          setErrorMsg("Username already Exist")
        }
      });
    } else {
      
      errorMsgHelper()
    }
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
                              minLength="4"
                              maxLength="19"
                              pattern="^[A-Za-z0-9_]+$"/>
            </Form.Group>
            <Form.Group className="mb-3" 
                        controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                              placeholder="Password" 
                              value={password} 
                              onChange={e => setPassword(e.target.value)}
                              required
                              minLength="6"
                              maxLength="21"
                              pattern="^[A-Za-z0-9_]+$"/>
            </Form.Group>
            <div className="linkDiv">
                <button className="Button" type="button" onClick={handleLogin}>
                   Log In
                </button> 
                <button className="createAccountLink Button" type="button" onClick={handleCreate}>
                   Create Account
                </button> 
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