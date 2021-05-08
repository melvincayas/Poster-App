const Joi = require('Joi');

module.exports.user = Joi.object({
    username: Joi.string().alphanum().max(20).min(1).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
});

module.exports.post = Joi.object({
    body: Joi.string().min(1).required()
});

module.exports.comment = Joi.object({
    body: Joi.string().min(1).required()
});

module.exports.reply = Joi.object({
    body: Joi.string().min(1).required()
});