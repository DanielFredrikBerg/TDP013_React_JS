const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')
const router = express.Router()

router.use(express.json()); 

router.use('/Login', (req, res) => {
    handlers.login(req.body).then(result => {
        console.log(result)
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({});
        }  
    });
});
  
router.use('/CreateAccount', (req, res) => {
    handlers.createAccount(req.body).then(result => {
        //console.log(result)
    })
});

module.exports = router