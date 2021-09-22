const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();

router.use(express.json()); 

router.post('/save', function(req, res) {
    console.log(req.body)
    if(req.body.msg.length < 1 || req.body.msg.length > 140){
        res.status(400).send("Invalid length of message error");
    } else { 
        handlers.saveMessage(sanitize(req.body)).then(function(result) {
            res.status(200).send();
        }).catch(function(err) {
            res.status(500).send("Status Internal Server Error");
        })
    }        
})
router.all('/save', function(req, res) {
    res.status(405).send("Status 405 Method Not Allowed")
})


router.post('/flag', function(req, res) {
    handlers.flagMessage(req.body._id).then(function(result) {
        res.status(200).send()
    }).catch(function(err) {
        res.status(500).send("Status Internal Server Error")
    })
})
router.all('/flag', function(req, res) {
    res.status(405).send("Status 405 Method Not Allowed")
})


router.get('/get', function(req, res) {
    handlers.getMessage(req.query.id).then(function(message) {
        if (message != null) {
            res.send(message)
        }
        else {
            res.status(400).send("Entry Not Found")
        }
    }).catch(function(err) {
        res.status(400).send("Invalid Query Parameters")
    })   
})
router.all('/get', function(req, res) {
    res.status(405).send("Status 405 Method Not Allowed")
})


router.get('/getall', function(req, res) {
    handlers.getAllMessages().then(function(value) {
        res.send(value)
    }).catch(function(err) {
        res.status(500).send("Status Internal Server Error")
    })   
})
router.all('/getall', function(req, res) {
    res.status(405).send("Status 405 Method Not Allowed")
})

router.all('*', function(req, res) {
    res.status(404).send("Status 404 Not Found")
})


module.exports = router

