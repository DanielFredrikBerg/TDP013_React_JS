const assert = require('assert')
const md5 = require('md5')
const superagent = require('superagent');
const handlers = require('../src/requestHandlers')
const routes = require('../src/routes')
const server = require('../src/server')
const {MongoClient} = require('mongodb');
let url = "mongodb://localhost:27017";


async function clearDb() {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.dropDatabase()
    db.close()
}

async function addUser(name) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.collection("user_accounts").insertOne({username : name, md5password : md5("password")})
    db.close()
}

async function setFriends(user1, user2) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.collection(`${user1}_friends`).insertOne({friendname : user2, friendstatus : 3})
    await dbo.collection(`${user2}_friends`).insertOne({friendname : user1, friendstatus : 3})
    db.close()
}

async function addMsg(user, msg) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.collection(`${user}_messages`).insertOne({msg : msg, creator : user, page : user})
    db.close()
}

async function getPostsOfUser(userName) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    const result = await dbo.collection("user_accounts").findOne({username: userName } )
    db.close()
    return result
}

describe('Routes', () => {

    before(() => { // Behövde ändra från Each för Mocha kastade Errors
        server.startExpressServer(true)
    })

    after(() => { // Behövde ändra från Each för Mocha kastade Errors
        server.stopExpressServer(true)
    })

    describe('try invalid function', () => {
        it('try /asdf', async () => {
            superagent.post('http://localhost:8080/asdf').send({}).end((err, res) => {
                assert(res.status == 404)
            })
        })
    })

    describe('/Login', () => {

        before( async () => {
            await clearDb()
            await addUser("userA")
            await addUser("userB")
            await addUser("userC")
        })

        it('try valid username / password', () => {
            const credentials = { username : "userB", md5password : md5("password")}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 200)
                
            })
        })

        it('try invalid password', () => {
            const credentials = { username : "userB", md5password : md5("invalid_password")}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try invalid username', () => {
            const credentials = { username : "userAlaskmflskmlkno32i2", md5password : md5("password")}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty user', () => {
            const credentials = {}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty password with correct user', () => {
            const credentials = {username : "userB", md5password : {}}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty password fields', () => {
            const credentials = { username : {}, md5password : {} }
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try with nosql injection', () => {
            const credentials = { $where: function() { return (this.name == "userB") } } ;
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('TODO', () => {
 
        })
    })

    
   describe('/CreateAccount', () => {

        before( async () => {
            await clearDb()
            await addUser("userA")
        })

        it('try valid username / password', () => {
            const credentials = { username : "userklasj", md5password : md5("password")}
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 200)
            })
        })

        it('try already existing user', () => {       
            const credentials = { username : "userA", md5password : md5("password")}
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty credentials', () => {
            const credentials = {}
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty username and empty password', () => {
            const credentials = { username: "" , md5password: "" }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty password only', () => {
            const credentials = { username : "userA", md5password : "" }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try empty username only with correct password', () => {
            const credentials = { username: "", md5password : md5("password") }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try only with correct password', () => {
            const credentials = { md5password : md5("password") }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('try only with correct username', () => {
            const credentials = { username : "userA" }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        
    })  

    describe('/FindUser', () => {

        before( async () => {
            await clearDb()
            await addUser("UserA")
            await addUser("UserB")
            await addUser("UserC")
        })

        it('find user by inserting only correct username', () => {
            const credentials = { username : "UserB" }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 200)
            })
        })

        it('try find user vid correct username & password', () => {
            const credentials = { username : "userC", md5password : md5("password")}
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('find user by inserting only empty username', () => {
            const credentials = { username : {} }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('find user by inserting only empty password', () => {
            const credentials = { md5password : {} }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('find user by inserting empty username & empty password', () => {
            const credentials = { username: {}, md5password : {} }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })

        it('find user by inserting empty query', () => {
            const credentials = {}
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 400)
            })
        })
    })

    describe('/FindUsers', () => {
        before( async () => {
            await clearDb()
            await addUser("AABB")
            await addUser("BBCC")
            await addUser("AACC")
        })

        it('find all users by calling route username', () => {
            superagent.post('http://localhost:8080/FindUsers').send().end((err, res) => {
                assert(res.status == 200)
            })
        })     
    })

    describe('/GetFriendStatus', () => {

        before( async () => {
            await clearDb()
            await setFriends("User1", "User2")
        })

        it('try to get a friend status that exist', async () => {
            const userData = {username : "User1", friendname : "User2"}
            superagent.post('http://localhost:8080/GetFriendStatus').send(userData).end((err, res) => {
                assert(res.status == 200)
            })
        })

        it("try to get a friend status that doesn't exist", async () => {
            const userData = {username : "User1", friendname : "User3"}
            superagent.post('http://localhost:8080/GetFriendStatus').send(userData).end((err, res) => {
                assert(res.status == 200)
            })
        })
    })

    describe('/SetFriendStatus', () => {

        before( async () => {
            await clearDb();
            await setFriends("User1", "User2")
        })

        it('try to set a new friend status', async () => {
            const userData = {username : "User1", friendname : "User3", friendstatus : 2}
            superagent.post('http://localhost:8080/SetFriendStatus').send(userData).end((err, res) => {
                assert(res.status == 200)
            })
        })

        it('try to update a friend status', async () => {
            const userData ={username : "User1", friendname : "User2", friendstatus : 1}
            superagent.post('http://localhost:8080/SetFriendStatus').send(userData).end((err, res) => {
                assert(res.status == 200)
            })
        })
    })

    describe('/GetAllFriends', () => {

        before( async () => {
            await clearDb()
            await setFriends("User1", "User2")
        })

        it('try to get existing frinds', async () => {
            const userData = {username : "User1"}
            superagent.post('http://localhost:8080/GetAllFriends').send(userData).end((err, res) => {
                assert(res.status == 200)
            })
        })

        it('try to get non-existing friends', async () => {
            const userData = {username : "User3"}
            superagent.post('http://localhost:8080/GetAllFriends').send(userData).end((err, res) => {
                assert(res.status == 200)
            })
        })
    })

})


