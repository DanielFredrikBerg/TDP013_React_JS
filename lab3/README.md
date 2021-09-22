KRAV
    Användaren ska kunna använda sidan precis som i labb 1 med skillnaden att meddelandena laddas in från databasen när sidan laddas om.
    När ett meddelandes läggs till ska endast nödvändiga delar av gränssnittet uppdateras.
    När ett meddelandes status ändras ska endast nödvändiga delar av gränssnittet uppdateras.
    Cookies behöver inte användas i labben.
    Meddelanden och deras status som visas för användaren ska reflektera datan som finns i MongoDB. Meddelanden som inte sparats i databasen ska heller inte synas på sidan.
    Klienten ska hantera all kommunikation med servern via AJAX och använda sig av CORS.
    Tester liknande de som implementerades i labb 2 ska även finnas för denna labb. Beskriv även hur ni testar stöd för CORS om ni inte inkluderat det i de automatiska testerna.
    Anrop ska valideras på på klient- och server-sidan.
    Informationen i databasen ska finnas kvar om servern startas om.

Reflektionsfrågor
    Beskriv strukturen och flödet i er applikation och demonstrera att det fungerar.
    Hur fungerar CORS?
    Hur förhindrar ni att hela sidan laddas om när något ändras?
    Vad använder ni som ID:n för meddelanden? Hur ser ni till att alla meddelanden har ett unikt ID?
    Hur skyddar ni er mot injections?

