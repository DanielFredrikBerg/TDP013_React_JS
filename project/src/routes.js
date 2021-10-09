const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')
const router = express.Router()

router.use(express.json()); 

router.use('/Login', (req, res) => {
    handlers.login(req.body).then(result => {
        res.send(result);  
    }).catch(error => {
        console.log(error);
        res.status(404).send({});
    });
});
  
router.use('/CreateAccount', (req, res) => {
    console.log(req.body)
    handlers.createAccount(req.body).then(result => {
        res.send(result);  
    }).catch(error => {
        console.log(error);
        res.status(404).send({});
    });
});

router.use('AddMessage', (req, res) => {
    handlers.addMessage(req.body).then(result => {
        console.log(result)
        if (result) {
            res.send(result)
        } else {
            res.status(404).send({})
        }
    })
})

module.exports = router