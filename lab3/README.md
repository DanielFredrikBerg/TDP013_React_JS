# TDP013 HT2021 vikro653 danhu849


## Lab3

#### Instruktioner
1. Starta en mongodb instans med default port: 27017 
2. git clone git@gitlab.liu.se:vikro653/tdp013_gruppc_vikro653_danhu849.git
3. npm install --save-dev mocha nodemon nyc should
4. npm install --save cors express mongodb mongo-sanitize superagent
5. Starta en terminal och cd:a till tdp013_gruppc_vikro653_danhu849/lab2 och starta node.js servern med: _npm run start_
6. Öppna http://localhost:3000 i en webbrowser. Du borde se en tom inputruta längst upp till vänster. Under rutan finns en knapp det står "Send" på.
7. Fyll i valfri text i rutan och klicka på "Send" eller tryck enter för att lagra meddelandet i databasen.
8. Gå till http://localhost:3000/getall för att se alla meddelanden.
9. Testa enligt specifikation 2.

#### Tester
1. Starta en mongodb instans med default port: 27017 
2. Se till att node.js servern som startades under Instruktioner är stoppad.
3. Öppna en till terminal, cd:a till tdp013_gruppc_vikro653_danhu849/lab2 och kör testerna med: _npm run test_

#### Reflektionsfrågor

- **Beskriv strukturen och flödet i er applikation och demonstrera att det fungerar.**


- **Hur fungerar CORS?**

CORS blockerar HTTP-request som inte kommer från en viss origin, http://localhost:3000 i detta fallet.

- **Hur testas CORS?**

Om man undersöker via Inspect->Network->XHR i en webbläsare kan man under Sec-Fetch-Mode och Sec-Fetch-Site se att Cors är aktiverat.

- **Hur förhindrar ni att hela sidan laddas om när något ändras?**

Uppdateringen av HTML-dokumentet som sker när ett meddellande skapas/flaggas sker på klientes sida, vilket gör att sidan inte behöver laddas om. På server-sidan uppdateras endast databasen.

- **Vad använder ni som ID:n för meddelanden? Hur ser ni till att alla meddelanden har ett unikt ID?**

Vi använder Date.now() som ger passerad tid sedan 1970 i millisekunder, och hoppas på att två användare inte lyckas skapa ett nytt meddellande samma millisekund. 

- **Hur skyddar ni er mot injections?**

Med mongo-sanetize, som tar bort potentiellt skadliga kombinationer av tecken från inputs till databasen.
