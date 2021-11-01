import React, {useState, useEffect, useRef} from 'react';

import {Dropdown, Navbar, Container, Form} from 'react-bootstrap';
import {CheckLg, XLg, ChatLeftText} from 'react-bootstrap-icons';
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
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
    const [usersFoundList, setUsersFoundList] = useState([])
    const [showChatWindow, setShowChatWindow] = useState(false)
    let [chatFriend, setChatFriend] = useState()
    const [postErrorMessage, setPostErrorMessage] = useState()
    const [userList, setUserList] = useState([]);

    const typeahead = useRef()

    useEffect(async () => {
        if (sessionStorage.getItem('currentUser')) {
            const storedCurrentUser = sessionStorage.getItem('currentUser')
            currentUser = storedCurrentUser
            setCurrentUser(storedCurrentUser)
            const status = await getFriendStatus(storedCurrentUser)
            setCurrentUserFriendStatus(status)
            displayAllPosts(storedCurrentUser)
        } else {
            setCurrentUser(loginName)
            displayAllPosts(loginName)
        }
        populateFriendList()
        populateUserList()
    },[])

    function onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
          findUser()
        }
    }

    function validatePostMessage(message) {
        return message !== null
            && typeof message  === 'string'
            && message .length > 0
            && message .length < 1400 
    }

    function createPostElement(postData, index) {
        return (
            <div className="postBubble" key={index}>
                <h4>
                    <button className="Button" onClick={() => changeCurrentUser(postData.creator)}>
                       {postData.creator}
                    </button>
                </h4>
                {postData.msg}
            </div>)
    }

    async function displayAllPosts(user) { 
        const msgData = await fetch('http://localhost:8080/GetMessages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : user})
        }).then(res => {  
            if (res.status === 200) {
                return res.json()
            } 
        }).catch(err => console.log("displayAllPosts Error: ", err))
        let updatedUserPosts = []
        msgData.forEach((msg, index) => {
            const userPost = createPostElement(msg, index)
            if (userPost) {
                updatedUserPosts.unshift(userPost)
            }
        })
        setUserPosts(updatedUserPosts)
    }

    async function createPost() {
        if (validatePostMessage(postText)) {
            let postData = {msg : postText, creator : loginName, page : currentUser}
            await fetch('http://localhost:8080/AddMessage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(postData)
            }).then(res => {
                if (res.status === 200) {
                    let post = createPostElement(postData)
                    setUserPosts([post, ...userPosts])
                    setPostText("") 
                    setPostErrorMessage("")
                } 
            }).catch(err => console.log("createPost() error: ", err))
        } else {
            setPostErrorMessage("Message has to be above 0, but below 1400 characters.")
        }   
    }

    async function getFriendStatus(friend) {
        if (friend === loginName) {
            return -1
        }
        const result = await fetch('http://localhost:8080/getFriendStatus', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : loginName, friendname : friend})
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            }   
        }).catch(err => console.log("getFriendStatus(friend) error: ", err) )
        if (result) {
            return result.friendstatus 
        } else {
            return 0
        } 
    }

    async function changeCurrentUser(user) {
        if (user === loginName) {
            setCurrentUserFriendStatus(-1)
        } else {
            const status = await getFriendStatus(user)
            setCurrentUserFriendStatus(status) 
        }
        sessionStorage.setItem('currentUser', user) 
        currentUser = user  
        setCurrentUser(user)
        displayAllPosts(user) 
    }

    async function findUser() {
        await populateUserList()
        if (findUserText) {
            if (userList.includes(findUserText[0])) {
                changeCurrentUser(findUserText[0])
                setFindUserText("")
                setFindUserStatusMessage("")
                typeahead.current.clear()
            } else {
                setFindUserStatusMessage("User not found.")
            } 
        }
        else {
            setFindUserStatusMessage("")
        }
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
        populateFriendList()
    }

    async function removeFriend(friend) {
        await changeFriendStatus(loginName, friend, 0)
        await changeFriendStatus(friend, loginName, 0)
        if (friend === currentUser) {
            currentUserFriendStatus = 0
            setCurrentUserFriendStatus(0)
        }
        populateFriendList()
    }

    function toggleChatWindow(friend) {
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
                        <button className="Button friendListUserLink"  onClick={() => changeCurrentUser(friendData.friendname)}>
                            {friendData.friendname} 
                        </button>
                        <ChatLeftText className="friendListChatIcon" onClick={() => toggleChatWindow(friendData.friendname)}></ChatLeftText>
                        <XLg className="friendListRemoveIcon" onClick={() => removeFriend(friendData.friendname)}></XLg>  
                    </Navbar.Text>
                  </div>
        } else if (friendData.friendstatus === 2) {
            return <div key={index} className="friendListItem">
                        <Navbar.Text className="friendListText"> 
                            <button className="Button friendListUserLink"  onClick={() => changeCurrentUser(friendData.friendname)}>
                                {friendData.friendname} 
                            </button>
                            <CheckLg className="friendListAcceptIcon" onClick={() => acceptFriendRequest(friendData.friendname)}></CheckLg>
                            <XLg className="friendListRemoveIcon" onClick={() => removeFriend(friendData.friendname)}></XLg>
                        </Navbar.Text>
                   </div>
        }
    }


    async function populateUserList() {
        const usersFound = await fetch('http://localhost:8080/FindUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            }).then(res => {
                return res.json()
            }).catch(err => console.log("populateUserList() Dashboard.js error", err))
        let updatedUserList = []
        if (usersFound) {
            usersFound.results.forEach((userFound) => {
                updatedUserList.push(userFound.username)
            })   
        } 
        setUserList(updatedUserList) 
    }


    async function populateFriendList() {
        const friendData = await fetch('http://localhost:8080/GetAllFriends', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username : loginName})
          }).then(res => {
            if (res.status === 200) {
                return res.json()
            }

        }).catch(err => console.log("populateFriendList: ", err))
        let updatedFriendList = []
        friendData.forEach((friend, index) => {
            const friendListItem = createFriendlistItem(friend, index)
            if (friendListItem) {
                updatedFriendList.unshift(friendListItem)
            }  
        })
        setFriendList(updatedFriendList)
    }

    return(
        <div>
            <div id="top">
                <Navbar letiant="dark" 
                        bg="dark" 
                        expand="sm" 
                        fixed="top"
                        className="navBar">
                    <Container fluid>
                        <Navbar.Toggle aria-controls="navbar-dark" />
                        <Navbar.Collapse className="friendListCollapse">
                            <Dropdown>
                                <Dropdown.Toggle 
                                    ariant="dark"
                                    id="dropdown_button">
                                    Friends
                                </Dropdown.Toggle>  
                                <Dropdown.Menu className="friendList">
                                    {friendList.length === 0 && 
                                    <div className="friendListItem">
                                        <Navbar.Text id="friendListText">
                                            You don't have any Friends
                                        </Navbar.Text>
                                    </div>}
                                    {friendList.length > 0 && friendList}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>

                        <Navbar.Collapse id="navbar-dark" className="justify-content-center">
                            <form className="findUserForm">
                                <div className="findUserDiv">
                                    <Typeahead
                                        id="finduserinput"
                                        ref={typeahead}
                                        onInputChange={setFindUserText}
                                        onChange={setFindUserText}
                                        onKeyDown={e => onKeyPress(e)} 
                                        options={userList}
                                        placeholder="Find user..."
                                        minLength={1}/>
                                </div>
                                <input className="Button findUserLink" type="button" value="Search" onClick={findUser}/>
                                <Dropdown.Menu className="friendList">
                                    {friendList.length > 0 && usersFoundList}
                                </Dropdown.Menu>
                                <p className="findUserStatusMessage">
                                    {findUserStatusMessage}
                                </p>
                            </form>
                        </Navbar.Collapse>

                        <Navbar.Collapse className="justify-content-end logoutCollapse">
                            <Navbar.Text id="logoutText">
                                {"Signed in as: "}
                                    <input id="logoutUserLink" className="Button" type="button" value={loginName} onClick={() => changeCurrentUser(loginName)}/>
                                <p id="logoutp">
                                    <Navbar.Text onClick={() => sessionStorage.clear()} >
                                        <a href='http://localhost:3000/Login' id="logoutLink">
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
                <div className="botDiv">
                    <h1 className="currentUserHeader">
                        {currentUser}'s Page
                    </h1>
                    {currentUserFriendStatus === 3 && 
                        <Navbar.Text className="friendStatusText">
                            You are Friends
                        </Navbar.Text>}

                    {currentUserFriendStatus === 2 && 
                        <Navbar.Text>
                            <button className="Button" onClick={() => acceptFriendRequest(currentUser)}>
                                Accept Friend Request
                            </button> 
                        </Navbar.Text>}

                    {currentUserFriendStatus === 1 && 
                        <Navbar.Text className="friendStatusText">
                            Friend Request has been Sent
                        </Navbar.Text>}

                    {currentUserFriendStatus === 0 && 
                        <Navbar.Text>
                            <button className="Button" onClick={sendFriendRequest}> 
                                Send Friend Request
                            </button> 
                        </Navbar.Text>}

                    {(loginName === currentUser || currentUserFriendStatus === 3) && 
                    <div className="createPostDiv">
                        <form>    
                            <Form.Group className="createPostGroup">
                                <Form.Control id="textField" 
                                              as="textarea" 
                                              rows="3"
                                              resize="none"
                                              value={postText}
                                              onChange={e => setPostText(e.target.value)}/>
                            </Form.Group>
                            <Navbar.Text className="createPostText" >
                                <input className="Button postButton" type="button" value="Post Message" onClick={createPost}/>
                            </Navbar.Text>
                            {postErrorMessage && 
                            <div className="postErrorDiv"> 
                                <p className="postErrorMsg">
                                    {postErrorMessage}
                                </p>
                            </div>}
                        </form>
             
                    </div>}
                </div>
                <div className="postDiv">
                    {userPosts}
                </div>
                <div className="fixed-bottom chatDiv" >
                    {Chat({loginName, chatFriend, setChatFriend, showChatWindow, setShowChatWindow})}        
                </div>

            </div>
        </div>
    )     
}