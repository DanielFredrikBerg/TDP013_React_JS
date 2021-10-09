import React, { useState, useEffect } from 'react';

import {Dropdown, Navbar, Container, Form} from 'react-bootstrap';

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

var runOnce = 0

export default function Dashboard({userName}) {

    // 2 == Friends
    // 1 == Request Sent
    // 0 == Not Friends 
    var currentUserFriendStatus = 0;

    
    var [currentUser, setCurrentUser] = useState(userName)
    var [userPosts, setUserPosts] = useState([])
    var [findUserText, setFindUserText] = useState()
    var [findUserStatusMessage, setFindUserStatusMessage] = useState()

    useEffect(() => {
        DisplayAllPosts(userName)
    },[])

    /*
    const handlePost = async e => {
        document.getElementById("create_post_form").reset();
        e.preventDefault();
        await createPost(postText).then(result => {
            console.log(result)
        });
    } */

    var fName1 = "Friend 1"
    var fName2 = "This_is_a_long_fucking_friend_name"

    async function logoutUser() {
        sessionStorage.clear();
    }

    function createPostElement(postData) {
        return (<div key={postData._id} id={postData._id} style={{backgroundColor : "#212529", margin: "15px", padding : "10px", borderRadius : "5px", color : "#8a9a93"}}>
            <h4><a href="#" style={{color : "white"}} onClick={() => ChangeCurrentUser(postData.creator)}>{postData.creator}</a></h4>
            {postData.msg}</div>)
    }

    async function DisplayAllPostsOnReload(user) {

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
        })
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
        if (user != currentUser) {
            setCurrentUser(user)
            DisplayAllPosts(user)
        }
    }

    async function findUser() {
        
        await fetch('http://localhost:8080/FindUser', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : findUserText})
          }).then(res => {
            if (res.status === 200) {
                ChangeCurrentUser(findUserText)
                setFindUserStatusMessage("")
            } else {
                setFindUserStatusMessage(`User ${findUserText} not Found`)
            }
            
        })
        setFindUserText("")
        
    }

    function createDropdownItem(friendName) {
        return (        
            <div style={{width : (friendName.length * 8 + 150).toString() + "px", margin : "10px", border : "2px", backgroundColor : "#212529", borderStyle : "solid", borderRadius : "5px"}}>
                <Navbar.Text style={{color : "#212529", marginLeft  : "10px"}}> <a href=''>{friendName}</a> 
                    <button style={{margin : "10px"}}>Add</button><button >Remove</button>
                </Navbar.Text>
            </div>
        )
    }

    

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
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>

                        <Navbar.Collapse id="navbar-dark" className="justify-content-center">
                            <form id="find-user" style={{marginTop : "15px"}}>
                            <p><Navbar.Text style={{marginRight : "10px"}}>Find User</Navbar.Text></p>
                                <label>          
                                    <input type="text" value={findUserText} onChange={e => setFindUserText(e.target.value)}/>
                                </label>
                                <Navbar.Text style={{marginLeft : "10px"}}><a href='#' onClick={findUser}>Search</a></Navbar.Text>
                                <p style={{color : "red", marginTop : "10px"}}>{findUserStatusMessage}</p>
                            </form>
                        </Navbar.Collapse>

                        <Navbar.Collapse className="justify-content-end" style={{marginRight : "10px"}}>
                            <Navbar.Text style={{marginTop : "25px"}}>
                                Signed in as: <a href="#" onClick={() => ChangeCurrentUser(userName)}>{userName}</a>
                                <p><Navbar.Text onClick={logoutUser} style={{marginLeft: "20px"}}><a href='http://localhost:3000/Login'>Sign Out</a></Navbar.Text></p>
                            </Navbar.Text>  
                        </Navbar.Collapse>

                    </Container>
                </Navbar> 
            </div>
            <div id="bot" onLoad={() => DisplayAllPosts(userName)}>
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

                <div id="posts"  style={{backgroundColor : "lightgreen", color : "white", marginTop : "30px", padding : "10px", borderRadius : "10px", maxWidth : "700px"}}>
                    {userPosts}
                </div>

            </div>

        </div>
    )

      
}