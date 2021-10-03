import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  console.log(tokenString)
  const userToken = JSON.parse(tokenString);
  console.log(userToken)
  return userToken
}

function App() {
  const token = getToken();
  console.log(token)

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard userName = {JSON.parse(sessionStorage.getItem('token')).username} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;