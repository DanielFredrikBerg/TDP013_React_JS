const {MongoClient, ObjectId} = require('mongodb');
let url = "mongodb://localhost:27017";

function saveMessage(req, res) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("tdp013");
        dbo.collection("messages").insertOne(req.body, (err, result) => {
            db.close();
            res.status(200).send();
        });   
    });
}

function flagMessage(req, res) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("tdp013");
        dbo.collection("messages").findOne({_id : ObjectId(req.body.id_)}, (err, result) => {
            flag = true
            if (result.Flag == true) {
                flag = false
            }
            dbo.collection("messages").updateOne({_id : ObjectId(req.body.id_)}, {$set: {"Flag" : flag }}, (err, result) => {
                db.close();
                res.status(200).send();
            }); 
        });   
    });
}

function getMessage(req, res) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("tdp013");
        dbo.collection("messages").findOne({_id : ObjectId(req.query.id)}, (err, result) => {
            db.close();
            res.send(result);
        }); 
    }); 
}



function getAllMessages(req, res) {
    MongoClient.connect(url, (err, db) => {
        if(err) { throw err; }
        let dbo = db.db("tdp013");
        dbo.collection("messages").find({}).toArray((err, result) => {
            db.close();
            res.send(result);
        });   
    });
}

module.exports = {saveMessage, flagMessage, getMessage, getAllMessages}