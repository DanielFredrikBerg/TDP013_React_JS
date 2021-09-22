const { post } = require("superagent");
const handlers = request("./lib/requestHandlers");

function enter(event) {
  if (event.keyCode == 13)
  {
    addMsg();
  }
}

function tooLongMessage()
{
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
}

// Changed the msgbox color depending on change of checkbox.
function markRead(dateID)
{
  let msg = document.getElementById(dateID);
  //alert(`DateID: ${dateID}`);
  //alert(`${msg} test`);
  if (msg.childNodes[0].checked == true)
  {
    msg.setAttribute("class", "readMsgBox");
    document.cookie = `${msg.id}=${msg.textContent}:rd`;
  }
  else
  {
    msg.setAttribute("class", "msgBox");
    document.cookie = `${msg.id}=${msg.textContent}:ud`;
  }
}

function createMessage(keyValue)
{
  // Lägger in meddelanden på rad.
  let dateId = keyValue.split('=')[0];
  let message = keyValue.split('=')[1];
  let msgRead = message.substr(message.length - 2);
  let msgBox = document.createElement('div');
  msgBox.setAttribute("id", dateId);
  msgBox.textContent = message.substr(0, message.length - 3);  

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute("onchange", `markRead(${msgBox.id});`); // Adds a function dynamically to the checkbox.
  
  if (msgRead == 'rd')
  {
    msgBox.setAttribute("class", "readMsgBox");
    checkbox.checked = true;
  }
  else if (msgRead == 'ud')
  {
    msgBox.setAttribute("class", "msgBox");
    checkbox.checked = false;
  }

  // Puts checkbox before the text in the msgbox.
  msgBox.insertBefore(checkbox, msgBox.firstChild);

  // Makes sure last message is seen at the top of msgs.
  let messages = document.getElementById('messages');
  messages.insertBefore(msgBox, messages.firstChild);
}

function addMsg()
{
  let textField = document.getElementById('postText');
  let messageText = textField.value;
  console.log(messageText);
  await fetch('http://localhost:3000/send', {
      method: 'POST',
      body: JSON.stringify(messageText)
    }).then(function(res) {
      keyValue = `${Date.now()}=${messageText}:ud`;
      document.cookie = keyValue;
      res.json()})
    .then(res => console.log(res));
} 
  
  

function listMsgs()
{  
  if (document.cookie != "")
  {
    let keyValues = document.cookie.split("; ");
    keyValues.sort().forEach(keyValue => createMessage(keyValue));
  }
}