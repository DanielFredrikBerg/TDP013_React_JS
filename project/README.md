# TDP013 HT2021 vikro653 danhu849

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Projekt - En social webbplats

Nedan finns instruktioner för installation och uppsättning av denna sociala webbplats. Webbplatsen är utvecklad i React och Node.js Express, nyttjar Mongodb för lagring och stödjer chat i realtid mellan användare mha socket.io.

Full funktionalitet har uppnåtts både på Ubuntu 20.04 och Windows 10 Pro.

### Instruktioner för installation och uppstart
1. Starta en mongodb instans med default port: 27017
2. git clone git@gitlab.liu.se:vikro653/tdp013_gruppc_vikro653_danhu849.git
3. Starta en terminal och cd:a till tdp013_gruppc_vikro653_danhu849/project
4. Installera nödvändiga paket med pakethanteraren npm. Paketen som behövs hittas i [package.json](./package.json).
5. Öppna en terminal från tdp013_gruppc_vikro653_danhu849/project och starta node.js servern med: _npm run start_
6. Öppna en terminal från tdp013_gruppc_vikro653_danhu849/project och starta React dev server med: _npm run server_
7. Efter en stund startas en webbläsare och du möts av en inloggningssida.
8. Skriv in användarnamn och lösenord i respektive fält och klicka på Create User.
9. Därefter kan du posta meddelanden på din vägg, leta efter andra användare (du kommer behöva skapa ett par användare först) samt skicka vänförfrågningar till de användare du hittat. 

Sök efter användare i fältet högst upp under "Find User", klicka på Search eller tryck Enter för att söka. Vänförfrågningar besvaras genom att klicka på dropdownlistan Friends högst upp till vänster på sidan.

### Filstruktur
* Katalogen [components/](./src/components/) innehåller komponenterna App, Chat, Dashboard och Login.
* Filen [server.js](./src/server.js) innehåller Node.js och socket.io server.
* Filen [requestHandlers.js](./requestHandlers.js) innehåller funktioner för manipulering av Mongodb databasen.
* Filen [routes.js](./routes.js) är middleware.

Huvudkomponenten för appen är [Dashboard.js](./src/components/Dashboard.js) som innehåller den huvudsakliga funktionaliteten för webbplatsen.

### Tester
[Fil med Tester](./test/test.js)

1. Starta en mongodb instans med default port: 27017
2. Om en node.js är igång stäng av den. Testfilen startar node.js vid behov.
3. Öppna en till terminal, cd:a till tdp013_gruppc_vikro653_danhu849/project och kör testerna med: _npm run test_

 
