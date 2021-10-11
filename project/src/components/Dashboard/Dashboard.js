import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {Dropdown, Navbar, Container, Form} from 'react-bootstrap';
import io from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

/*
async function DisplayPosts() {
    useEffect(() => {
        var a = document.getElementById('current_user_posts');
        var div = document.createElement("div");
        div.textContent = "asdf";
        a.appendChild(div)
      }, []); // <-- empty array means 'run once'
} */

export default function Dashboard({userName}) {

    // 2 == Friends
    // 1 == Request Sent
    // 0 == Not Friends 
    var currentUserFriendStatus = 0;

    var [currentUser, setCurrentUser] = useState(userName)
    const [postText, setPostText] = useState()
    var [userPosts, setUserPosts] = useState([])

    var messages = []


    var fName1 = "Friend 1"
    var fName2 = "This_is_a_long_fucking_friend_name"

    async function logoutUser() {
        sessionStorage.clear();
        window.location.href="http://localhost:3000/"
    }

    function createPostElement(postData) {
        return (<div key={postData._id} id={postData._id} style={{backgroundColor : "#212529", margin: "15px", padding : "10px", borderRadius : "5px", color : "#8a9a93"}}>
            <h4><a href="#" style={{color : "white"}} onClick={() => ChangeCurrentUser(postData.creator)}>{postData.creator}</a></h4>
            {postData.msg}</div>)
    }

    async function DisplayAllPosts(user) { 
        const msgData = await fetch('http://localhost:8080/GetMessages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : user})
          }).then(res => {  
            if (res.status === 200) {
                return res.json()
             } 
          }).catch(error => console.log(error, "Error in DisplayAllPosts."))
        console.log(msgData)
        var updatedUserPosts = []
        msgData.forEach(msg => updatedUserPosts.unshift(createPostElement(msg)))
        setUserPosts(updatedUserPosts)
    }

    async function createPost() {
        var textField = document.getElementById("textField")
        if (textField.value.length > 0) {
            var postData = {msg : textField.value, _id : Date.now(), creator : userName}
            textField.value = ""   
            await fetch('http://localhost:8080/AddMessage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(postData)
              }).then(res => {
                if (res.status === 200) {
                    var post = createPostElement(postData)
                    setUserPosts([post, ...userPosts])
                } 
            })
        }
    }

    async function RemovePost() {

    }

    async function ChangeFriendStatus(user, status) {

    }
    
    async function ChangeCurrentUser(user) {
        if (user == currentUser) {
            //setCurrentUser(user)
            DisplayAllPosts(user)
        }
    }

    function makeChatRoom(otherUser) {
        return otherUser < userName ? `${otherUser}_${userName}` : `${userName}_${otherUser}`
    }

    const joinRoom = (roomId) =>{
        if (userName !== "" && roomId !== "") {
            socket.emit("join_room", roomId)
        }
    };

    function createDropdownItem(friendName) {
        return (        
            <div style={{width : (friendName.length * 8 + 150).toString() + "px", margin : "10px", border : "2px", backgroundColor : "#212529", borderStyle : "solid", borderRadius : "5px"}}>
                <Navbar.Text style={{color : "#212529", marginLeft  : "10px"}}> <a href=''>{friendName}</a> 
                    <button style={{margin : "10px"}}>Add</button><button >Remove</button>
                    <Link to={`/${makeChatRoom(friendName)}`} onClick={joinRoom}>Chat</Link>
                </Navbar.Text>
            </div>
        )
    }

    //DisplayAllPosts(userName)

    return(
        <div className="dashboard_wrapper" >
            <div id="top">
                <Navbar variant="dark" id="Navbar" bg="dark" expand="lg" fixed="top" style={{height : "14vh"}}>
                    <Container fluid>
                        <Navbar.Toggle aria-controls="navbar-dark" />
                        <Navbar.Collapse>
                        
                        <Dropdown>
                            <Dropdown.Toggle 
                                ariant="dark"
                                id="dropdown_button">
                                Friends
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{backgroundColor : "lightgreen", borderWidth : "3px", borderColor : "#212529"}}>
                                {createDropdownItem(fName1)}
                                {createDropdownItem(fName2)}
                                {createDropdownItem("ii")}
                            </Dropdown.Menu>
                        </Dropdown>
            
     
                        
                        </Navbar.Collapse>

                        <Navbar.Collapse id="navbar-dark" className="justify-content-center">
                            
                            <form>
                            <p><Navbar.Text style={{marginRight : "10px"}}>Find User</Navbar.Text></p>
                                <label>          
                                    <input type="text" />
                                </label>
                                <Navbar.Text style={{marginLeft : "10px"}}><a href='#'>Search</a></Navbar.Text>
                            </form>
                        </Navbar.Collapse>

                        <Navbar.Collapse className="justify-content-end" style={{marginRight : "10px"}}>
                            <Navbar.Text style={{marginTop : "25px"}}>
                                Signed in as: <a href="#login" onClick={() => ChangeCurrentUser(userName)}>{userName}</a>
                                <p><Navbar.Text href="#" onClick={logoutUser} style={{marginLeft: "20px"}}><a href=''>Sign Out</a></Navbar.Text></p>
                            </Navbar.Text>  
                        </Navbar.Collapse>

                    </Container>
                </Navbar> 
            </div>
            <div id="bot">
                <div style={{backgroundColor : "#212529", color : "white", marginTop : "30px", borderRadius : "10px", paddingTop : "15px", paddingBottom : "15px", paddingLeft : "35px", paddingRight : "35px", textAlign : "center"}}>
                    <h1 style={{color : "#8a9a93"}}>{currentUser}'s Page</h1>
                    {currentUserFriendStatus === 2 && <Navbar.Text style={{color : "#8a9a93"}}>You are Friends</Navbar.Text>}
                    {currentUserFriendStatus === 1 && <Navbar.Text style={{color : "#8a9a93"}}>Friend Request has been Sent</Navbar.Text>}
                    {currentUserFriendStatus === 0 && <Navbar.Text ><a style={{color : "white"}} href='#'> Send Friend Request</a> </Navbar.Text>}

                    {(userName === currentUser || currentUserFriendStatus === 2) && <div style={{width : "600px"}}>
                        <form  >
                            <p><Navbar.Text style={{marginRight : "10px", color : "#8a9a93"}}></Navbar.Text></p>
                                      
                                <Form.Group >
                                    <Form.Control id="textField" as="textarea" rows="3" />
                                </Form.Group>
                               
                                <Navbar.Text style={{marginLeft : "10px"}}><a style={{color : "white"}} href='#' onClick={createPost}>Post Message</a></Navbar.Text>
                            </form>

                    </div>}
                </div>

                <div id="posts" style={{backgroundColor : "lightgreen", color : "white", marginTop : "30px", padding : "10px", borderRadius : "10px", maxWidth : "700px"}}>
                    {userPosts}
                </div>

            </div>

        </div>
    )

      
}