import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Navbar, Container, Form} from 'react-bootstrap';
import './Login.css';

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
 })
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
     } 
  })
  return token;
}

export default function Login({ setToken }) {
  var [username, setUserName] = useState();
  var [password, setPassword] = useState();
  var [showErrorMsg, setShowErrorMsg] = useState(false)

  const handleLogin = async e => {
    e.preventDefault();
    loginUser({username,password}).then(token => {
      setUserName("")
      setPassword("")
      setToken(token);
      if (token) {
        window.location.href="http://localhost:3000/Dashboard"
      }
    });
  }

  const handleCreate = async e => {
    e.preventDefault();
    await createUser({username,password}).then(token => {
      setToken(token);
      setUserName("")
      setPassword("")
      if (token) {
        window.location.href="http://localhost:3000/Dashboard"
      }
    });
  }

  return(
    <div id="login-wrapper">
      <div id="login-forms">
      <Form style={{backgroundColor : "#212529", color : "#8a9a93", padding : "30px 50px 30px 50px", borderRadius : "15px"}}>
        {showErrorMsg && <div style={{textAlign : "center"}}><p style={{color : "red"}}>Invalid Username/Password</p></div> /* TODO ERROR MESSAGES*/}
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="email" placeholder="Enter username" value={username} onChange={e => setUserName(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <div style={{marginTop: "10px"}}>
           <a href="#" style={{color : "white"}} onClick={handleLogin}>Log In</a> 
           <a href="#" style={{color : "white", float : "right"}} onClick={handleCreate}>Create Account</a> 
          </div>
      </Form>


        

      </div>
    </div>
  )
}


Login.propTypes = {
  setToken: PropTypes.func.isRequired
}; 