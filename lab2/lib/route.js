
const handlers = require('./requestHandlers');
const express = require('express');
const schemas = require('./schemas'); 
const middleware = require('./middleWare'); 
const sanitize = require('mongo-sanitize')
const router = express.Router();

router.use(express.json()); 

router.get('/', function(req, res, next) {
    res.send(`<html>
                <body>
                    <form action='/save' method='post'>
                        <input type='text' name='msg' /><br/>
                        <input type="submit" value="Send">
                    </form>
                </body>
                </html>`)
})

router.post('/save', middleware(schemas.message, 'body'), function(req, res) {
    handlers.saveMessage(sanitize(req.body)).then(function(result) {
        res.status(200).send();
    }).catch(function(err) {
        res.status(500).send("Status Internal Server Error");
    })        
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


router.get('/get', middleware(schemas.getQUERY, 'query'), function(req, res) {
    handlers.getMessage(req.query.id).then(function(message) {
        res.send(message)
    }).catch(function(err) {
        res.status(500).send("Status Internal Server Error")
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

