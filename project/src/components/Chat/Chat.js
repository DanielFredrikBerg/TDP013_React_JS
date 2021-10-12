import { useEffect, useState } from "react";
import { FormGroup, FormControl, FormLabel, Button, Form, Row, Col} from "react-bootstrap";
import {ArrowUpSquare, XLg} from 'react-bootstrap-icons';
import io from "socket.io-client";

//import server from './../../server'
//const socket = require("socket.io");

export default function Chat({loginName, chatFriend, setChatFriend, prevChatFriend, setPrevChatFriend, showChatWindow, setShowChatWindow}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const socket = io.connect("http://localhost:3001");
    const roomId = loginName < chatFriend ? loginName+chatFriend : chatFriend+loginName;
    console.log("Room id from Chat component: ", roomId);
    
    socket.emit("join_room", roomId);    

    useEffect(() => {
        console.log("sdf")
        socket.on("recieve_message", (data) => {
            console.log('Data',data)
        });
        
    }, [socket])


    if (prevChatFriend && chatFriend !== prevChatFriend) {
        //alert("disconnect prev")
        // disconnect loginName prevChatFriend pair
        setPrevChatFriend(chatFriend)
    }

    if (!showChatWindow) {
        //alert("disconnect")
        // disconnect loginName chatFriend pair
        return <div></div>
    }
 

    //const io = socket(server)

    function onKeyPress(event) {
        if (event.which === 13 /* Enter */) {
          event.preventDefault();
          createChatMessage();
        }
    }

    async function loadAllMessages() {

    }

    async function createChatMessage() {
        if (currentMessage !== "") {
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
        //alert("close")
        setChatFriend(null) // funkar inte ?
        setShowChatWindow(false)
    }

    return (
        <div style={{backgroundColor : "#212529", width : "30vw", height : "60vh", minHeight : "300px", 
                     minWidth : "200px", maxHeight : "600px", maxWidth : "400px", 
                     margin : "30px", borderRadius : "10px", borderWidth : "10px", borderColor : "#212529"}}>
            <div style={{textAlign : "right"}}><XLg onClick={closeChatWindow} style={{cursor : "pointer", color : "white", margin: "10px"}}></XLg></div>
            <div style={{color : "#8a9a93", textAlign : "center", paddingTop : "10px"}}>
                
                <h2 style={{marginTop : "-40px"}}>Chat </h2>
                <p>Chatting with {chatFriend}</p>
            </div>
            <div key={'inline'} style={{backgroundColor : "lightgreen", width : "80%", height : "450px", borderRadius : "8px", marginLeft : "20px"}}></div>
            <form>
        <label style={{marginLeft : "30px", marginTop : "15px"}} onKeyPress={e => onKeyPress(e)} >
          <input value={currentMessage} style={{width : "300px"}} type="text" placeholder="Write message here..." onChange={(event) => { setCurrentMessage(event.target.value) }} name="username" />
          <ArrowUpSquare onClick={createChatMessage} style={{color : "white", scale : "180%", marginLeft : "10px", marginBottom : "4px", cursor : "pointer"}} ></ArrowUpSquare>
        </label>
      </form>

     
        </div>
    )
}
 //onClick={() => setShowChatWindow(false)} 