const assert = require('assert')
const md5 = require('md5')
const superagent = require('superagent');
const handlers = require('../src/requestHandlers')
const routes = require('../src/routes')
//const server = require('../server')
const {MongoClient} = require('mongodb');
let url = "mongodb://localhost:27017";


async function clearDb() {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013_tests");
    await dbo.dropDatabase()
    db.close()
}

async function addUser(name) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013_tests");
    await dbo.collection("user_accounts").insertOne({username : name, md5password : md5("password")})
    db.close()
}

async function setFriends(user1, user2) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013_tests");
    await dbo.collection(`${user1}_friends`).insertOne({friendname : user2, friendstatus : 3})
    await dbo.collection(`${user2}_friends`).insertOne({friendname : user1, friendstatus : 3})
    db.close()
}

async function addMsg(user, msg) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013_tests");
    await dbo.collection(`${user}_messages`).insertOne({msg : msg, creator : user, page : user})
    db.close()
}

async function getPostsOfUser(userName) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013_tests");
    const result = await dbo.collection("user_accounts").findOne({username: userName } )
    db.close()
    return result
}

describe('Routes', () => {
    afterEach(() => {
        clearDb()
    })

    describe('/Login', () => {

        before(() => {
            addUser("userA")
            addUser("userB")
            addUser("userC")
        })

        it('try valid username / password', (done) => {
            const credentials = { username : "userB", md5password : md5("password")}
            const result = superagent.post('http://localhost:8080/Login').send(credentials)
            assert(result)
            done()
        })

        it('try invalid password', (done) => {
            const credentials = { username : "userB", md5password : md5("invalid_password")}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 409)
                done()
            })
        })

        it('try invalid username', (done) => {
            const credentials = { username : "userAlaskmflskmlkno32i2", md5password : md5("password")}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 409)
                done()
            })
        })

        it('try empty user', (done) => {
            const credentials = {}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 409)
                done()
            })
        })

        it('try empty password with correct user', (done) => {
            const credentials = {username : "userB", md5password : {}}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 409)
                done()
            })
        })

        it('try empty password fields', (done) => {
            const credentials = { username : {}, md5password : {} }
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 409)
                done()
            })
        })

        it('try with nosql injection', (done) => {
            const credentials = { $where: function() { return (this.name == "userB") } } ;
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 409)
                done()
            })
        })

        it('TODO', (done) => {
            done()
        })
    })

   /*  describe('/CreateAccount', () => {

        before( () => {
            addUser("userA")
        })

        it('try valid username / password', (done) => {
            const credentials = { username : "userklasj", md5password : md5("password")}
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 200)
                done()
            })
        })

        it('try already existing user', (done) => {
            addUser("userA") // Vet inte varför den inte lägger till i before ovan..
            
            const credentials = { username : "userA", md5password : md5("password")}
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        it('try empty credentials', (done) => {
            const credentials = {}
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        it('try empty username and empty password', (done) => {
            const credentials = { username: {} , md5password: {} }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        it('try empty password only', (done) => {
            const credentials = { username : "userA", md5password : {} }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        it('try empty username only with correct password', (done) => {
            const credentials = { username: {}, md5password : md5("password") }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        it('try only with correct password', (done) => {
            const credentials = { md5password : md5("password") }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        it('try only with correct username', (done) => {
            const credentials = { username : "userA" }
            superagent.post('http://localhost:8080/CreateAccount').send(credentials).end((err, res) => {
                assert(res.status == 407)
                done()
            })
        })

        
    })

    describe('/AddMessage', () => {

        before( () => {
            //clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    })

    describe('/GetMessages', () => {

        before( () => {
            //clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    }) */

    describe('/FindUser', () => {

        before( () => {
            addUser("UserA")
            addUser("UserB")
            addUser("UserC")
        })

        it('find user by inserting only correct username', (done) => {
            const credentials = { username : "UserB" }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 200)
                done()
            })
        })

        it('try find user vid correct username & password', (done) => {
            const credentials = { username : "userC", md5password : md5("password")}
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 412)
                done()
            })
        })

        it('find user by inserting only empty username', (done) => {
            const credentials = { username : {} }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 412)
                done()
            })
        })

        it('find user by inserting only empty password', (done) => {
            const credentials = { md5password : {} }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 412)
                done()
            })
        })

        it('find user by inserting empty username & empty password', (done) => {
            const credentials = { username: {}, md5password : {} }
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 412)
                done()
            })
        })

        it('find user by inserting empty query', (done) => {
            const credentials = {}
            superagent.post('http://localhost:8080/FindUser').send(credentials).end((err, res) => {
                assert(res.status == 412)
                done()
            })
        })
       
    })

    describe('/GetFriendStatus', () => {

        before( () => {
            clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    })

    describe('/SetFriendStatus', () => {

        before( () => {
            clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    })

    describe('/GetAllFriends', () => {

        before( () => {
            clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    })

})


describe('Handlers', () => {

    describe('login', () => {

        before(async () => {
            await clearDb()
            addUser("UserA")
        })

        it('try valid username / password', async () => {
            const result = await handlers.login({username : "UserA", md5password : md5("password")}, "tdp013_tests")
            assert(result.username === "UserA")
        })

        it('try invalid username / password', async () => {
            try {
                await handlers.login({username : "UserB", md5password : md5("password")}, "tdp013_tests")
            } catch (err) {
                assert(err.message === "User does not exist.")
            }
        })
    })

    describe('createAccount', () => {

        before(() => {
            clearDb()
        })

        it('try creating non-existing account', async () => {
            const result = await handlers.createAccount({username : "UserA", md5password : md5("password")}, "tdp013_tests")
            assert(result['acknowledged'])
        })

        it('try creating already existing account', async () => {
            try {
                await handlers.createAccount({username : "UserA", md5password : md5("password")}, "tdp013_tests")
            } catch (err) {
                assert(err.message === "User already exists.")
            }
        })
    })

    describe('addMessage', () => {

        before(async () => {
            await clearDb()
            addUser("UserA")
            addUser("UserC")
            addUser("UserD")
            setFriends("UserA", "UserC")
        })

        it("try adding a message to existing user's own page", async () => {
            const result = await handlers.addMessage({msg : "message", creator : "UserA", page : "UserA"}, "tdp013_tests")
            assert(result['acknowledged'])
        })

        it('try adding a message to non-existing user', async () => {
            try {
                await handlers.addMessage({msg : "message", creator : "UserB", page : "UserB"}, "tdp013_tests")
            } catch (err) {
                assert(err.message === "User does not exist.")
            }
        })

        it("try adding a message to friend of existing user's page", async () => {
            const result = await handlers.addMessage({msg : "message", creator : "UserA", page : "UserC"}, "tdp013_tests")
            assert(result['acknowledged'])
        })

        it("try adding a message to non-friend of existing user's page", async () => {
            try {
                await handlers.addMessage({msg : "message", creator : "UserA", page : "UserD"}, "tdp013_tests")
            } catch (err) {
                assert(err.message === "User does not have permission to post message.")
            }
        })

    })

    describe('getMessages', () => {

        before( async () => {
            await clearDb()
            await addMsg("UserA", "message")
        })

        it('try getting messages that exist', async () => {
            const result = await handlers.getMessages({username : "UserA"}, "tdp013_tests")
            assert(result[0].msg === "message" && result[0].creator === "UserA")
        })

        it('try getting messages that does not exist', async () => {
            const result = await handlers.getMessages({username : "UserB"}, "tdp013_tests")
            assert(result.length === 0)
        })

    })

    describe('findUser', () => {

        before( async () => {
            await clearDb()
            addUser("UserA")
        })

        it('try to find an user that exist', async () => {
            const result = await handlers.findUser({username : "UserA"}, "tdp013_tests")
            assert(result.username === "UserA")
        })

        it("try to find an user that doesn't exist", async () => {
            try {
                await handlers.findUser({username : "UserA"}, "tdp013_tests")
            } catch (err) {
                assert(err.message === "User does not exist.")
            }
        })
    })

    describe('getFriendStatus', () => {

        before( async () => {
            await clearDb()
            setFriends("UserA", "UserB")
        })


        it('try to get a friend status that exist', async () => {
            const result = await handlers.getFriendStatus({username : "UserA", friendname : "UserB"}, "tdp013_tests")
            assert(result.friendstatus === 3)
        })

        it("try to get a friend status that doesn't exist", async () => {
            const result = await handlers.getFriendStatus({username : "UserA", friendname : "UserC"}, "tdp013_tests")
            assert(result.friendstatus === 0)
        })
    })

    describe('setFriendStatus', () => {

        before( async () => {
            await clearDb()
            setFriends("UserA", "UserB")
        })

        it('try to set a new friend status', async () => {
            const result = await handlers.setFriendStatus({username : "UserA", friendname : "UserC", friendstatus : 3}, "tdp013_tests")
            assert(result['acknowledged'])
        })

        it('try to update a friend status', async () => {
            const result = await handlers.setFriendStatus({username : "UserA", friendname : "UserB", friendstatus : 0}, "tdp013_tests")
            assert(result['acknowledged'])
        })

    })

    describe('getAllFriends', () => {

        before( async () => {
            await clearDb()
            setFriends("UserA", "UserB")
        })

        it('try to get existing frinds', async () => {
            const result = await handlers.getAllFriends({username : "UserA"}, "tdp013_tests")
            assert(result[0].friendname === "UserB" && result[0].friendstatus === 3)
        })

        it('try to get non-existing friends', async () => {
            const result = await handlers.getAllFriends({username : "UserC"}, "tdp013_tests")
            assert(result.length === 0)  
        })
        
    })
}) 


describe('Chat', () => {

})