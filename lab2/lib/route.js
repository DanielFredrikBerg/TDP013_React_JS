
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
                  </html>`);
    });

    app.post('/save', function(req, res) {
        handlers.saveMessage(req, res);
    });


    app.get('/flag', function(req, res) {
        req.body.id_ = "6142018f420a40306dcf2447"
        handlers.flagMessage(req, res);
    });

    app.get('/get', function(req, res) {
        handlers.getMessage(req, res);
    });

    app.get('/getall', function(req, res) {
        handlers.getAllMessages(req, res);
    });

}