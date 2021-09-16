const http = require('http') 
const url = require('url') 
const should = require('should')
const { MongoClient } = require('mongodb')
let url = "mongodb://localhost:27017/";

http.createServer((request, response) => { 
    response.writeHead(200, {'Content-Type' : 'text/html'}) 
    let urlParts = url.parse(request.url, true) 
    let name = urlParts.query['name'] || 'World' 
    let phone = urlParts.query['phone'] 
    response.write(`<h1>Hello ${name}!</h1>`) 
    if(phone){ 
        response.write(`<p>Is you're phone number ${phone}?</p>`) 
    } 
    response.end() 
}).listen(8888)

MongoClient.connect(url, (err, db) => { 
    if(err) { throw err; } 
    let dbo = db.db("tdp013"); 
    dbo.collection("movie").find({}).toArray((err, result) => { 
        if(err){ throw err; } 
        console.log(result); 
    }); 
    // close connection when done with mongo 
    db.close() 
}); 