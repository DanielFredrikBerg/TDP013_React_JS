const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"

function checkCredentials(credentials) {
    if(credentials !== null 
        && JSON.stringify(credentials) !== "{}"
        && Object.keys(credentials).length === 2 
        && JSON.stringify(credentials.username) !== "{}"
        && JSON.stringify(credentials.md5password) !== "{}" )
        {
            return true;
        }
    else { return false; }
}

async function login(credentials) {
    //console.log("login", credentials)
    if ( checkCredentials(credentials) )
        {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        await dbo.collection("user_accounts")
        .findOne({username: credentials.username, md5password: credentials.md5password})
        .then((res) => {
            db.close()
            if ( res !== null ){
                return res;
            } else {
                throw new Error("user does not exist.")
            }
        })
    } else {
        throw new Error("login credentials empty.")
    }
}

async function createAccount(credentials) {
    if ( checkCredentials(credentials) )
        {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        await dbo.collection("user_accounts")
        .findOne({username: credentials.username, md5password: credentials.md5password})
        .then((res) => {
            if ( res == null ){
                return;
            } else {
                throw new Error("user already exists.")
            }
        }).then(() => {
            return dbo.collection("user_accounts").insertOne(credentials)
        }).then(result => {console.log(result); return result})
        .catch(err => {throw new Error(err)} )
    } else {
        throw new Error("user credentials empty.")
    }
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

async function findUser(userData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection("user_accounts").findOne( {username : userData.username }  )
    db.close()
    return result  
}



async function getFriendStatus(userData) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013")
    const result = await dbo.collection(`${userData.username}_friends`).findOne({friendname : userData.friendname})
    db.close()
    if (result) {
        return result 
    } else {
        return {friendstatus : 0}
    }
    
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