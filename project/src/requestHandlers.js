const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017/"

/* async function addUserToDb(username) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("users").insertOne(username)
    return result;
} */

async function login(credentials) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    
    user_exists = await dbo.collection("user_accounts").findOne({
        username: credentials.username,
        password: credentials.password
    })        
    if(user_exists){
        console.log(user_exists)
        db.close()
        return user_exists
    } else {
        console.log(user_exists)
        db.close()
        throw new Error("Invalid username or password! Implement popup here yolo.")
    } 
       
}

async function createAccount(credentials) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const user_exists = await dbo.collection("user_accounts").findOne({ username: credentials.username })
    if(user_exists){
        db.close()
        throw new Error("Username already in use! implement popup here or shit")
    } else {
        const result = await dbo.collection("user_accounts").insertOne(credentials)
        const statusUserAdded = await dbo.collection("usernames").insertOne({username: credentials.username})
        db.close()
        return result 
    }   
}

async function addMessage(msgData) { 
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    console.log(`${msgData.creator}_messages`)
    const result = await dbo.collection(`${msgData.creator}_messages`).insertOne(msgData)
    db.close()
    return result 
}

module.exports = {login, createAccount, addMessage}