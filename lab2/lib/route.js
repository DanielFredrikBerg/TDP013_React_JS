
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
        handlers.saveMessage(req, res);
    })
    app.all('/save', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.post('/flag', function(req, res) {
        req.body.id_ = "6142018f420a40306dcf2447"
        handlers.flagMessage(req, res);
    })
    app.all('/flag', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.get('/get', function(req, res) {
        handlers.getMessage(req, res);
    })
    app.all('/get', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })


    app.get('/getall', function(req, res) {
        handlers.getAllMessages(req, res);
    })
    app.all('/getall', function(req, res) {
        res.status(405).send("Status 405 Method Not Allowed")
    })

    app.all('*', function(req, res) {
        res.status(404).send("Status 404 Not Found")
    })

}