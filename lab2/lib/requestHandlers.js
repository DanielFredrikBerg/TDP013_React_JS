const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017";

function saveMessage(message) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("tdp013");
            dbo.collection("messages").insertOne(message, (err, result) => {
                if(err) { throw err; }
                db.close()
                resolve(result)
            });   
        });
    })
}

function flagMessage(id) {
    return new Promise(function(resolve, reject) {
        let flag = true
        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("tdp013");
            dbo.collection("messages").findOne({_id : parseInt(id)}, (err, result) => {
                if(err) { throw err; }
                db.close();
                flag = !result.flag
            }); 
        });
        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("tdp013");
            dbo.collection("messages").updateOne({_id : parseInt(id)}, {$set: {"flag" : flag}}, (err, result) => {
                if(err) { throw err; }
                db.close();
                resolve(result)
            }); 
        });  
    })

}

function getMessage(id) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("tdp013");
            dbo.collection("messages").findOne({_id : parseInt(id)}, (err, result) => {
                db.close();
                if(err) { throw err; }
                resolve(result)
            }); 
        }); 
    })
}

function getAllMessages() {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("tdp013");
            dbo.collection("messages").find({}).toArray( (err, result) => {
                if(err) { throw err; }
                db.close();
                resolve(result);
            });   
        });

    })

}

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}