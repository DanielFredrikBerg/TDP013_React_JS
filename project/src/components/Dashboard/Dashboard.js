import React, {useState, useEffect, useRef} from 'react';

import {Dropdown, Navbar, Container, Form} from 'react-bootstrap';
import {CheckLg, XLg, ChatLeftText} from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

import Chat from '../Chat/Chat'

export default function Dashboard({loginName}) {

    let [currentUser, setCurrentUser] = useState()
    const [userPosts, setUserPosts] = useState([])
    const [postText, setPostText] = useState("")
    const [findUserText, setFindUserText] = useState()
    const [findUserStatusMessage, setFindUserStatusMessage] = useState()
    let [currentUserFriendStatus, setCurrentUserFriendStatus] = useState(-1)
    const [friendList, setFriendList] = useState([])
    const [showChatWindow, setShowChatWindow] = useState(false)
    let [chatFriend, setChatFriend] = useState()

    useEffect(async () => {
        if (sessionStorage.getItem('currentUser')) {
            const storedCurrentUser = sessionStorage.getItem('currentUser')
            currentUser = storedCurrentUser
            setCurrentUser(storedCurrentUser)
            const status = await GetFriendStatus(storedCurrentUser)
            setCurrentUserFriendStatus(status)
            DisplayAllPosts(storedCurrentUser)
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

    function createPostElement(postData) {
        return (
            <div className="postBubble" key={Date.now()}>
                <h4>
                    <a href="#"
                       onClick={() => ChangeCurrentUser(postData.creator)}>
                       {postData.creator}
                    </a>
                </h4>
                {postData.msg}
            </div>)
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
        }).catch(err => console.log("DisplayAllPosts Error: ", err))
        var updatedUserPosts = []
        msgData.forEach(msg => updatedUserPosts.unshift(createPostElement(msg)))
        setUserPosts(updatedUserPosts)
    }

    async function createPost() {
        if (postText.length > 0) {
            let postData = {msg : postText, creator : loginName, page : currentUser}
            setPostText("")  
            await fetch('http://localhost:8080/AddMessage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(postData)
            }).then(res => {
                if (res.status === 200) {
                    let post = createPostElement(postData)
                    setUserPosts([post, ...userPosts])
                } 
            }).catch(err => console.log("createPost() error: ", err))
        }
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
        }).catch(err => console.log("GetFriendStatus(friend) error: ", err) )
        if (result) {
            return result.friendstatus 
        } else {
            return 0
        } 
    }

    async function ChangeCurrentUser(user) {
        if (user === loginName) {
            setCurrentUserFriendStatus(-1)
        } else {
            const status = await GetFriendStatus(user)
            setCurrentUserFriendStatus(status) 
        }
        sessionStorage.setItem('currentUser', user) 
        currentUser = user  
        setCurrentUser(user)
        DisplayAllPosts(user) 
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
        }).catch(err => console.log("findUser() Dashboard.js error", err))
        setFindUserText("")
    }

    async function changeFriendStatus(user, friend, status) {
        await fetch('http://localhost:8080/SetFriendStatus', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : user, friendname : friend, friendstatus : status})
          }).then(res => {
            if (res.status === 200) {
                return  
            } 
        }).catch(err => console.log("changeFriendStatus() error: ", err))
    }

    async function sendFriendRequest() {
        await changeFriendStatus(currentUser, loginName, 2) 
        await changeFriendStatus(loginName, currentUser, 1)
        setCurrentUserFriendStatus(1)
    }

    async function acceptFriendRequest(friend) {
        await changeFriendStatus(loginName, friend, 3)
        await changeFriendStatus(friend, loginName, 3)
        if (friend === currentUser) {
            currentUserFriendStatus = 3
            setCurrentUserFriendStatus(3)
        }
        PopulateFriendList()
    }

    async function removeFriend(friend) {
        await changeFriendStatus(loginName, friend, 0)
        await changeFriendStatus(friend, loginName, 0)
        if (friend === currentUser) {
            currentUserFriendStatus = 0
            setCurrentUserFriendStatus(0)
        }
        PopulateFriendList()
    }

    function openChatWindow(friend) {
        if (chatFriend === friend) {
            chatFriend = null
            setChatFriend(null)
            setShowChatWindow(false)
        } else {
            chatFriend = friend
            setChatFriend(friend)
            setShowChatWindow(true)
        }
    }

    function createFriendlistItem(friendData, index) {
        if (friendData.friendstatus == 3) {
           return <div key={index} className="friendListItem">
                    <Navbar.Text className="friendListText"> 
                        <a href='#' onClick={() => ChangeCurrentUser(friendData.friendname)}>
                            {friendData.friendname}
                        </a>
                        <a href="#" onClick={() => openChatWindow(friendData.friendname)}>
                            <ChatLeftText className="friendListChatIcon"></ChatLeftText>
                        </a> 
                        <a href="#" onClick={() => removeFriend(friendData.friendname)}>
                            <XLg className="friendListRemoveIcon"></XLg>
                        </a>    
                    </Navbar.Text>
                  </div>
        } else if (friendData.friendstatus === 2) {
            return <div key={index} className="friendListItem">
                        <Navbar.Text className="friendListText"> 
                            <a href='#' onClick={() => ChangeCurrentUser(friendData.friendname)}>
                                {friendData.friendname}
                            </a> 
                            <a href="#" onClick={() => acceptFriendRequest(friendData.friendname)}>
                                <CheckLg className="friendListAcceptIcon"></CheckLg>
                            </a>
                            <a href="#" onClick={() => removeFriend(friendData.friendname)}>
                                <XLg className="friendListRemoveIcon"></XLg>
                            </a>    
                        </Navbar.Text>
                   </div>
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

        }).catch(err => console.log("PopulateFriendList: ", err))
        let updatedFriendList = []
        friendData.forEach((friend, index) => {
            const friendListItem = createFriendlistItem(friend, index)
            if (friendListItem) {
                updatedFriendList.unshift(friendListItem)
            }  
        })
        console.log(updatedFriendList)
        setFriendList(updatedFriendList)
    }

    return(
        <div className="dashboard_wrapper" >
            <div id="top">
                <Navbar variant="dark" 
                        id="Navbar" 
                        bg="dark" 
                        expand="sm" 
                        fixed="top" 
                        style={{height : "14vh", minHeight : "120px"}}>
                    <Container fluid>
                        <Navbar.Toggle aria-controls="navbar-dark" />
                        <Navbar.Collapse>
                            <Dropdown>
                                <Dropdown.Toggle 
                                    ariant="dark"
                                    id="dropdown_button">
                                    Friends
                                </Dropdown.Toggle>  
                                <Dropdown.Menu style={{backgroundColor : "lightgreen", 
                                                       borderWidth : "3px", 
                                                       borderColor : "#212529"}}>
                                    {friendList.length === 0 && 
                                    <div style={{width : "max-content",
                                                  margin : "10px", 
                                                  border : "2px", 
                                                  backgroundColor : "#212529", 
                                                  borderStyle : "solid", 
                                                  borderRadius : "5px"}}>
                                        <Navbar.Text style={{color : "#8a9a93", margin : "10px"}}>
                                            You don't have any Friends
                                        </Navbar.Text>
                                    </div>}
                                    {friendList.length > 0 && friendList}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>

                        <Navbar.Collapse id="navbar-dark" 
                                         className="justify-content-center">
                            <form id="find-user" 
                                  style={{marginTop : "15px"}}>
                                <p>
                                    <Navbar.Text style={{marginRight : "10px"}}>
                                        Find User
                                    </Navbar.Text>
                                </p>
                                <label>          
                                    <input type="text" 
                                           value={findUserText} 
                                           onKeyPress={e => onKeyPress(e)} 
                                           onChange={e => setFindUserText(e.target.value)}/>
                                </label>
                                <Navbar.Text style={{marginLeft : "10px"}}>
                                    <a href='#' 
                                       onClick={findUser}>
                                       Search
                                    </a>
                                </Navbar.Text>
                                <p style={{color : "red", marginTop : "10px"}}>{
                                    findUserStatusMessage}
                                </p>
                            </form>
                        </Navbar.Collapse>

                        <Navbar.Collapse className="justify-content-end" 
                                         style={{marginRight : "10px"}}>
                            <Navbar.Text style={{marginTop : "25px"}}>
                                {"Signed in as: "}
                                <a href="#" 
                                   onClick={() => ChangeCurrentUser(loginName)}>
                                   {loginName}
                                </a>
                                <p>
                                    <Navbar.Text onClick={() => sessionStorage.clear()} 
                                                 style={{marginLeft: "20px"}}>
                                        <a href='http://localhost:3000/Login'>
                                            Sign Out
                                        </a>
                                    </Navbar.Text>
                                </p>
                            </Navbar.Text>  
                        </Navbar.Collapse>
                    </Container>
                </Navbar> 
            </div>
            <div id="bot">
                <div style={{backgroundColor : "#212529", 
                             color : "white", 
                             marginTop : "30px", 
                             borderRadius : "10px", 
                             paddingTop : "15px", 
                             paddingBottom : "15px", 
                             paddingLeft : "35px", 
                             paddingRight : "35px", 
                             textAlign : "center"}}>

                    <h1 style={{color : "#8a9a93"}}>
                        {currentUser}'s Page
                    </h1>

                    {currentUserFriendStatus === 3 && 
                        <Navbar.Text style={{color : "#8a9a93"}}>
                            You are Friends
                        </Navbar.Text>}

                    {currentUserFriendStatus=== 2 && 
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

                    {(loginName === currentUser || currentUserFriendStatus === 3) && 
                    <div style={{width : "600px"}}>
                        <form>    
                            <Form.Group style={{marginTop : "15px"}}>
                                <Form.Control id="textField" 
                                              as="textarea" 
                                              rows="3"
                                              value={postText}
                                              onChange={e => setPostText(e.target.value)}/>
                            </Form.Group>

                            <Navbar.Text style={{marginLeft : "10px"}}>
                                <a style={{color : "white"}} 
                                   href='#' 
                                   onClick={createPost}>
                                   Post Message
                                </a>
                            </Navbar.Text>
                        </form>
                    </div>}
                </div>

                <div id="posts"  style={{backgroundColor : "lightgreen", 
                                         color : "white", 
                                         padding : "10px", 
                                         borderRadius : "10px", 
                                         maxWidth : "700px"}}>
                    {userPosts}
                </div>
                <div className="fixed-bottom" >
                    {Chat({loginName, chatFriend, setChatFriend, showChatWindow, setShowChatWindow})}        
                </div>

            </div>
        </div>
    )     
}