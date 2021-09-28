


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
  if (msg.childNodes[0].checked == true)
  {
    msg.setAttribute("class", "readMsgBox");
  }
  else
  {
    msg.setAttribute("class", "msgBox");
  }

  fetch('http://localhost:3000/flag', {
    headers: {'Content-Type' : 'application/json'},
    method: 'POST',
    body: JSON.stringify({_id : dateID})
  }).then(function(response){ 
      console.log(response)
  })
}

function createMessage(msgData)
{
  // Lägger in meddelanden på rad.
  console.log(msgData)
  let dateId = msgData._id;
  let message = msgData.msg;
  let msgRead = msgData.flag;
  let msgBox = document.createElement('div');
  msgBox.setAttribute("id", dateId);
  console.log(msgBox);
  msgBox.textContent = message;  

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute("onchange", `markRead(${msgBox.id});`); // Adds a function dynamically to the checkbox.
  
  if (msgRead) {
    msgBox.setAttribute("class", "readMsgBox");
    checkbox.checked = true;
  }
  else {
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
  let msg = textField.value;
  let data = {msg : msg, flag : false, _id : Date.now()}
  let body = JSON.stringify(data)

  fetch('http://localhost:3000/save', { 
      headers: {
      'Content-Type': 'application/json'
      },
      method: 'POST',
      body: body
    }).then(function(res) {
      console.log(res.status)})  
  
  createMessage(data);
  textField.value=''
}

async function listMsgs()
{  
  const messages = await fetch('http://localhost:3000/getall', {
    headers: {
      'Content-Type' : 'application/json'
    },
    method: 'GET'
  }).then(function(res) {
    return res.json();
  })

  messages.forEach(message => createMessage(message));
  
  /*
  if (document.cookie != "")
  {
    let keyValues = document.cookie.split("; ");
    keyValues.sort().forEach(keyValue => createMessage(keyValue));
  } */
}