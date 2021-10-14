import { useEffect, useState, useRef } from "react";
import {ArrowUpSquare, XLg} from 'react-bootstrap-icons';
import io from "socket.io-client";

import './Chat.css';

const socket = io.connect("http://localhost:3001")

export default function Chat({loginName, chatFriend, setChatFriend, showChatWindow, setShowChatWindow}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageDict, setMessageDict] = useState({})
    
    // up-to-state version of messageList
    const messageDictRef = useRef()
    messageDictRef.current = messageDict
  
    const roomId = loginName < chatFriend ? loginName+chatFriend : chatFriend+loginName
    useEffect(() => {
        if (chatFriend && roomId !== "") {
            socket.emit("join_room", roomId);
        }
    }, [roomId])
       
    useEffect(() => {
        socket.on("recieve_message", (data) => {
            createChatBubble(data.message, data.author)
        });
        
    }, [socket])

    if (!showChatWindow) {
        return <div></div>
    }

    function onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
          sendChatMessage();
        }
    }

    function createChatBubble(message, sender) {
        let chatBubble = <div key={Date.now()} className={sender == loginName ? "chatBubbleSender" : "chatBubbleReciever"}>
                            <h4>{sender}</h4>
                            {message}
                        </div>
        let updatedMessageList = [chatBubble, ...messageDictRef[chatFriend]]
        let updatedMessageDict = {...messageDictRef, chatFriend : updatedMessageList}
        setMessageDict(updatedMessageDict)
    }

    async function sendChatMessage() {
        if (currentMessage !== "") {
            createChatBubble(currentMessage, loginName)
            const messageData = {
                _id: Date.now(),
                room: roomId,
                author: loginName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setCurrentMessage("")
        }
    }

    async function closeChatWindow() {
        setChatFriend("") // funkar inte ?
        setShowChatWindow(false) 
    }

    return (
        <div className="chatWindow">
            <div className="closeButtonDiv">
                <XLg className="closeButtonIcon" onClick={closeChatWindow}></XLg>
            </div>

            <div className="chatHeaderDiv"> 
                <h2 className="headerText">Chat</h2>
                <p>Chatting with {chatFriend}</p>
            </div>

            <div className="messageDiv">{messageDict[chatFriend]}</div>
            <form>
                <label className="messageLabel" onKeyPress={e => onKeyPress(e)}>
                    <input value={currentMessage} 
                           className="messageInput"
                           type="text" 
                           placeholder="Write message here..." 
                           onChange={(event) => {setCurrentMessage(event.target.value)}} 
                           name="username"/>
                    <ArrowUpSquare className="sendMessageIcon" onClick={sendChatMessage}></ArrowUpSquare>
                </label>
            </form>
        </div>)
}
 