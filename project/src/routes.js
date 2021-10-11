const handlers = require('./requestHandlers');
const express = require('express');
const sanitize = require('mongo-sanitize')


const router = express.Router()
router.use(express.json()); 


router.use('/Login', (req, res) => {
    handlers.login(req.body).then(result => {
        if (result) {
            res.send(result);
        } else {
            res.status(408).send();
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

router.use('/FindUser', (req, res) => {
    handlers.findUser(req.body).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(444).send()
        }
    })
})

router.use('/GetFriendStatus', (req, res) => {
    handlers.getFriendStatus(req.body).then(result => {
        if (result) {
            console.log(result)
            res.send(result)
        } else {
            res.status(444).send()
        }
    })
})

router.use('/SetFriendStatus', (req, res) => {
    handlers.setFriendStatus(req.body).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(456).send()
        }
    })
})

router.use('/GetAllFriends', (req, res) => {
    handlers.getAllFriends(req.body).then(result => {
        if (result) {
            res.send(result)
        } else {
            res.status(478).send()
        }
    })
})

module.exports = router