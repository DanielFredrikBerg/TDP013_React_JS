import React, { useState } from 'react';
import Login from '../Login/Login';
import './Dashboard.css';

async function logoutUser() {
    sessionStorage.clear();
    window.location.href="http://localhost:3000/"
}
async function createPost(postText) {
    console.log("asd")
}

export default function Dashboard({userName}) {
    var currentUser = userName;
    var currentUserIsFriend = false;

    const [postText, setPostText] = useState();

    const handlePost = async e => {
        document.getElementById("create_post_form").reset();
        e.preventDefault();
        await createPost(postText).then(result => {
            console.log(result)
        });
      }

    const displayPosts = () => {
        var a = document.getElementById('current_user_posts');
        a.insertBefore(<p>123</p>, a.firstChild)
    }

    return(
        <div className="dashboard_wrapper" onLoad={displayPosts()}>
            <div id="left_column">
                <div id = "left_top">
                    <h3 >Logged in as {userName}</h3>
                    <button onClick={e => logoutUser()}>Log Out</button>
                </div>

                <div id="left_top2">
                    <h3>SEARCH USER HERE</h3>
                </div>

                <div id="left_mid">
                    {currentUser == userName && 
                        <div>
                            <h3>Post Message</h3>
                            <form id="create_post_form">
                                <input type="text" name="create_post_field" onChange={e => setPostText(e.target.value)} />
                                <button onClick={handlePost}>Send</button>
                            </form>
                        </div>
                    }
                    <h3>{userName}'s Posts</h3>
                    <div id="current_user_posts"></div>
                </div> 

                <div id="left_bot">
                    <h3>CHAT HERE</h3>
                </div> 

            </div>
            <div id="right_column">
                <div id="right_top">
                    <h3>Add Friend</h3>
                    <p id="addFriendStatusMessage"></p>
                </div>
                <div id="right_bot">
                    <h3>FRIEND LIST HERE</h3>
                </div>  
            </div>
        </div>
    )

      
}