const assert = require('assert')
//const should = require('should')
const superagent = require('superagent');
var server = require('../lib/server')
var handlers = require('../lib/requestHandlers')
const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017";

function insertMessage() {
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

function insertInvalidMessage() {
    const message = {_id : 1, msg : "the incumbent will administer the spending of kindergarden milk money \
    and exercise responsibility for making change he or she will share responsibility for the task of managing\
     the money with the assistant whose skill and expertise shall ensure the successful spending exercise . \
    this individual must have the skill to perform a heart transplant and expertise in rocket science"}
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

/*
describe('Routes', function() {
    
    describe('/save', function() {
        before(async function() {
            await clearDb()
        })
        it("Should return status code 200", function(done) {
            superagent.post('http://localhost:3000/save').send(message).end(function(err, res) {
                assert(res.status == 200)
                done()
            })    
        })
    }) 
/*
    describe('/flag', function() {
        before(async function() {
            await clearDb()
            await insertMessage()
        })
        it("Should return status code 200", function(done) {
            superagent.post('http://localhost:3000/flag').send({_id : 1}).end(function(err, res) {
                assert(res.status == 200)
                done()
            })    
        })
    }) 
   
    describe('/get', function() {
        before(async function() {
            await clearDb()
            await insertMessage()
        })
        it("Should return a json object", function(done) {
            superagent.get('http://localhost:3000/get').send("1").end(function(err, res) {
                assert(typeof res.body == typeof message)
                done()
            })    
        })
    }) 
}) */

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
            await insertMessage() 
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
            await insertMessage() 
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
    })
})

