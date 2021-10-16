
function enter(event) {
  if (event.keyCode == 13)
  {
    addMsg();
  }
}

function tooLongMessage()
{
  let modal = document.getElementById("myModal");
  modal.style.display = "block";

  let span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
}

// Changed the msgbox color depending on change of checkbox.
function markRead(id)
{
  let msg = document.getElementById(id.id);
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
    body: JSON.stringify({_id : id.id.substring(2)})
  })
}

function createMessage(msgData)
{
  // Lägger in meddelanden på rad.
  let id = msgData._id
  let message = msgData.msg;
  let msgRead = msgData.flag;
  let msgBox = document.createElement('div');
  msgBox.setAttribute("id", id);
  msgBox.textContent = message; 

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute("onchange", `markRead(${id});`); // Adds a function dynamically to the checkbox.
  
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

async function addMsg()
{
  let textField = document.getElementById('postText');
  let msg = textField.value;
  let data = {msg : msg, flag : false}
  let body = JSON.stringify(data)

  let result = await fetch('http://localhost:3000/save', { 
      headers: {
      'Content-Type': 'application/json'
      },
      method: 'POST',
      body: body
  }).then(function(res) {
    if (res.status == 400) {
      tooLongMessage()
    } else {
      return res.json()
    }
  })
  if (result) {
    createMessage({_id : "id" + result.insertedId, ...data})
  }
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
    return res.json()
  })

  messages.forEach(message => {
    message._id = "id" + message._id
    createMessage(message)
  }) 
}
