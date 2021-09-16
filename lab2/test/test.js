const assert = require('assert')
//const should = require('should')
const superagent = require('superagent');
var server = require('../lib/server')
const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017";


describe('backend', function() {

    afterEach(function(done) {
        MongoClient.connect(url, function(err, db) {
            var dbo = db.db("tdp013");
            dbo.collection("messages").deleteMany({}, function(err, result) {
                db.close()
                done()
            })
        })
    })
    
    describe('saveMessage', function() {
        message = {_id : 1, msg : "Hello there!", flag : false}
        it("should save one message in the db and return status code 200", function(done) {
            superagent.post('http://localhost:3000/save').set('accept', 'json').send(message).end(function(err, res) {
                assert(res.status == 200)
                MongoClient.connect(url, function(err, db) {
                        
                })
                done()
            })    
        })
    }) 

    describe('getAllMessages', function() {

        before(async function() {
            messages = [{_id : 1, msg : "test_msg_1"},{_id : 2, msg : "test_msg_2"},{_id : 3, msg : "test_msg_3"}]
            MongoClient.connect(url, function(err, db) {
                var dbo = db.db("tdp013");
                dbo.collection("messages").insertMany(messages, function(err, result) {
                    db.close()
                })
            })
        })

        it("should return all messages sorted by time posted", function(done) {
            superagent.get('http://localhost:3000/getall').set('accept', 'json').end(function(err, res) {
                assert(res.body[0]["_id"] == 1)
                assert(res.body[0]["msg"] == "test_msg_1")
                assert(res.body[1]["_id"] == 2)
                assert(res.body[1]["msg"] == "test_msg_2")
                assert(res.body[2]["_id"] == 3)
                assert(res.body[2]["msg"] == "test_msg_3")
                done()
            })
    
        })
    })
    

})

