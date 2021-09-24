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
// Viktors kod <- kolla denna!
  fetch('http://localhost:3000/flag', {
    headers: {'Content-Type' : 'application/json'},
    method: 'POST',
    body: JSON.stringify({_id : dateID})
    }).then(function(response){ 
      console.log(response)
    })
}

function createMessage(JSONmessageObject)
{
  // Lägger in meddelanden på rad.
  let dateId = JSONmessageObject._id;
  let message = JSONmessageObject.msg;
  let msgRead = JSONmessageObject.flag;
  let msgBox = document.createElement('div');
  msgBox.setAttribute("id", dateId);
  msgBox.textContent = message;

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute("onchange", `markRead(${msgBox.id});`); // Adds a function dynamically to the checkbox.
  
  if (msgRead)
  {
    msgBox.setAttribute("class", "readMsgBox");
    checkbox.checked = true;
  }
  else if (!msgRead)
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
  let msg = document.getElementById('postText').value;
  fetch('http://localhost:3000/save', { 
      headers: {
      'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({msg, flag : false, _id : Date.now()})
    }).then(function(res) {
      console.log(res.status)})   
} 
  
  
function sortByObjectId(ObjectIdA, ObjectIdB){
  return ObjectIdA._id - ObjectIdB._id
}

async function listMsgs()
{  
  await fetch('http://localhost:3000/getall', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }).then(messagesFromDatabase => {
    return messagesFromDatabase.json();
  }).then(messagesFromDatabase => {
    console.log(messagesFromDatabase.sort(sortByObjectId));
    messagesFromDatabase.sort(sortByObjectId).forEach(JSONmessageObject => createMessage(JSONmessageObject));
  }).catch(error => {
    console.log(`Error: ${error} in listMsgs().`);
  })
}