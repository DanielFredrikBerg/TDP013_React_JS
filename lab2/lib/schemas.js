const Joi = require('joi');

const schemas = {
    message: Joi.object().keys({
        msg: Joi.string().min(1).max(140).required()
    })
};
module.exports = schemas;