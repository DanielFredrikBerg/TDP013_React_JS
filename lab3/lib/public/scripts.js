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

function createMessage(JSONmessageObject)
{
  // Lägger in meddelanden på rad.
  let dateId = JSONmessageObject.creationDate;
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
      body: JSON.stringify({msg, flag : false, creationDate : Date.now()})
    }).then(function(res) {
      console.log(res.status)})   
} 
  
  
function sortByObjectIdCreationDate(ObjectIdA, ObjectIdB){
  return ObjectIdA.creationDate - ObjectIdB.creationDate
}

async function listMsgs()
{  
  const messagesInDatabase = await fetch('http://localhost:3000/getall', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }).then(function(res){
    return res.json();
  })
  console.log(messagesInDatabase.sort(sortByObjectIdCreationDate));
  messagesInDatabase.sort(sortByObjectIdCreationDate).forEach(JSONmessageObject => createMessage(JSONmessageObject));
}