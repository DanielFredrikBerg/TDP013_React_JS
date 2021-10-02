import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

async function loginUser(credentials) {
  var token = null
  document.getElementById("login-form").reset();
  await fetch('http://localhost:8080/Login', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(credentials)
 }).then(res => {
  console.log(res)
   if (res.status == 200) {
    token = credentials;
   } 
 })
 return token
}

async function createUser(credentials) {
  var token = null
  document.getElementById("login-form").reset();
  await fetch('http://localhost:8080/CreateAccount', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials)
  }).then(res => {
    console.log(res)
    if (res.status == 200) {
      token = credentials;
     } 
  })
  console.log(token)
  return token;
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async e => {
    e.preventDefault();
    loginUser({username,password}).then(token => {
      setToken(token);
      if (token) {
        window.location.href="http://localhost:3000/Dashboard"
      }
    });
  }

  const handleCreate = async e => {
    e.preventDefault();
    const token = await createUser({username,password}).then(token => {
      setToken(token);
      if (token) {
        window.location.href="http://localhost:3000/Dashboard"
      }
    });
  }

  return(
    <div className="login-wrapper">
      <h1 style={{marginBottom: "-10px"}}>Logga in eller skapa ny Account, idk</h1>
      <p>(jag är inte din mamma)</p>
      <form id="login-form">
        <label>
          <p>Username</p>
          <input type="text" name="username" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div style={{marginTop: "10px"}}>
          <button onClick={handleLogin}>Log In</button>
          <button style={{marginLeft: "58px"}} onClick={handleCreate}>Create Account</button>
        </div>
      </form>
    </div>
  )
}


Login.propTypes = {
  setToken: PropTypes.func.isRequired
}; 