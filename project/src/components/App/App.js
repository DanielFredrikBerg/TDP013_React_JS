import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import ChatRoom from "../ChatRoom/ChatRoom";

//import 'bootstrap/dist/css/bootstrap.min.css';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken
}

function App() {
  const token = getToken();

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
          <Route path="/:roomId" component={ChatRoom} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;