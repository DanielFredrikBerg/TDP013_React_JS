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
    const result = await dbo.collection(`${msgData.page}_messages`).insertOne(msgData)
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

async function findUser(user) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("user_accounts").findOne(user)
    db.close()
    return result  
}

async function getFriendStatus(userData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection(`${userData.username}_friends`).findOne({friendname : userData.friendname})
    db.close()
    return result 
}

async function setFriendStatus(userData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const entryExists = await dbo.collection(`${userData.username}_friends`).findOne({friendname : userData.friendname})
    if (entryExists) {
        const result = await dbo.collection(`${userData.username}_friends`).updateOne(
            {friendname : userData.friendname}, {$set: {friendstatus : userData.friendstatus}}
        )
        db.close()
        return result
    } else {
        const result = await dbo.collection(`${userData.username}_friends`).insertOne(
            {friendname : userData.friendname, friendstatus : userData.friendstatus}
        )
        db.close()
        return result
    }
}

async function getAllFriends(userData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection(`${userData.username}_friends`).find({}).toArray()
    db.close()
    return result 
}

module.exports = {login, createAccount, addMessage, getMessages, findUser, getFriendStatus, setFriendStatus, getAllFriends}