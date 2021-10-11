import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router";


function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
//import useChat from "../../useChat";

const ChatRoom = (props) => {
    let query = useQuery();
    //console.log(props)
    const [currentMessage, setCurrentMessage] = useState("");
    const socket = io.connect("http://localhost:3001");
    const location = useLocation();
    //const roomId  = location.state.roomId
    const roomId = query.get('roomId');
    console.log(roomId)
    const username = props.username
 
    
    socket.emit("join_room", roomId);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: roomId,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
        }
    };

    useEffect(() => {
        socket.on("recieve_message", (data) => {
            console.log('Data',data)
        })
    }, [socket])


    return (
        <div>
            <div className="chat-header">
                <p>Chat: {roomId}</p>
            </div> 
            <div className="chat-body"></div>
                <input
                    type="text" 
                    placeholder="Write message here..." 
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                />
                <button onClick={sendMessage}>Post</button>
            <div className="chat-footer">
                <button><a href="/dashboard">Home</a></button>
            </div>  
            
        </div>
        
    );

    
};


export default ChatRoom; 