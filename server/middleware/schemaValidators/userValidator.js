const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.addUser = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .pattern(
                new RegExp(
                    /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
                )
            )
            .min(3)
            .max(30)
            .required(),
        lastName: Joi.string()
            .pattern(
                new RegExp(
                    /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
                )
            )
            .min(3)
            .max(30)
            .required(),
        username: Joi.string()
            .invalid("login", "register", "profile")
            .pattern(
                new RegExp(
                    /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
                )
            )
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .pattern(
                new RegExp(
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                )
            )
            .required(),
        bio: Joi.string().max(250).allow(""),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};

exports.resetPassword = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().min(3).max(30).required(),
        retypepassword: Joi.required().valid(Joi.ref("password")),
        jwt: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};
