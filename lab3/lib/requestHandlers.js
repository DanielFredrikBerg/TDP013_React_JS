const {MongoClient, ObjectId} = require('mongodb');

let url = "mongodb://localhost:27017"

function invalidMessage(message) {
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
    // MongoClient.connect är redan promise, oftast overkill att göra egna Promise structure (går att lägga på then och catch på dessa.) 
    // Kan definiera egna new Errors och rejecta dem 8=====3 de fångas av catch.
    console.log(message)
    if(invalidMessage(message.msg)) { 
        console.log("invalid message!");
        throw new Error("Invalid message");
    } else {
        const connection = MongoClient.connect(url+'/tdp013');
        const result = (await connection).collection("messages").insertOne(message);
        return result['acknowledged'];
    }
}

function flagMessage(id) {
    return new Promise(function(resolve, reject) {
        let flag = true
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013")
            dbo.collection("messages").updateOne({_id : parseInt(id)}, {$set: {flag : !flag}}, function(err, result) {
                if(err) { return reject(err) }
                db.close() 
                resolve(result)
            })
        })
    })

}

function getMessage(id) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013")
            if(typeof id === 'string' && id.length == 24) {//probably ObjectId
                try {
                    var idAccessor = ObjectId(id).valueOf();
                } catch (error) {
                    return reject(error)
                }
            } else if (typeof parseInt(id) == typeof 1) {
                var idAccessor = parseInt(id);
            } else reject(err);
            dbo.collection("messages").findOne({_id : idAccessor}, function(err, result) {
                if(err) { return reject(err) }
                db.close()
                resolve(result)
            })
        })
    })
}

function getAllMessages() {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013");
            dbo.collection("messages").find({}).toArray( function(err, result) {
                if(err) { return reject(err) }
                db.close()
                resolve(result)
            })  
        })

    })

}

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}