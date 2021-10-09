const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')
const router = express.Router()

router.use(express.json()); 

router.use('/Login', (req, res) => {
    handlers.login(req.body).then(result => {
        if (result) {
            console.log(typeof result)
            res.send(result);
        } else {
            res.status(404).send();
        }  
    });
});
  
router.use('/CreateAccount', (req, res) => {
    handlers.createAccount(req.body).then(result => {
        if (result) {
            res.send(result);
        } else {
            res.status(407).send();
        }  
    })
});

router.use('/AddMessage', (req, res) => {
    handlers.addMessage(req.body).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(407).send()
        }
    })
})

router.use('/GetMessages', (req, res) => {
    handlers.getMessages(req.body).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(407).send()
        }
    })

})

module.exports = router