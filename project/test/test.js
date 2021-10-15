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
    await dbo.collection("user_accounts").deleteMany({})
    await dbo.collection("UserA_messages").deleteMany({})
    db.close()
}

async function addUser(name) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013_tests");
    await dbo.collection("user_accounts").insertOne({username : name, md5password : md5("password")})
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

        before(() => {
            clearDb()
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

        before(() => {
            clearDb()
            addUser("UserA")
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

        it("try adding a message to friend of existing user's page", () => {

        })

        it("try adding a message to non-friend of existing user's page", () => {

        })

    })

    describe('getMessages', () => {

    })

    describe('findUser', () => {

    })

    describe('getFriendStatus', () => {

    })

    describe('setFriendStatus', () => {

    })

    describe('getAllFriends', () => {
        
    })
}) 


describe('Chat', () => {

})