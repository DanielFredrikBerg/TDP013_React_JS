import React, { useState } from "react";
import io from "socket.io-client";
import "./ChatRoom.css";




//import useChat from "../../useChat";

const ChatRoom = (props) => {
    const [username, setUsername] = useState("")
    const [room, setRoom] = useState("")
    const { roomId } = props.match.params; // Gets roomId from URL
    console.log(roomId);
    const socket = io.connect(`http://localhost:3001/${roomId}`);

    const joinRoom = () =>{
        if (username !== "" && roomId !== "") {
            socket.emit("join_room", roomId)
        }
    };

    return (
        <div className="chat-room-container">   
            <h1 className="room-name">Room: {roomId}</h1>
        </div>
    );

    /*
    const { messages, sendMessage } = useChat(roomId); // Creates a websocket and manages messaging
  const [newMessage, setNewMessage] = React.useState(""); // Message to be sent

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-room-container">
      <h1 className="room-name">Room: {roomId}</h1>
      <div className="messages-container">
        <ol className="messages-list">
          {messages.map((message, i) => (
            <li
              key={i}
              className={`message-item ${
                message.ownedByCurrentUser ? "my-message" : "received-message"
              }`}
            >
              {message.body}
            </li>
          ))}
        </ol>
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      />
      <button onClick={handleSendMessage} className="send-message-button">
        Send
      </button>
    </div>
    );
    */
};


export default ChatRoom; 