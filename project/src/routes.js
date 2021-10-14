const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')

const router = express.Router()
router.use(express.json()); 


router.use('/Login', (req, res) => {
    handlers.login(sanitize(req.body)).then(result => {
        res.send(result);  
    }).catch((err) => res.status(409).send(`Invalid username or password, error code: ${err.message}`));
});
  
router.use('/CreateAccount', (req, res) => {
    handlers.createAccount(sanitize(req.body)).then( (result) => {
        res.send(result);
    }).catch((err) => res.status(407).send(err.message));
});

router.use('/AddMessage', (req, res) => {
    handlers.addMessage(sanitize(req.body)).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(407).send()
        }
    })
})

router.use('/GetMessages', (req, res) => {
    handlers.getMessages(sanitize(req.body)).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(407).send()
        }
    })

})

router.use('/FindUser', (req, res) => {
    handlers.findUser(sanitize(req.body)).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(444).send()
        }
    })
})

router.use('/GetFriendStatus', (req, res) => {
    handlers.getFriendStatus(sanitize(req.body)).then(result => {
        if (result) {
            console.log(result)
            res.send(result)
        } else {
            res.status(444).send()
        }
    })
})

router.use('/SetFriendStatus', (req, res) => {
    handlers.setFriendStatus(sanitize(req.body)).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(456).send()
        }
    })
})

router.use('/GetAllFriends', (req, res) => {
    handlers.getAllFriends(sanitize(req.body)).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(478).send()
        }
    })
})

module.exports = router