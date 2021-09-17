
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
        try {
            handlers.saveMessage(req.body);
            res.status(200).send()
        } catch {
            res.status(500).send("Status Internal Server Error")
        }
        
    })
    app.all('/save', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.post('/flag', function(req, res) {
        try {
            req.body.id_ = "6142018f420a40306dcf2447"
            handlers.flagMessage(req.body.id_);
            res.status(200).send();
        } catch {
            res.status(500).send("Status Internal Server Error")
        }

    })
    app.all('/flag', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.get('/get', function(req, res) {
        try {
            message = handlers.getMessage(req.body.id_);
            res.send(message)
        } catch {
            res.status(500).send("Status Internal Server Error")
        }
        
    })
    app.all('/get', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.get('/getall', function(req, res) {
        try {
            messages = handlers.getAllMessages();
            res.send(messages)
        } catch {
            res.status(500).send("Status Internal Server Error")
        }

        
    })
    app.all('/getall', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })

    app.all('*', function(req, res) {
        res.status(404).send("Status 404 Not Found")
    })

}