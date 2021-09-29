const assert = require('assert')
const superagent = require('superagent');
var app = require('../lib/server')
const handlers = require('../lib/requestHandlers')
const {MongoClient} = require('mongodb');
let url = "mongodb://localhost:27017";

function insertMessageWithIntKey() {
    const message = {_id : 1, msg : "Hello there!", flag : false}
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013");
        dbo.collection("messages").insertOne(message, function(err, result) {
            db.close()
        })
    })
}

function insertMessageWithObjectIdKey() {
    const message = {_id : "6148c8f8453adf5913618d6e", msg : "ObjectId key here!", flag : false}
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013");
        dbo.collection("messages").insertOne(message, function(err, result){
            db.close()
        })  
    })
}

function insertThreeMessages() {
    const messages = [{_id : 1, msg : "test_msg_1", flag : false},
                      {_id : 2, msg : "test_msg_2", flag : false},
                      {_id : 3, msg : "test_msg_3", flag : false}]
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013");
        dbo.collection("messages").insertMany(messages, function(err, result){
            db.close()
        }) 
    })
}

function clearDb() {
    MongoClient.connect(url).then(function(db) {
        let dbo = db.db("tdp013");
        dbo.collection("messages").deleteMany({}, function(err, result) {
            db.close()
        })
    })
}

describe('Routes', function() {

    beforeEach(function() {
        app.startServer(true)
    })

    afterEach(function() {
        app.stopServer(true)
    })

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
        before(function() {
            clearDb()
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
        before(function() {
            clearDb()
            insertMessageWithIntKey()
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
        before(function() {
            clearDb()
            insertMessageWithIntKey()
            insertMessageWithObjectIdKey()
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
        before(function() {
            clearDb()
            insertThreeMessages()
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
        before(function() {
            clearDb()
        })
        it('should insert one message', function() {
            const message = {_id : 1, msg : "Hello there!", flag : false}
            handlers.saveMessage(message).then(function(result) {
                assert(result["acknowledged"])
            }) 
        })
    })
    
    describe('flagMessage', function() {
        before(function() {
            clearDb()
            insertMessageWithIntKey() 
        })
        it('should flag one message', function() {
           handlers.flagMessage(1).then(function(result) {
            assert(result["acknowledged"])
            assert(result["modifiedCount"] == 1)
           })
        })
    }) 

    describe('getMessage', function() {
        before(function() {
            clearDb()
            insertMessageWithIntKey() 
        })
        it('should return one message', function() {
            handlers.getMessage(1).then(function(message) {
                assert(message["_id"] == 1)
                assert(message["msg"] == "Hello there!")
                assert(!message["flag"])
            })
        })
    })

    describe('getAllMessages', function() {
        before(async function() {
            clearDb()
            insertThreeMessages()
        })
        it('should return all messages sorted by time posted', function() {
            handlers.getAllMessages().then(function(messages){
                assert(messages[0]["_id"] == 1)
                assert(messages[0]["msg"] == "test_msg_1")
                assert(messages[1]["_id"] == 2)
                assert(messages[1]["msg"] == "test_msg_2")
                assert(messages[2]["_id"] == 3)
                assert(messages[2]["msg"] == "test_msg_3")   
            }) 
        })
    })
})
