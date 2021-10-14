const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')

const router = express.Router()
router.use(express.json()); 


router.use('/Login', (req, res) => {
    handlers.login(sanitize(req.body)).then(result => {
        res.send(result);  
    }).catch((err) => res.status(409).send(err.message));
});
  
router.use('/CreateAccount', (req, res) => {
    handlers.createAccount(sanitize(req.body)).then( (result) => {
        res.send(result);
    }).catch((err) => res.status(407).send(err.message));
});

router.use('/AddMessage', (req, res) => {
    handlers.addMessage(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(410).send(err.message));
})

router.use('/GetMessages', (req, res) => {
    handlers.getMessages(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(411).send(err.message));

})

router.use('/FindUser', (req, res) => {
    handlers.findUser(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(412).send(err.message));
})

router.use('/GetFriendStatus', (req, res) => {
    handlers.getFriendStatus(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(444).send(err.message));
})

router.use('/SetFriendStatus', (req, res) => {
    handlers.setFriendStatus(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(454).send(err.message));
})

router.use('/GetAllFriends', (req, res) => {
    handlers.getAllFriends(sanitize(req.body)).then(result => {
        res.send(result);
    }).catch((err) => res.status(478).send(err.message));
})

module.exports = router