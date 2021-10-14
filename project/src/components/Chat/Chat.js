import { useEffect, useState, useRef } from "react";
import {ArrowUpSquare, XLg} from 'react-bootstrap-icons';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001")

export default function Chat({loginName, chatFriend, setChatFriend, showChatWindow, setShowChatWindow}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([])
    
    // up-to-state version of messageList
    const messageListRef = useRef()
    messageListRef.current = messageList
  
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
        var chatBubble
        if (sender == loginName) {
            chatBubble = <div className="chatBubble">
                            <h4>{sender}</h4>
                            {message}
                         </div>
        } else {
            chatBubble = <div style={{backgroundColor : "#212529", 
                                      color : "#8a9a93",
                                      borderRadius : "10px", 
                                      width : "max-content", 
                                      padding : "10px", 
                                      margin : "10px", 
                                      marginLeft: "15px", 
                                      minWidth : "125px", 
                                    maxWidth : "245px"}}>
                            <h4>{sender}</h4>
                            {message}
                         </div>
        }
        setMessageList([chatBubble, ...messageListRef.current])
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
        <div style={{backgroundColor : "#212529", 
                     width : "350px", 
                     height : "500px", 
                     margin : "30px", 
                     borderRadius : "10px", 
                     borderWidth : "10px", 
                     borderColor : "#212529"}}>

            <div style={{textAlign : "right"}}>
                <XLg onClick={closeChatWindow} 
                     style={{cursor : "pointer", 
                             color : "white", 
                             margin: "10px"}}>
                </XLg>
            </div>

            <div style={{color : "#8a9a93", 
                         textAlign : "center", 
                         paddingTop : "10px"}}> 

                <h2 style={{marginTop : "-40px"}}>
                    Chat 
                </h2>

                <p>
                    Chatting with {chatFriend}
                </p>
            </div>

            <div key={'inline'} 
                 style={{backgroundColor : "lightgreen", 
                         width : "316px", 
                         height : "350px", 
                         display: "flex", 
                         flexDirection : "column-reverse", 
                         borderRadius : "8px", 
                         marginLeft : "17px", 
                         overflow : "scroll"}}>
                {messageList}
            </div>
            <form>
                <label style={{marginLeft : "22px", 
                               marginTop : "15px"}} 
                       onKeyPress={e => onKeyPress(e)}>

                    <input value={currentMessage} 
                           style={{width : "270px"}} 
                           type="text" 
                           placeholder="Write message here..." 
                           onChange={(event) => {setCurrentMessage(event.target.value)}} 
                           name="username"/>

                    <ArrowUpSquare onClick={sendChatMessage} 
                                   style={{color : "white", 
                                           scale : "180%", 
                                           marginLeft : "10px",
                                           marginBottom : "4px", 
                                           cursor : "pointer"}}>
                    </ArrowUpSquare>

                </label>
            </form>
        </div>)
}
 