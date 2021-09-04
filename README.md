# TDP013 HT2021 vikro653 danhu849


## Lab1

[https://tdp013-lab1-vikro653.herokuapp.com/lab1.html](https://tdp013-lab1-vikro653.herokuapp.com/lab1.html)


#### Reflektionsfrågor


- **Hur ser strukturen och flödet ut i er applikation?**

När användaren postar ett nytt meddelande anropas _addMsg_ funktionen som kollar att längden på meddelandet är större än 0 tecken och mindre än 140 tecken. 

Om användarens meddelnade har fel längd anropas _tooLongMessage_ funktionen som gör att en informerande ruta kommer fram på skärmen.

Om användarens meddelande är lagom långt anropas sparas meddelandet i en cookie, och _createMessage_ anropas vilket skapar en ny ruta på sidan med användarens meddelande.

När sidan laddas om anropas funktionen _listMsgs_ som anropar _createMessage_ för varje meddelande sparat i användarens cookie.



- **Är det bra eller dåligt att webbläsaren automatiskt förändrar utseende och beteende på vissa HTML-element (ex. raadionknappar)?**

Dåligt för utvecklaren, mer jobb att se till så att sidan ser bra ut i olika webbläsare.

- **Vad är en cookie?**


- **Använder ni asynkrona eller synkrona anrop i er JavaScript?**

Synkrona.




## Lab2

TODO
