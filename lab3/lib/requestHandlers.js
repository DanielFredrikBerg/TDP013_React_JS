const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"


async function saveMessage(message) {
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013")
        dbo.collection("messages").insertOne(message, function(err, result) {
            if(err) { return err }
            db.close()
            return result
        });  
    })
}


async function flagMessage(id) {  
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013")
        dbo.collection("messages").findOne({_id : id}, function(err, result) {
            if(err) { return err }
            let flag = result.flag
            dbo.collection("messages").updateOne({_id : id}, {$set: {flag : !flag}}).then(function(err, result) {
                if(err) { return err }
                return result
            })
            db.close()
        })
    }) 
} 

async function getMessage(id) {
    MongoClient.connect(url).then(function(db){
        let dbo = db.db("tdp013")
        dbo.collection("messages").findOne({_id : id}, function(err, result) {
            if(err) { return err }
            db.close()
            return result
        })
    })
}

async function getAllMessages() {
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013");
        dbo.collection("messages").find({}).toArray( function(err, result) {
            if(err) { return err }
            db.close()
            return result
        }) 
    })
}

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}