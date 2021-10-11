import { useEffect } from "react";
import { FormGroup, FormControl, FormLabel, Button, Form, Row, Col} from "react-bootstrap";
import {ArrowUpSquare, XLg} from 'react-bootstrap-icons';

//import server from './../../server'
const socket = require("socket.io");

export default function Chat({loginName, chatFriend, prevChatFriend, setPrevChatFriend, showChatWindow, setShowChatWindow}) {

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
          //findUser()
        }
    }

    async function loadAllMessages() {

    }

    function createChatMessage() {

    }

    return (
        <div style={{backgroundColor : "#212529", width : "400px  ", height : "600px", 
                     margin : "30px", borderRadius : "10px", borderWidth : "10px", borderColor : "#212529"}}>
            <div style={{textAlign : "right"}}><XLg onClick={() => setShowChatWindow(false)} style={{cursor : "pointer", color : "white", margin: "10px"}}></XLg></div>
            <div style={{color : "#8a9a93", textAlign : "center", paddingTop : "10px"}}>
                
                <h2 style={{marginTop : "-40px"}}>Chat </h2>
                <p>Chatting with {chatFriend}</p>
            </div>
            <div key={'inline'} style={{backgroundColor : "lightgreen", width : "360px", height : "450px", borderRadius : "8px", marginLeft : "20px"}}></div>
            <form id="login-username">
        <label style={{marginLeft : "30px", marginTop : "15px"}} onKeyPress={e => onKeyPress(e)} >
          <input style={{width : "300px"}} type="text" name="username" />
          <ArrowUpSquare  style={{color : "white", scale : "180%", marginLeft : "10px", marginBottom : "4px", cursor : "pointer"}} ></ArrowUpSquare>
        </label>
      </form>

     
        </div>
    )
}
 //onClick={() => setShowChatWindow(false)} 