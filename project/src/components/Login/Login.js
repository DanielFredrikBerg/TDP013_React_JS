import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

async function loginUser(credentials) {
 return await fetch('http://localhost:8080/Login', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(credentials)
 }).then((res) => {
  console.log(res.status)
 })
 
}

async function createUser(credentials) {
  return fetch('http://localhost:8080/CreateAccount', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials)
  }).then(data => data.json())
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async e => {
    e.preventDefault();
    const token = await loginUser({username,password});
    console.log(typeof token)
    setToken(token);
    
    //window.location.href="http://localhost:3000/Dashboard"
  }

  const handleCreate = async e => {
    e.preventDefault();
    const token = await createUser({username,password});
    setToken(token);

  }

  return(
    <div className="login-wrapper">
      <h1 style={{marginBottom: "-10px"}}>Logga in eller skapa ny Account, idk</h1>
      <p>(jag är inte din mamma)</p>
      <form>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
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