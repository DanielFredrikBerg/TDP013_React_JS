const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"

async function login(credentials) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("user_accounts").findOne(credentials)
    db.close()
    return result 
}

async function createAccount(credentials) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("user_accounts").insertOne(credentials)
    db.close()
    return result 
}

async function addMessage(msgData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection(`${msgData.creator}_messages`).insertOne(msgData)
    db.close()
    return result 
}

async function getMessages(userData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection(`${userData.username}_messages`).find({}).toArray()
    db.close()
    return result 
}


module.exports = {login, createAccount, addMessage, getMessages}