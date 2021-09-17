const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017";

function saveMessage(message) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("tdp013");
        dbo.collection("messages").insertOne(message, (err, result) => {
            if(err) { throw err; }
            db.close();
        });   
    });
}

function flagMessage(id) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("tdp013");
        dbo.collection("messages").findOne({_id : ObjectId(id)}, (err, result) => {
            if(err) { throw err; }
            flag = true
            if (result.Flag == true) {
                flag = false
            }
            dbo.collection("messages").updateOne({_id : ObjectId(id)}, {$set: {"Flag" : flag }}, (err, result) => {
                db.close();
            }); 
        });   
    });
}

function getMessage(id) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("tdp013");
        dbo.collection("messages").findOne({_id : ObjectId(id)}, (err, result) => {
            if(err) { throw err; }
            db.close();
            return result;
        }); 
    }); 
}



function getAllMessages() {
    MongoClient.connect(url, (err, db) => {
        if(err) { throw err; }
        let dbo = db.db("tdp013");
        dbo.collection("messages").find({}).toArray((err, result) => {
            db.close();
            return result;
        });   
    });
}

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}