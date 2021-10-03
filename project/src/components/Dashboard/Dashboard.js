import React from 'react';
import Login from '../Login/Login';

async function logoutUser() {
    sessionStorage.clear();
    window.location.href="http://localhost:3000/"
}

export default function Dashboard() {
  return(
    <div>
        <div id = "top">
            <h2>Dashboard</h2>
            <button onClick={e => logoutUser()}>Log Out</button>
        </div>

        <div id="user_page">
            <div className="column">

            </div>
            <div className="column">

            </div>
            <div className="column">

            </div>
        </div> 

        <div id = "chat">
            <h3>Create chat here</h3>

        </div>
    </div>
  );
}