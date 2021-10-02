const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"

async function login(credentials) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("user_accounts").findOne(credentials)
    console.log(result)
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

module.exports = {login, createAccount}