const assert = require('assert')
//const should = require('should')
const superagent = require('superagent');
var app = require('../lib/server')
const handlers = require('../lib/requestHandlers')
const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017";

function insertMessageWithIntKey() {
    const message = {_id : 1, msg : "Hello there!", flag : false}
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013");
            dbo.collection("messages").insertOne(message, function(err, result) {
                db.close()
                resolve()
            })
        })
    })
}

function insertMessageWithObjectIdKey() {
    const message = {_id : "6148c8f8453adf5913618d6e", msg : "ObjectId key here!", flag : false}
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013");
            dbo.collection("messages").insertOne(message, function(err, result) {
                db.close()
                resolve()
            })
        })
    })
}

function insertThreeMessages() {
    const messages = [{_id : 1, msg : "test_msg_1"},{_id : 2, msg : "test_msg_2"},{_id : 3, msg : "test_msg_3"}]
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013");
            dbo.collection("messages").insertMany(messages, function(err, result) {
                db.close()
                resolve()
            })
        })
    })
}

function clearDb() {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, function(err, db) {
            let dbo = db.db("tdp013");
            dbo.collection("messages").deleteMany({}, async function(err, result) {
                db.close()
                resolve()
            })
        })
    })
}


describe('Routes', function() {
    describe('Unsupported url', function() {
        it('Accessing unsupported url should return status code 404', function(done) {
            superagent.get('http://localhost:3000/asdf').end(function(err,res) {
                assert(res.status == 404)
                done()
            })
        })
    })

    describe('/', function() {
        it('Accessing / should return status code 200', function(done) {
            superagent.get('http://localhost:3000/').end(function(err, res) {
                assert(res.status == 200)
                done()
            })
        })
    })
    
    describe('/save', function() {
        before(async function() {
            await clearDb()
        })
        it('Message ok should return status code 200', function(done) {
            const message = {_id : 1, msg : "Hello there!", flag : false}
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 200)
                done()
            })    
        })
        it('Message too long should return status code 400', function(done) {
            const message = {_id : 1, msg : "the incumbent will administer the spending of kindergarden milk money\
            and exercise responsibility for making change he or she will share\
            responsibility for the task of managing the money with the assistant\
            whose skill and expertise shall ensure the successful spending exercise", flag : false}
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 400)
                done()
            })    
        })
        it('Bad input parameter should return status code 400', function(done) {
            const message = {_id : 1, msg : "", flag : false}
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 400)
                done()
            })   
        }) 
        it('Wrong HTTP method should return status code 405', function(done) {
            superagent.get('http://localhost:3000/save').end(function(err, res) {
                assert(res.status == 405)
                done()
            }) 
        })
    }) 

   
    describe('/flag', function() {
        before(async function() {
            await clearDb()
            await insertMessageWithIntKey()
        })
        it('Accessing /flag should return status code 200', function(done) {
            superagent.post('http://localhost:3000/flag').send({_id : 1}).end(function(err, res) {
                assert(res.status == 200)
                done()
            })    
        })
        it('Wrong HTTP method should return status code 405', function(done) {
            superagent.get('http://localhost:3000/flag').end(function(err, res) {
                assert(res.status == 405)
                done()
            }) 
        })
    }) 

    describe('/get', function() {
        before(async function() {
            await clearDb()
            await insertMessageWithIntKey()
            await insertMessageWithObjectIdKey()
        })
        it('Accessing existing message with integer key should return a json object', function(done) {
            superagent.get('http://localhost:3000/get').send("1").end(function(err, res) {
                assert(typeof res.body == typeof {})
                done()
            })    
        })
        it('Accessing existing message with ObjectId key should return a json object', function(done) {
            superagent.get('http://localhost:3000/get').send("6148c8f8453adf5913618d6e").end(function(err, res) {
                assert(typeof res.body == typeof {})
                done()
            })    
        })
        it('Accessing bad id should return status code 400', function(done) {
            superagent.get('http://localhost:3000/get').send("abc").end(function(err, res) {
                assert(res.status == 400)
                done()
            })    
        })
        it('Wrong HTTP method should return status code 405', function(done) {
            superagent.post('http://localhost:3000/get').end(function(err, res) {
                assert(res.status == 405)
                done()
            }) 
        })
    }) 

    describe('/getall', function() {
        before(async function() {
            await clearDb()
            await insertThreeMessages()
        })
        it('Accessing /getall should return all json objects', function(done) {
            superagent.get('http://localhost:3000/getall').end(function(err, res) {
                assert(typeof res.body == typeof {})
                done()
            })   
        })
        it('Wrong HTTP method should return status code 405', function(done) {
            superagent.post('http://localhost:3000/getall').end(function(err, res) {
                assert(res.status == 405)
                done()
            }) 
        })
    })
}) 

describe('Request handlers', function() {
    describe('saveMessage', function() {
        before(async function() {
            await clearDb()
        })
        it('should insert one message', async function() {
            const message = {_id : 1, msg : "Hello there!", flag : false}
            result = await handlers.saveMessage(message)
            assert(result["acknowledged"])
        })
    })
    
    describe('flagMessage', function() {
        before(async function() {
            await clearDb()
            await insertMessageWithIntKey() 
        })
        it('should flag one message', async function() {
           result = await handlers.flagMessage(1)
           assert(result["acknowledged"])
           assert(result["modifiedCount"] == 1)
        })
    }) 

    describe('getMessage', function() {
        before(async function() {
            await clearDb()
            await insertMessageWithIntKey() 
        })
        it('should return one message', async function() {
            message = await handlers.getMessage(1)
            assert(message["_id"] == 1)
            assert(message["msg"] == "Hello there!")
            assert(!message["flag"])
        })
    })

    describe('getAllMessages', function() {
        before(async function() {
            await clearDb()
            await insertThreeMessages()
        })
        it('should return all messages sorted by time posted', async function() {
            messages = await handlers.getAllMessages() 
            assert(messages[0]["_id"] == 1)
            assert(messages[0]["msg"] == "test_msg_1")
            assert(messages[1]["_id"] == 2)
            assert(messages[1]["msg"] == "test_msg_2")
            assert(messages[2]["_id"] == 3)
            assert(messages[2]["msg"] == "test_msg_3") 
        })
        after(async function() {
            await clearDb()
        })
    })
})
