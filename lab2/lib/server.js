const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const route = require('./route')(app);

const port = 3000;

const corsOptions = {
    origin: "http://localhost:3000"
}
app.use(cors(corsOptions));

function start_server() {
    app.listen(port, function() {
        console.log("Server started")
    })
}


module.exports =  {app, start_server}