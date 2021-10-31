const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"

function checkIfValidMD5Hash(str) {
    const regexExp = /^[a-f0-9]{32}$/gi;
    return regexExp.test(str);
  }

function checkCredentials(credentials) {
    return typeof credentials === "object" 
        && JSON.stringify(credentials) !== "{}"
        && Object.keys(credentials).length === 2 
        && credentials.hasOwnProperty('username')
        && typeof credentials.username === "string"
        && credentials.username.length > 3
        && credentials.hasOwnProperty('md5password')
        && typeof credentials.md5password === "string"
        && credentials.md5password.length > 3
        && checkIfValidMD5Hash(credentials.md5password)
}

function checkUserName(username) {
    return typeof username === "object"
        && JSON.stringify(username) !== "{}"
        && Object.keys(username).length === 1
        && username.hasOwnProperty('username') 
        && typeof username.username === "string"
        && username.username !== "{}"
}

function checkDbEntry(dbEntry) {
    return typeof dbEntry === "object"
        && JSON.stringify(dbEntry) !== "{}"
        && Object.keys(dbEntry).length === 3
        && dbEntry.hasOwnProperty("_id")
        && dbEntry._id instanceof ObjectId
        && JSON.stringify(dbEntry._id) !== "{}"
        && dbEntry.hasOwnProperty("username")
        && typeof dbEntry.username === "string"
        && dbEntry.username !== "{}"
        && dbEntry.hasOwnProperty("md5password")
        && typeof dbEntry.md5password === "string"
        && dbEntry.md5password !== "{}"
        && checkIfValidMD5Hash(dbEntry.md5password)
}

function validateMessageForm(query) {
    return typeof query === "object"
        && JSON.stringify(query) !== "{}"
        && Object.keys(query).length === 3
        && query.hasOwnProperty("msg")
        && typeof query.msg === "string"
        && query.msg.length > 0
        && query.hasOwnProperty("creator")
        && typeof query.creator === "string"
        && query.creator.length > 0
        && query.hasOwnProperty("page")
        && typeof query.page === "string"
        && query.page.length > 0
}

function validateGetFriendStatusQuery(query) {
    return typeof query === "object"
        && JSON.stringify(query) !== "{}"
        && Object.keys(query).length === 2
        && query.hasOwnProperty("username")
        && typeof query.username === "string"
        && query.username.length > 0
        && query.hasOwnProperty("friendname")
        && typeof query.friendname === "string"
        && query.friendname.length > 0
}

function validateSetFriendStatusQuery(query) {
    return typeof query === "object"
        && JSON.stringify(query) !== "{}"
        && Object.keys(query).length === 3
        && query.hasOwnProperty("username")
        && typeof query.username === "string"
        && query.username.length > 0
        && query.hasOwnProperty("friendname")
        && typeof query.friendname === "string"
        && query.friendname.length > 0
        && query.hasOwnProperty("friendstatus")
        && typeof query.friendstatus === "number"
        && query.friendstatus > -1
        && query.friendstatus < 4
}

function validateSearchQuery(query) {
    return typeof query === "object"
        && JSON.stringify(query) !== "{}"
        && Object.keys(query).length === 1
        && query.hasOwnProperty("username")
        && typeof query.username === "string"
        && query.username.length > 0
}

async function login(credentials) {
    if ( checkCredentials(credentials) )
        {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection("user_accounts").findOne({username: credentials.username, md5password: credentials.md5password})
        db.close()
        if ( result !== null ){
            return result;
        } else {
            throw new Error("User does not exist.")
        }
    } else {
        throw new Error("Invalid input in login.")
    } 
}

async function createAccount(credentials) {
    if ( checkCredentials(credentials) ) {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const isAccount = await dbo.collection("user_accounts").findOne({username: credentials.username, md5password: credentials.md5password})
        if (isAccount !== null ){
            db.close()
            throw new Error("User already exists.")
        } 
        const result = await dbo.collection("user_accounts").insertOne(credentials)
        db.close()
        return result
    } else {
        throw new Error("Invalid input in createAccount.")
    }
}

async function addMessage(msgData) {
    if (validateMessageForm(msgData)) {
        const user = msgData.creator
        const isUser = await findUser({username: user})
        if(isUser) {
            if (msgData.creator !== msgData.page) {
                const friendData = await getFriendStatus({username : msgData.creator, friendname : msgData.page})
                if (friendData.friendstatus != 3) {
                    throw new Error("User does not have permission to post message.")
                }
            }
            const db = await MongoClient.connect(url)
            const dbo = db.db("tdp013")
            const result = await dbo.collection(`${msgData.page}_messages`).insertOne(msgData)
            db.close()
            return result
        } else {
            throw new Error("User does not exist.")
        }
    } else {
        throw new Error("Invalid input in addMessage.")
    }
     
}

async function getMessages(userData) {
    if(checkUserName(userData)) {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection(`${userData.username}_messages`).find().toArray()
        db.close()
        if (result) {
            return result
        } else {
            return []
        }
    } else {
        throw new Error("Invalid input in getMessages.")
    }
}

async function findUser(userData) {
    if( checkUserName(userData) ){
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection("user_accounts").findOne( {username : userData.username } )
        db.close()
        if(result && checkDbEntry(result)){
            return { username: result.username }
        } else { 
            throw new Error("User does not exist.") 
        }
    } else {
        throw new Error("Invalid input in findUser.")
    }   
}

async function findUsers() {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const results = await dbo.collection("user_accounts").find( 
            {},
            { projection: { _id : 0, md5password : 0 } }
            ).toArray()
        db.close()
        for(let i=0; i < results.length; i++){
            if(!checkUserName(results[i])){
                throw new Error("Invalid user entry in db.") 
            }
        }
        if(results.length>0) {
            return { results }
        } else { 
            return [] 
        } 
}

async function getFriendStatus(userData) {
    if(validateGetFriendStatusQuery(userData)) {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection(`${userData.username}_friends`).findOne({friendname : userData.friendname})
        db.close()
        if (result) {
            return result 
        } else {
            return {friendstatus : 0}
        }
    } else {
        throw new Error("Invalid input in getFriendStatus.")
    } 
}

async function setFriendStatus(userData) {
    if(validateSetFriendStatusQuery(userData)){
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
    } else {
        throw new Error("Invalid input in setFriendStatus.")
    }
}

async function getAllFriends(userData) {
    if(checkUserName(userData)) {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection(`${userData.username}_friends`).find({}).toArray()
        db.close()
        if (result) {
            return result 
        } else {
            return []
        }
    } else {
        throw new Error("Invalid input in getAllFriends.")
    }
}

module.exports = {login, createAccount, addMessage, getMessages, findUser, findUsers, getFriendStatus, setFriendStatus, getAllFriends}