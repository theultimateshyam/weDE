const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

UsersSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.PRIVATE_KEY);
    return token;
};


function validateUser(user) {

    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(50)
            .required(),

        email: Joi.string().email({ tlds: { allow: ['com', 'net', 'in'] } }),
        password: Joi.string(),
    });
    return schema.validate(user);
}

const User = mongoose.model('user', UsersSchema);
module.exports = { User, validateUser };
