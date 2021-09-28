const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');


// server side validation for the user model
const UserValidation = (req, res, next) => {
    const Userschema = Joi.object({
        user: Joi.object({
            name: Joi.string()
                .min(3)
                .max(30)
                .required(),

            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { /*allow: ['com', 'net', 'uk', 'fr', 'br', 'in', 'de', 'it', 'ru', 'es', 'ca', 'jp', 'me', 'nl']*/ } })
                .required(),

            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required(),
        }).required()
    })
    const { error } = Userschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",") //"he user information are not valid" //Use on production
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports = UserValidation;


