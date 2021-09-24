const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"

function validateMessage(message) {
    return new Promise(function(resolve, reject) {
        // Guard statement
        if (message == null){
            reject(new Error("Message does not exist."));
        } else resolve(message);
    }).then(nonNullMessage => {
        // Check correct message length
        if (nonNullMessage.length < 1 || nonNullMessage > 140){
            reject(new Error("Message not correct length."))
        } else resolve(nonNullMessage);
    }).then(correctMessage => {
        console.log(`Message checked successfully: ${correctMessage}, lenght: ${correctMessage.length}`)
        resolve(true);
    }).catch(error => {
        console.log(error)
        return false;
    });
}

function saveMessage(message) {
    return new Promise(function(resolve, reject) {
        // MongoClient.connect är redan promise, oftast overkill att göra egna Promise structure (går att lägga på then och catch på dessa.) 
        // Kan definiera egna new Errors och rejecta dem => de fångas av catch.
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013")
            dbo.collection("messages").insertOne(message, function(err, result) {
                if(err) { reject(err) }
                db.close()
                resolve(result)
            });  
        })
    })
}

function flagMessage(id) {
    return new Promise(function(resolve, reject) {
        let flag = true
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013")
            dbo.collection("messages").findOne({_id : parseInt(id)}, (err, result) => {
                if(err) { return reject(err) }
                flag = !result.flag
            })
            dbo.collection("messages").updateOne({_id : parseInt(id)}, {$set: {"flag" : flag}}, function(err, result) {
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