describe('Handlers', () => {

    describe('login', () => {

        before(async () => {
            await clearDb()
            await addUser("UserA")
        })

        it('try valid username / password', async () => {
            const userData = {username : "UserA", md5password : md5("password")}
            const result = await handlers.login(userData)
            assert(result.username === "UserA")
        })

        it('try invalid username / password', async () => {
            try {
                const userData = {username : "UserB", md5password : md5("password")}
                await handlers.login(userData)
            } catch (err) {
                assert(err.message === "User does not exist.")
            }
        })
    })

    describe('createAccount', () => {

        before( async () => {
            await clearDb()
        })

        it('try creating non-existing account', async () => {
            const userData = {username : "UserA", md5password : md5("password")}
            const result = await handlers.createAccount(userData)
            assert(result['acknowledged'])
        })

        it('try creating already existing account', async () => {
            try {
                const userData = {username : "UserA", md5password : md5("password")}
                await handlers.createAccount(userData)
            } catch (err) {
                assert(err.message === "User already exists.")
            }
        })
    })

    describe('addMessage', () => {

        before(async () => {
            await clearDb()
            await addUser("UserA")
            await addUser("UserC")
            await addUser("UserD")
            await setFriends("UserA", "UserC")
        })

        it("try adding a message to existing user's own page", async () => {
            const msgData = {msg : "message", creator : "UserA", page : "UserA"}
            const result = await handlers.addMessage(msgData)
            assert(result['acknowledged'])
        })

        it('try adding a message to non-existing user', async () => {
            try {
                const msgData = {msg : "message", creator : "UserB", page : "UserB"}
                await handlers.addMessage(msgData)
            } catch (err) {
                assert(err.message === "User does not exist.")
            }
        })

        it("try adding a message to friend of existing user's page", async () => {
            const msgData = {msg : "message", creator : "UserA", page : "UserC"}
            const result = await handlers.addMessage(msgData)
            assert(result['acknowledged'])
        })

        it("try adding a message to non-friend of existing user's page", async () => {
            try {
                const msgData = {msg : "message", creator : "UserA", page : "UserD"}
                await handlers.addMessage(msgData)
            } catch (err) {
                assert(err.message === "User does not have permission to post message.")
            }
        })

        it("try adding a message with invalid message input data", async () => {
            try {
                const msgData = {msg : "message"}
                await handlers.addMessage(msgData)
            } catch (err) {
                assert(err.message === "Invalid input in addMessage.")
            }
        })

    })

    describe('getMessages', () => {

        before( async () => {
            await clearDb()
            await addMsg("UserA", "message")
        })

        it('try getting messages that exist', async () => {
            const userData = {username : "UserA"}
            const result = await handlers.getMessages(userData)
            assert(result[0].msg === "message" && result[0].creator === "UserA")
        })

        it('try getting messages that does not exist', async () => {
            const userData = {username : "UserB"}
            const result = await handlers.getMessages(userData)
            assert(result.length === 0)
        })

        it('try invalid input in getMessages', async () => {
            const userData = {}
            try {
                await handlers.getMessages(userData)
                
            } catch(err) {
                assert(err.message === "Invalid input in getMessages.")
            }
        })
    })

    describe('findUsers', () => {

        before( async () => {
            await clearDb()
            await addUser("UserA")
            await addUser("UserB")
            await addUser("UserC")
            await addUser("UserAa")
        })

        it('try to get all usernames in db', async () => {
            const usersInDb = await handlers.findUsers()
            assert(usersInDb.results !== {})
            assert(usersInDb.results.length === 4)
            assert(usersInDb.results !== null)
        })

        it("try to get empty array from empty db", async () => {
            await clearDb()
            const usersInDb = await handlers.findUsers()
            assert(usersInDb.length === 0)
        })      
    })
    
    describe('getFriendStatus', () => {

        before( async () => {
            await clearDb()
            await setFriends("UserA", "UserB")
        })


        it('try to get a friend status that exist', async () => {
            const userData = {username : "UserA", friendname : "UserB"}
            const result = await handlers.getFriendStatus(userData)
            assert(result.friendstatus === 3)
        })

        it("try to get a friend status that doesn't exist", async () => {
            const userData = {username : "UserA", friendname : "UserC"}
            const result = await handlers.getFriendStatus(userData)
            assert(result.friendstatus === 0)
        })

        it("try invalid input", async () => {
            const userData = {}
            try {
                await handlers.getFriendStatus(userData)
            } catch (err) {
                assert(err.message === "Invalid input in getFriendStatus.")
            }  
        })
    })

    describe('setFriendStatus', () => {

        before( async () => {
            await clearDb()
            await setFriends("UserA", "UserB")
        })

        it('try to set a new friend status', async () => {
            const userData = {username : "UserA", friendname : "UserC", friendstatus : 3}
            const result = await handlers.setFriendStatus(userData)
            assert(result['acknowledged'])
        })

        it('try to update a friend status', async () => {
            const userData = {username : "UserA", friendname : "UserB", friendstatus : 0}
            const result = await handlers.setFriendStatus(userData)
            assert(result['acknowledged'])
        })

        it("try invalid input", async () => {
            const userData = {}
            try {
                await handlers.setFriendStatus(userData)
            } catch (err) {
                assert(err.message === "Invalid input in setFriendStatus.")
            }  
        })

    })

    describe('getAllFriends', () => {

        before( async () => {
            await clearDb()
            await setFriends("UserA", "UserB")
        })

        it('try to get existing frinds', async () => {
            const userData = {username : "UserA"}
            const result = await handlers.getAllFriends(userData)
            assert(result[0].friendname === "UserB" && result[0].friendstatus === 3)
        })

        it('try to get non-existing friends', async () => {
            const userData = {username : "UserC"}
            const result = await handlers.getAllFriends(userData)
            assert(result.length === 0)  
        })
        
        it("try invalid input", async () => {
            const userData = {}
            try {
                await handlers.getAllFriends(userData)
            } catch (err) {
                assert(err.message === "Invalid input in getAllFriends.")
            }  
        })
    })
}) 

