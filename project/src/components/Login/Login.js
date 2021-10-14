import { render } from '@testing-library/react';
import React, { useState } from 'react';
import {Form} from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast'
import './Login.css';
const md5 = require('md5');




async function loginUser(credentials) {
  var token = null
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
  var token = null
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
  var [username, setUserName] = useState("");
  var [password, setPassword] = useState("");
  var [showErrorMsg, setShowErrorMsg] = useState(false)

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
        console.log("PASSWORD: ", password)
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
    <div id="login-wrapper">
        <div id="login-forms">
          <Form style={{backgroundColor : "#212529", 
                        color : "#8a9a93", 
                        padding : "30px 50px 30px 50px", 
                        borderRadius : "15px"}}>
            {showErrorMsg && 
            <div style={{textAlign : "center"}}> 
                  <p style={{color : "red"}}>
                    Invalid Username/Password
                  </p>
            </div>}
            <Form.Group className="mb-3" 
                        controlId="formGroupEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="email" 
                              placeholder="Enter username" 
                              value={username} 
                              onChange={e => setUserName(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" 
                        controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                              placeholder="Password" 
                              value={password} 
                              onChange={e => setPassword(e.target.value)}/>
            </Form.Group>
            <div style={{marginTop: "10px"}}>
                <a href="#" 
                   style={{color : "white"}} 
                   onClick={handleLogin}>
                   Log In
                </a> 
                <a href="#" 
                   style={{color : "white", float : "right"}} 
                   onClick={handleCreate}>
                   Create Account
                </a> 
            </div>
          </Form>
       </div>
    </div>
  )
}