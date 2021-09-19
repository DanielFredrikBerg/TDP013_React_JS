const Joi = require('joi');
const middleware = function(schema, property) {
    return function(req, res, next) {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        
        if (valid) { next(); }
        else { // måste ändra här om kravspecen ska uppfyllas.
            res.status(400).send("Status 400 Bad Request")
        }
    }
}
module.exports = middleware;