
const handlers = require('./requestHandlers');

module.exports = function(app){

    app.get('/', function(req, res, next) {
        res.send(`<html>
                    <body>
                        <form action='/save' method='post'>
                            <input type='text' name='msg' /><br/>
                            <input type="submit" value="Send">
                        </form>
                    </body>
                  </html>`)
    })

    app.post('/save', function(req, res) {
        handlers.saveMessage(req.body).then(function(result) {
            res.status(200).send()
        }).catch(function(err) {
            res.status(500).send("Status Internal Server Error")
        })
    })
    app.all('/save', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.post('/flag', function(req, res) {
        handlers.flagMessage(req.body.id).then(function(result) {
            res.status(200).send()
        }).catch(function(err) {
            res.status(500).send("Status Internal Server Error")
        })
    })
    app.all('/flag', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.get('/get', function(req, res) {
        handlers.getMessage(req.query.id).then(function(message) {
            res.send(message)
        }).catch(function(err) {
            res.status(500).send("Status Internal Server Error")
        })   
    })
    app.all('/get', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.get('/getall', function(req, res) {
        handlers.getAllMessages().then(function(value) {
            res.send(value)
        }).catch(function(err) {
            res.status(500).send("Status Internal Server Error")
        })   
    })
    app.all('/getall', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })

    app.all('*', function(req, res) {
        res.status(404).send("Status 404 Not Found")
    })

}