import React, {useState, useEffect} from 'react';

import {Dropdown, Navbar, Container, Form} from 'react-bootstrap';
import {CheckLg, XLg, ChatLeftText} from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

import Chat from '../Chat/Chat'

export default function Dashboard({loginName}) {

    var [currentUser, setCurrentUser] = useState()
    var [userPosts, setUserPosts] = useState([])
    var [findUserText, setFindUserText] = useState()
    var [findUserStatusMessage, setFindUserStatusMessage] = useState()
    var [currentUserFriendStatus, setCurrentUserFriendStatus] = useState(-1)
    var [friendList, setFriendList] = useState([])
    var [showChatWindow, setShowChatWindow] = useState(false)
    var [chatFriend, setChatFriend] = useState()
    var [prevChatFriend, setPrevChatFriend] = useState()

    useEffect(() => {
        if (sessionStorage.getItem('currentUser')) {
            setCurrentUser(sessionStorage.getItem('currentUser'))
            const status = GetFriendStatus(sessionStorage.getItem('currentUser'))
            setCurrentUserFriendStatus(status)
            DisplayAllPosts(sessionStorage.getItem('currentUser'))
        } else {
            setCurrentUser(loginName)
            DisplayAllPosts(loginName)
        }
        PopulateFriendList()
    },[])

    function onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
          findUser()
        }
    }

    async function logoutUser() {
        sessionStorage.clear();
    }

    function createPostElement(postData) {
        return (<div key={postData._id} id={postData._id} style={{backgroundColor : "#212529", width : "max-content", maxWidth : "600px", margin: "auto", marginTop: "15px", padding : "10px", borderRadius : "5px", color : "#8a9a93"}}>
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
        })
        var updatedUserPosts = []
        msgData.forEach(msg => updatedUserPosts.unshift(createPostElement(msg)))
        setUserPosts(updatedUserPosts)
    }

    async function createPost() {
        var textField = document.getElementById("textField")
        if (textField.value.length > 0) {
            var postData = {msg : textField.value, _id : Date.now(), creator : loginName, page : currentUser}
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



    async function GetFriendStatus(friend) {
        if (friend === loginName) {
            return -1
        }
        const result = await fetch('http://localhost:8080/GetFriendStatus', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : loginName, friendname : friend})
          }).then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        if (result) {
            return result.friendstatus
        } else {
            return 0
        }
    }


    
    async function ChangeCurrentUser(user) {
            if (user === loginName) {
                setCurrentUserFriendStatus(-1)
                sessionStorage.setItem('currentUser', user)
                currentUser = user
                setCurrentUser(user)
                DisplayAllPosts(user)
            } else {
                const status = await GetFriendStatus(user)
                setCurrentUserFriendStatus(status)
                sessionStorage.setItem('currentUser', user) 
                currentUser = user  
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

    async function changeFriendStatus(user, friend, status) {
        const result = await fetch('http://localhost:8080/SetFriendStatus', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : user, friendname : friend, friendstatus : status})
          }).then(res => {
            if (res.status === 200) {
                return res  
            } 
        })
        return result
    }

    async function sendFriendRequest() {
        changeFriendStatus(currentUser, loginName, 2) 
        changeFriendStatus(loginName, currentUser, 1)
        setCurrentUserFriendStatus(1)
    }

    async function acceptFriendRequest(friend) {
        changeFriendStatus(loginName, friend, 3)
        changeFriendStatus(friend, loginName, 3)
        if (friend === currentUser) {
            setCurrentUserFriendStatus(3)
        }
        PopulateFriendList()
    }

    async function removeFriend(friend) {
        changeFriendStatus(loginName, friend, 0)
        changeFriendStatus(friend, loginName, 0)
        if (friend === currentUser) {
            setCurrentUserFriendStatus(0)
        }
        PopulateFriendList()
    }

    async function openChatWindow(friend) {
        if (chatFriend === friend) {
            chatFriend = null
            setChatFriend(null)
            setPrevChatFriend(null)
            setShowChatWindow(false)
        } else {
            setPrevChatFriend(chatFriend)
            chatFriend = friend
            setChatFriend(friend)
            setShowChatWindow(true)
        }
    }

    function createFriendlistItem(friendData) {
        if (friendData.friendstatus == 3) {
           return <div style={{width : "max-content", margin : "10px", border : "2px", backgroundColor : "#212529", borderStyle : "solid", borderRadius : "5px"}}>
                <Navbar.Text style={{color : "#212529", marginLeft  : "10px"}}> 
                    <a href='#' onClick={() => ChangeCurrentUser(friendData.friendname)}>{friendData.friendname}</a>
                    <a href="#" onClick={() => openChatWindow(friendData.friendname)}>
                        <ChatLeftText style={{color : "yellow", marginLeft : "20px"}}></ChatLeftText></a> 
                    <a href="#" onClick={() => removeFriend(friendData.friendname)}>
                        <XLg style={{color : "red", margin : "10px", marginLeft : "10px"}}></XLg></a>    
                </Navbar.Text>
            </div>
        } else if (friendData.friendstatus == 2) {
            return (        
                <div style={{width : "max-content", margin : "10px", border : "2px", backgroundColor : "#212529", borderStyle : "solid", borderRadius : "5px"}}>
                    <Navbar.Text style={{color : "#212529", marginLeft  : "10px"}}> 
                    <a href='#' onClick={() => ChangeCurrentUser(friendData.friendname)}>{friendData.friendname}</a> 
                        <a href="#" onClick={() => acceptFriendRequest(friendData.friendname)}>
                            <CheckLg style={{color : "green", margin : "10px", marginLeft : "20px"}}></CheckLg></a>
                        <a href="#" onClick={() => removeFriend(friendData.friendname)}>
                            <XLg style={{color : "red", margin : "10px"}}></XLg></a>    
                    </Navbar.Text>
                </div>
            )
        }
    }

    async function PopulateFriendList() {
        const friendData = await fetch('http://localhost:8080/GetAllFriends', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : loginName})
          }).then(res => {
            if (res.status === 200) {
                return res.json()
            }
        })
        var updatedFriendList = []
        friendData.forEach(friend => {
            const friendListItem = createFriendlistItem(friend)
            if (friendListItem) {
                updatedFriendList.unshift(friendListItem)
            }
            
        })
        setFriendList(updatedFriendList)
    }

    return(
        <div className="dashboard_wrapper" >
            <div id="top">
                <Navbar variant="dark" id="Navbar" bg="dark" expand="lg" fixed="top" style={{height : "14vh", minHeight : "120px"}}>
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
                                    {friendList.length === 0 && [<div style={{width : "max-content", margin : "10px", border : "2px", backgroundColor : "#212529", borderStyle : "solid", borderRadius : "5px"}}>
                                        <Navbar.Text style={{color : "#8a9a93", margin : "10px"}}>You don't have any Friends</Navbar.Text></div>]}
                                    {friendList.length > 0 && friendList}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>

                        <Navbar.Collapse id="navbar-dark" className="justify-content-center">
                            <form id="find-user" style={{marginTop : "15px"}}>
                            <p><Navbar.Text style={{marginRight : "10px"}}>Find User</Navbar.Text></p>
                                <label>          
                                    <input type="text" value={findUserText} onKeyPress={e => onKeyPress(e)} onChange={e => setFindUserText(e.target.value)}/>
                                </label>
                                <Navbar.Text style={{marginLeft : "10px"}}><a href='#' onClick={findUser}>Search</a></Navbar.Text>
                                <p style={{color : "red", marginTop : "10px"}}>{findUserStatusMessage}</p>
                            </form>
                        </Navbar.Collapse>

                        <Navbar.Collapse className="justify-content-end" style={{marginRight : "10px"}}>
                            <Navbar.Text style={{marginTop : "25px"}}>
                                Signed in as: <a href="#" onClick={() => ChangeCurrentUser(loginName)}>{loginName}</a>
                                <p><Navbar.Text onClick={logoutUser} style={{marginLeft: "20px"}}><a href='http://localhost:3000/Login'>Sign Out</a></Navbar.Text></p>
                            </Navbar.Text>  
                        </Navbar.Collapse>

                    </Container>
                </Navbar> 
            </div>
            <div id="bot" onLoad={() => DisplayAllPosts(loginName)}>
                <div style={{backgroundColor : "#212529", color : "white", marginTop : "30px", borderRadius : "10px", paddingTop : "15px", paddingBottom : "15px", paddingLeft : "35px", paddingRight : "35px", textAlign : "center"}}>
                    <h1 style={{color : "#8a9a93"}}>{currentUser}'s Page</h1>
                    {currentUserFriendStatus === 3 && 
                        <Navbar.Text style={{color : "#8a9a93"}}>
                            You are Friends
                        </Navbar.Text>}
                    {currentUserFriendStatus === 2 && 
                        <Navbar.Text ><a 
                            style={{color : "white"}} 
                            href='#' 
                            onClick={() => acceptFriendRequest(currentUser)}>
                            Accept Friend Request
                        </a> </Navbar.Text>}
                    {currentUserFriendStatus === 1 && 
                        <Navbar.Text style={{color : "#8a9a93"}}>
                            Friend Request has been Sent
                        </Navbar.Text>}
                    {currentUserFriendStatus === 0 && 
                        <Navbar.Text><a 
                            style={{color : "white"}} 
                            href='#' 
                            onClick={sendFriendRequest}> 
                            Send Friend Request
                        </a> </Navbar.Text>}
                    {(loginName === currentUser || currentUserFriendStatus === 3) && <div style={{width : "600px"}}>
                        <form>
                            <p><Navbar.Text style={{marginRight : "10px", color : "#8a9a93"}}></Navbar.Text></p>
                                      
                                <Form.Group >
                                    <Form.Control id="textField" as="textarea" rows="3" />
                                </Form.Group>
                               
                                <Navbar.Text style={{marginLeft : "10px"}}>
                                    <a style={{color : "white"}} href='#' onClick={createPost}>Post Message</a
                                ></Navbar.Text>
                            </form>

                    </div>}
                </div>

                <div id="posts"  style={{backgroundColor : "lightgreen", color : "white", padding : "10px", borderRadius : "10px", maxWidth : "700px"}}>
                    {userPosts}
                </div>
                <div className="fixed-bottom" >
                    {Chat({loginName, chatFriend, prevChatFriend, setPrevChatFriend, showChatWindow, setShowChatWindow})}        
                </div>

            </div>
        </div>
    )     
}