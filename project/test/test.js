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

async function addUser() {
    console.log("fdghj")
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    await dbo.collection("user_accounts").insertOne({username : "userA", md5password : md5("password")})
    db.close()
}

describe('Routes', () => {
    afterEach(() => {
        clearDb()
    })

    describe('/Login', () => {

        before(() => {
            addUser()
        })

        it('try valid username / password', (done) => {
            const credentials = { username : "userA", md5password : md5("password")}
            superagent.post('http://localhost:8080/Login').send(credentials).end((err, res) => {
                assert(res.status == 200)
                done()
            })
        })

        it('try invalid username', (done) => {
            done()
        })

        it('try invalid password', (done) => {
            done()
        })
    })

    describe('/CreateAccount', () => {

        before( () => {

        })

        it('try valid username / password', (done) => {
            done()
        })

        it('try invalid username', (done) => {
            done()
        })

        it('try invalid password', (done) => {
            done()
        })
    })

})

/*
describe('Handlers', () => {
    describe(() => {

    })
}) */