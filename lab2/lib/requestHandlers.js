const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"


function saveMessage(message) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013")
            dbo.collection("messages").insertOne(message, function(err, result) {
                if(err) { return reject(err) }
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
            } else if (typeof id == typeof 1) {
                var idAccessor = id;
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