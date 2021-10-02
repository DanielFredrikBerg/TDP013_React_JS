const { MongoClient } = require('mongodb'); 
let url = "mongodb://localhost:27017/"; 

MongoClient.connect(url, (err, db) => { 
    if(err) { throw err; } 
    let dbo = db.db("tdp013"); 
    dbo.collection("user_accounts").find({}).toArray((err, result) => { 
        if(err){ throw err; } 
        console.log(result); 
        db.close() 
    }); 
    // close connection when done with mongo 
    console.log("asd")
    
});