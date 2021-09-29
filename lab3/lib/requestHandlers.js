const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"


async function saveMessage(message) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("messages").insertOne(message)
    db.close()
    return result 
}

async function flagMessage(id) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const flag = (await dbo.collection("messages").findOne({_id : id}))["flag"]
    const result = await dbo.collection("messages").updateOne({_id : id}, {$set: {flag : !flag}})
    db.close()
    return result 
}

async function getMessage(id) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("messages").findOne({_id : id}) 
    db.close()
    return result 
} 

async function getAllMessages() {
    const db = await MongoClient.connect(url)
    let dbo = db.db("tdp013");
    const result = await dbo.collection("messages").find({}).toArray()
    db.close()
    return result
} 

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}