# TDP013 HT2021 vikro653 danhu849


## Lab2

#### Instruktioner
1. Starta en mongodb instans med default port: 27017 
2. git clone git@gitlab.liu.se:vikro653/tdp013_gruppc_vikro653_danhu849.git
3. npm install --save-dev mocha nodemon nyc should
4. npm install --save cors express mongodb mongo-sanitize superagent
5. Starta en terminal och cd:a till tdp013_gruppc_vikro653_danhu849/lab2 och starta node.js servern med: npm run start
6. Öppna en till terminal, cd:a till tdp013_gruppc_vikro653_danhu849/lab2 och kör testerna med: npm run test
7. Öppna http://localhost:3000 i en webbrowser. Du borde se en tom inputruta längst upp till vänster. Under rutan finns en knapp det står "Send" på.
8. Fyll i valfri text i rutan och klicka på "Send" eller tryck enter för att lagra meddelandet i databasen.
9. Gå till http://localhost:3000/getall för att se alla meddelanden.
10. Testa enligt specifikation 2.


#### Reflektionsfrågor

**Beskriv strukturen och flödet i er applikation och demonstrera att det fungerar.**

Vi följer specifikation 2 från kurshemsidan.
Alla post & get queries behandlas av funktionerna i route.js. I route.post(/save) på rad 19 används mongo-sanitize för
för att motverka injections. Meddelandet kontrolleras att den är av proper längd. Vid fel returneras olika errorstatusar.
Därefter kallas funktionerna som berör och modifierar databasen. Dessa återfinns i requestHandlers.js och skapar nya Promises
som exekveras asynkront. I de funktioner det behövs kontrolleras indatan och errors skickas med i rejects vid fel.
När databasprocessen är klar returneras det från Promise:n det som söktes eller så returneras ett error. 

**Vad är en callback-funktion och hur använder ni er av dem i koden?**

En callback funktion kan ta en funktion som parameter och kan ge retur i ett senare skede. De är till stor hjälp vid
asynkrona anrop då callback kan göras när den underliggande processen är klar.

Vi använder oss utav callbacks i de flesta funktionsanrop. Asynkrona callbacks i form av Promises används i testerna
samt i de funktioner som accessar mongodb.

**Hur stor nytta hade ni av code-coverage med istanbul?**

Vi har märkt av att istanbul inte alltid skriver ner att vissa funktioner är täckta även om testas bland testerna.
Så länge man vet om det i ett litet projekt lär det vara fine, men i ett större är det mycket svårt att få täckning
för alla funktioner samt svårare att få översikt över sin kodbas.

**Vilka fördelar/nackdelar finns det med att spara data som JSON-objekt jämfört med klassiska tabeller?**

fördelar: 
* I JSON-objekt kan data sparas på många olika sätt. 
* Lättare att hantera föränderliga dataset där uppdatering av datans relationer konstant behöver uppdateras.
        
nackdelar: 
* Har ingen definitiv standard gällande struktureringen av data.
* Relativt ny teknologi jämfört med klassiska tabeller.
