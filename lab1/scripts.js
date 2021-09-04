<script>

function messageIsTooLongPopup()
{
  var popUpTheme = document.getElementById("myModal");
  popUpTheme.style.display = "block";

  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    popUpTheme.style.display = "none";
  }
}

// Changed the message box color depending on change of checkbox.
function changeColorOfMessageBoxIfRead(messageDateID)
{
  let messageBox = document.getElementById(messageDateID);
  if (messageBox.childNodes[0].checked)
  {
    messageBox.setAttribute("class", "readColorMessageBox");
    // Blir knas i utskriften
    //document.cookie = `${messageBox.id}=${messageBox.innerHTML}`;
  }
  else
  {
    messageBox.setAttribute("class", "defaultColorMessageBox");
    //document.cookie = `${messageBox.id}=${messageBox.innerHTML}`;
  }
}

function createMessage(keyValueOfCookie)
{
  // Lägger in meddelanden på rad.
  let messageDateID = keyValueOfCookie.split('=')[0];
  let messageText = keyValueOfCookie.split('=')[1];
  let newDynamicDivMessage = document.createElement('div');
  newDynamicDivMessage.setAttribute("class", "defaultColorMessageBox");
  newDynamicDivMessage.setAttribute("checked", false);
  newDynamicDivMessage.setAttribute("id", messageDateID);
  newDynamicDivMessage.innerHTML = `<p>${messageText}</p>`;
  
  checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute( "onchange", `changeColorOfMessageBoxIfRead(${newDynamicDivMessage.id});`); // Adds a function dynamically to the checkbox.
  // Puts checkbox before the text in the defaultColorMessageBox.
  newDynamicDivMessage.insertBefore(checkbox, newDynamicDivMessage.firstChild);

  // Makes sure last message is seen at the top of messageList.
  let messages = document.getElementById('messageList');
  messages.insertBefore(newDynamicDivMessage, messages.firstChild);
}

function addNewMessageToMessageList()
{
  let newMessageFromTextInputForm = document.getElementById('messageTextInputForm').value;
  if (newMessageFromTextInputForm.length == 0 || newMessageFromTextInputForm.length > 140)
  {
    messageIsTooLongPopup();
  }
  else
  {
    keyValueOfCookie = `${Date.now()}=${newMessageFromTextInputForm}`;
    document.cookie = keyValueOfCookie;

    createMessage(keyValueOfCookie);
  }
}

function listAllMessagesFromCookies()
{  
  //alert(document.cookie);
  
  if (document.cookie != "")
  {
    let cookies = document.cookie.split(";");
    
    cookies.forEach(keyValueOfCookie => createMessage(keyValueOfCookie));
    
  }
}


</script> 