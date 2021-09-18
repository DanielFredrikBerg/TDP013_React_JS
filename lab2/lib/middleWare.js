const Joi = require('joi');
const middleware = function(schema, property) {
    return function(req, res, next) {
        const { error } = schema.validate(req[property]);
        const valid = error == null;
        
        if (valid) { next(); }
        else { // måste ändra här om kravspecen ska uppfyllas.
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            res.status(422).json({ error: message })
        }
    }
}
module.exports = middleware;