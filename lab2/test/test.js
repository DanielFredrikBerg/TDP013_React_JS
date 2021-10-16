const assert = require('assert')
const superagent = require('superagent');
var app = require('../lib/server')
const handlers = require('../lib/requestHandlers')
const {MongoClient} = require('mongodb');
let url = "mongodb://localhost:27017";

async function insertMessage() {
    const message = {msg : "Hello there!", flag : false}
    const db = await MongoClient.connect(url)
    const dbo = db.db("tdp013");
    const result = await dbo.collection("messages").insertOne(message)
    db.close()
    return result
}

async function insertThreeMessages() {
    const messages = [{msg : "test_msg_1", flag : false},
                      {msg : "test_msg_2", flag : false},
                      {msg : "test_msg_3", flag : false}]
    const db = await MongoClient.connect(url)
    let dbo = db.db("tdp013");
    await dbo.collection("messages").insertMany(messages)
    db.close()
}

async function clearDb() {
    const db = await MongoClient.connect(url)
    let dbo = db.db("tdp013");
    await dbo.collection("messages").deleteMany({})
    db.close()
}

describe('Routes', function() {

    before(function() {
        app.startServer(true)
    })

    after(function() {
        app.stopServer(true)
    })

    describe('Unsupported url', function() {
        it('Accessing unsupported url should return status code 404', function() {
            superagent.get('http://localhost:3000/asdf').end(function(err,res) {
                assert(res.status == 404)
                
            })
        })
    })

    describe('/', function() {
        it('Accessing / should return status code 200', function() {
            superagent.get('http://localhost:3000/').end(function(err, res) {
                assert(res.status == 200)
                
            })
        })
    })
    
    describe('/save', function() {
        before(async function() {
            await clearDb()
        })
        it('Message ok should return status code 200', function() {
            const message = {msg : "Hello there!", flag : false}
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 200)
                
            })    
        })
        it('Message too long should return status code 400', function() {
            const message = {msg : "the incumbent will administer the spending of kindergarden milk money\
            and exercise responsibility for making change he or she will share\
            responsibility for the task of managing the money with the assistant\
            whose skill and expertise shall ensure the successful spending exercise", flag : false}
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 400)
                
            })    
        })
        it('Bad input parameter should return status code 400', function() {
            const message = {msg : "", flag : false}
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 400)
                
            })   
        }) 
        it('Wrong HTTP method should return status code 405', function() {
            superagent.get('http://localhost:3000/save').end(function(err, res) {
                assert(res.status == 405)
                
            }) 
        })
    }) 

    describe('/flag', function() {
        before(async function() {
            await clearDb()
        })
        it('Accessing /flag should return status code 200', async function() {
            let insert = await insertMessage()
            superagent.post('http://localhost:3000/flag').send({_id : insert.insertedId}).end(function(err, res) {
                assert(res.status == 200)
            })    
        })
        it('Wrong HTTP method should return status code 405', function() {
            superagent.get('http://localhost:3000/flag').end(function(err, res) {
                assert(res.status == 405)
            }) 
        })
    }) 

    describe('/get', function() {
        before(async function() {
            await clearDb()
            await insertMessage()
        })
        it('Accessing existing message should return a json object', function() {
            superagent.get('http://localhost:3000/get').send("1").end(function(err, res) {
                assert(typeof res.body == typeof {})
            })    
        })
        it('Accessing bad id should return status code 400', function() {
            superagent.get('http://localhost:3000/get').send("abc").end(function(err, res) {
                assert(res.status == 400)
            })    
        })
        it('Wrong HTTP method should return status code 405', function() {
            superagent.post('http://localhost:3000/get').end(function(err, res) {
                assert(res.status == 405)
                
            }) 
        })
    }) 

    describe('/getall', function() {
        before(async function() {
            await clearDb()
            await insertThreeMessages()
        })
        it('Accessing /getall should return all json objects', function() {
            superagent.get('http://localhost:3000/getall').end(function(err, res) {
                assert(typeof res.body == typeof {})
                
            })   
        })
        it('Wrong HTTP method should return status code 405', function() {
            superagent.post('http://localhost:3000/getall').end(function(err, res) {
                assert(res.status == 405)
                
            }) 
        })
    })
}) 

describe('Request handlers', function() {
    describe('saveMessage', function() {
        before(async function() {
            await clearDb()
        })
        it('should insert one message', function() {
            const message = {msg : "Hello there!", flag : false}
            handlers.saveMessage(message).then(function(result) {
                assert(result["acknowledged"])
            }) 
        })
    })
    
    describe('flagMessage', function() {
        before(async function() {
            await clearDb()
            await insertMessage() 
        })
        it('should flag one message', function() {
           handlers.flagMessage(1).then(function(result) {
            assert(result["acknowledged"])
            assert(result["modifiedCount"] == 1)
           })
        })
    }) 

    describe('getMessage', function() {
        before(async function() {
            await clearDb()
            await insertMessage() 
        })
        it('should return one message', async function() {
            handlers.getMessage(1).then(function(message) {
                assert(message["msg"] == "Hello there!")
                assert(!message["flag"])
            })
        })
    })

    describe('getAllMessages', function() {
        before(async function() {
            await clearDb()
            await insertThreeMessages()
        })
        it('should return all messages sorted by time posted', function() {
            handlers.getAllMessages().then(function(messages){
                assert(messages[0]["msg"] == "test_msg_1")
                assert(messages[1]["msg"] == "test_msg_2")
                assert(messages[2]["msg"] == "test_msg_3")   
            }) 
        })
    })
})
