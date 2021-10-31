const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')

const router = express.Router()
router.use(express.json()); 


router.post('/Login', (req, res) => {
    handlers.login(sanitize(req.body)).then(result => {
        res.send(result);  
    }).catch((err) => res.status(400).send(err.message));
});
  
router.post('/CreateAccount', (req, res) => {
    handlers.createAccount(sanitize(req.body)).then( (result) => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
});

router.post('/AddMessage', (req, res) => {
    handlers.addMessage(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
})

router.post('/GetMessages', (req, res) => {
    handlers.getMessages(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));

})

router.post('/FindUser', (req, res) => {
    handlers.findUser(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
})

router.post('/FindUsers', (req, res) => {
    handlers.findUsers(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
})

router.post('/GetFriendStatus', (req, res) => {
    handlers.getFriendStatus(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
})

router.post('/SetFriendStatus', (req, res) => {
    handlers.setFriendStatus(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
})

router.post('/GetAllFriends', (req, res) => {
    handlers.getAllFriends(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(400).send(err.message));
})

router.post('*', function(req, res) {
    res.status(404).send("Status 404 Not Found")
})


module.exports = router