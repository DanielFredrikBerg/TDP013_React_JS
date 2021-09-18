const Joi = require('joi');

const schemas = {
    message: Joi.object().keys({
        msg: Joi.string().min(1).max(140).required()
    }),
    getQUERY: Joi.object().keys({
        id: Joi.number().min(1).required() // Komma åt hur många meddelanden som finns i databasen?
    })
};
module.exports = schemas;