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
    const accpetedPattern = /^[A-Za-z0-9_]+$/
    return username !== null
        && typeof username === 'string'
        && username.length > 3
		&& username.length < 20
        && username.match(accpetedPattern)
  }

  function validatePassword(password) {
      const accpetedPattern = /^[A-Za-z0-9_]+$/
      return password !== null
          && typeof password === 'string'
          && password.length > 3
		  && password.length < 20
          && password.match(accpetedPattern)
  }

  	const handleLogin = async () => {
		if (validateUsername(username)  && validatePassword(password)) {
			const md5password = md5(password)
			loginUser({username, md5password}).then(token => {
				setToken(token);
				if (token) {
					setErrorMsg("")
					window.location.href="http://localhost:3000/Dashboard"
				} else {
					setErrorMsg("Invalid Username / Password")
				}     
			}).catch(err => console.log("loginUser in Login.js Error: ", err))
		} else {
			setErrorMsg("Invalid Username / Password")
		}
		setUserName("")
		setPassword("")    
  	}

    const handleCreate = async () => {
		if (validateUsername(username)  && validatePassword(password)) {
			const md5password = md5(password)
			createUser({username, md5password}).then(token => {
				setToken(token);
				if (token) {
					setErrorMsg("")
					window.location.href="http://localhost:3000/Dashboard"
				} else {
					setErrorMsg("Username already Exist")
				}
			});
        } else {
			setErrorMsg("Invalid Username / Password")
		}
		setUserName("")
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