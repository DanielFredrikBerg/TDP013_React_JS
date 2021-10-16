const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(require('./route'))

const port = 3000;


const corsOptions = {
    origin: "http://localhost:3000"
}
app.use(cors(corsOptions));

let server
function startServer(quietly = false) {
    server = app.listen(port)
    if (!quietly) {
        console.log("Server started")
    }
}

function stopServer(quietly = false) {
    server.close() 
    if (!quietly) {
        console.log("Server stopped")
    }  
}

module.exports =  {app, startServer, stopServer}