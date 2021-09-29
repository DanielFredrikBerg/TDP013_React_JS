const {MongoClient, ObjectId} = require('mongodb');

let url = "mongodb://localhost:27017"

async function invalidMessage(message) {
    // Guard statement
    if ( message == null 
        || message.length < 1
        || message.length > 140 ) {
        return true;
    } else {
        return false;
    }
}

async function saveMessage(message) {
    const isInvalid = await invalidMessage(message.msg)
    if(isInvalid){
        throw new Error("Invalid Message!")
    } else {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013")
            dbo.collection("messages").insertOne(message, function(err, result) {
                if(err) { reject(err) }
                db.close()
                return result
            });
        })
    }
}

async function flagMessage(id) {
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013")
        dbo.collection("messages").updateOne(
            {_id : id}, 
            [
                { $set: { flag : { "$eq" : [false, "$flag"] } } }
            ]
        , function(err, result) {
            if(err) { return err }
            db.close()
            return result
        })
    }) 
}

async function getMessage(id) {
    MongoClient.connect(url, function(err, db) {
        let dbo = db.db("tdp013")
        dbo.collection("messages").findOne({_id : id}, function(err, result) {
            if(err) { throw new Error("Can not getMessage") }
            db.close()
            return result
        })
    })  
}

async function getAllMessages() {
    MongoClient.connect(url, function(err, db) {
        let dbo = db.db("tdp013");
        dbo.collection("messages").find({}).toArray( function(err, result) {
            if(err) { return new Error("Can not getAllMessages") }
            db.close()
            //console.log(`getAllMessages returns: ${result}`)
            return result
        })  
    })
}

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}