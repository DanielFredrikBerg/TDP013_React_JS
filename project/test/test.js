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
    const dbo = db.db("tdp013");
    await dbo.collection("user_accounts").deleteMany({})
    db.close()
}

async function addUser(name) {
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.collection("user_accounts").insertOne({username : name, md5password : md5("password")})
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
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 200)
                done()
            })
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

    describe('/CreateAccount', () => {

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
                console.log(res.status)
                done()
            })
        })

        
    })

    describe('/AddMessage', () => {

        before( () => {
            clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    })

    describe('/GetMessages', () => {

        before( () => {
            clearDb();
        })

        it('try valid username / password', (done) => {
            done()
        })
    })

    describe('/FindUser', () => {

        before( () => {
            clearDb();
        })

        it('try valid username / password', (done) => {
            done()
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

/*
describe('Handlers', () => {
    describe(() => {

    })
}) */