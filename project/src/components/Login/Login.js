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
  const [showErrorMsg, setShowErrorMsg] = useState(false)

  const handleLogin = async e => {
    e.preventDefault();
    if ( username !== null 
      && username !==  ""
      && password !== null 
      && password !== "" ) {
        const md5password = md5(password)
        loginUser({username, md5password}).then(token => {
          setUserName("")
          setPassword("")
          setToken(token);
          if (token) {
            window.location.href="http://localhost:3000/Dashboard"
          }
          
        }).catch(err => console.log("loginUser in Login.js Error: ", err))
      }
     
    }

  const handleCreate = async e => {
    e.preventDefault();
    if ( username !== null 
      && username !==  ""
      && password !== null 
      && password !== "" ) {
        //console.log("PASSWORD: ", password)
      const md5password = md5(password)
        createUser({username, md5password}).then(token => {
          setToken(token);
          setUserName("")
          setPassword("")
          if (token) {
            window.location.href="http://localhost:3000/Dashboard"
          }
        });
      }
    
  }

  return(
    <div className="loginWrapper">
        <div className="loginDiv">
          <Form className="loginForm">
            {showErrorMsg && 
            <div className="loginFormDiv"> 
                  <p className="loginFormStatusMsg">
                      Invalid Username/Password
                  </p>
            </div>}
            <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="email" 
                              placeholder="Enter username" 
                              value={username} 
                              onChange={e => setUserName(e.target.value)}
                              required/>
            </Form.Group>
            <Form.Group className="mb-3" 
                        controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                              placeholder="Password" 
                              value={password} 
                              onChange={e => setPassword(e.target.value)}
                              required/>
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
          </Form>
       </div>
    </div>
  )
}