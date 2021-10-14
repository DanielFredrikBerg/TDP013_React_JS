const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017"

function checkIfValidMD5Hash(str) {
    const regexExp = /^[a-f0-9]{32}$/gi;
    return regexExp.test(str);
  }

function checkCredentials(credentials) {
    return credentials !== null 
        && JSON.stringify(credentials) !== "{}"
        && Object.keys(credentials).length === 2 
        && credentials.hasOwnProperty('username')
        && JSON.stringify(credentials.username) !== "{}"
        && credentials.hasOwnProperty('md5password')
        && JSON.stringify(credentials.md5password) !== "{}"
        && checkIfValidMD5Hash(credentials.md5password)
}

function checkUserName(username) {
    return username !== null
        && JSON.stringify(username) !== "{}"
        && Object.keys(username).length === 1
        && username.hasOwnProperty('username') 
        && JSON.stringify(username.username) !== "{}"
}

function checkDbEntry(dbEntry) {
    return JSON.stringify(dbEntry) !== "{}"
        && Object.keys(dbEntry).length === 3
        && dbEntry.hasOwnProperty("_id")
        && JSON.stringify(dbEntry._id) !== "{}"
        && dbEntry.hasOwnProperty("username")
        && JSON.stringify(dbEntry.username) !== "{}"
        && dbEntry.hasOwnProperty("md5password")
        && JSON.stringify(dbEntry.md5password) !== "{}"
        && checkIfValidMD5Hash(dbEntry.md5password)
}

function validateMessageForm(msgData) {
    return JSON.stringify(msgData) !== "{}"
        && Object.keys(msgData).length === 3
        && msgData.hasOwnProperty("msg")
        && JSON.stringify(msgData.msg) !== "{}"
        && msgData.msg !== ""
        && msgData.hasOwnProperty("creator")
        && JSON.stringify(msgData.creator) !== "{}"
        && msgData.creator !== ""
        && msgData.hasOwnProperty("page")
        && JSON.stringify(msgData.page) !== "{}"
        && msgData.page !== ""
}

function validateFriendForm(userFriendData) {
    return JSON.stringify(userFriendData) !== "{}"
        && Object.keys(userFriendData).length === 2
        && msgData.hasOwnProperty("username")
        && JSON.stringify(userFriendData.username) !== "{}"
        && userFriendData.hasOwnProperty("friendname")
        && JSON.stringify(userFriendData.friendname) !== "{}"
}

async function login(credentials) {
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
        }).then(result => {
            return result
        }).catch(err => {throw new Error(err)} )
    } else {
        throw new Error("user credentials empty.")
    }
}
    

async function addMessage(msgData) {
    console.log("WHAT", validateMessageForm(msgData))
    if (validateMessageForm(msgData)) {
        const isUser = await findUser({ username: msgData.creator })
        console.log(isUser)
        if(isUser) {
            const db = await MongoClient.connect(url)
            const dbo = db.db("tdp013")
            const result = await dbo.collection(`${msgData.page}_messages`).insertOne(msgData)
            db.close()
            return result
        }
    } else {
        throw new Error("Invalid message form.")
    }
}

async function getMessages(userData) {
    if(checkUserName(userData)) {
        const isUser = await findUser({ username: userData.username })
        if(isUser) {
            const db = await MongoClient.connect(url)
            const dbo = db.db("tdp013")
            const result = await dbo.collection(`${userData.username}_messages`).find({}).toArray()
            db.close()
            return result 
        } else {
            throw new Error("getMessages: User can not be found.")
        }
    }
}

async function findUser(userData) {
    if( checkUserName(userData) ){
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection("user_accounts").findOne( {username : userData.username } )
        db.close()
        if(checkDbEntry(result)){
            return { username: result.username }
        } else { 
            throw new Error("User does not exist.") 
        }
    } else {
        throw new Error("Invalid username in findUser.")
    }
      
}



async function getFriendStatus(userData) {
    console.log(userData)
    //if(validateFriendForm(userData)) {
        const db = await MongoClient.connect(url)
        const dbo = db.db("tdp013")
        const result = await dbo.collection(`${userData.username}_friends`).findOne({friendname : userData.friendname})
        db.close()
        if (result) {
            return result 
        } else {
            return {friendstatus : 0}
        }
    //} 
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