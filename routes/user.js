const User = require('../models/user');
const Session = require('../models/session');
const { Validator } = require('node-input-validator');
const crypto = require('crypto');
var uuid = require("uuid");


module.exports = function(app) {

    app.post('/register',  (req, res) => {
        const v = new Validator(req.body, {
            login: 'required',
            password: 'required',
            email: 'required',
        });
        
        v.check().then((matched) => {
            if (!matched) {
                res.status(422).send(v.errors);
            } else {
                const { login, password, email } = v.inputs;

                const cr = hashPassword(password);

                User.create({
                    login,
                    password: cr.hash,
                    salt: cr.salt,
                    email
                }, err => {
                    if (err) {
                        // console.log(err);
                        if (err.code === 11000) {
                            res.status(400);
                            res.json({ message: 'This user already exists.' });
                        } else {
                            res.status(500);
                            res.json({ message: 'Please try again later' });
                        }
                        return;

                    }
                    res.status(200);
                    res.json({ message: 'ok' });
                });
            }
        });
    });

    app.post('/login',  (req, res) => {
        const v = new Validator(req.body, {
            login: 'required',
            password: 'required'
        });
        
        v.check().then(matched => {
            if (!matched) {
                res.status(422).send(v.errors);
            } else {
                const { login, password } = v.inputs;
                
                User.findOne({ login }, { __v: false, _id: false, login: false, email: false, role: false }, (err, user) => {
                    if (err || !user) {
                        res.status(404);
                        res.json({ message: 'User not found' });
                        return;
                    }

                    if (validate(password, user.password, user.salt)) {
                        const sid = uuid.v4();

                        Session.create({
                            sid
                        }, err => {
                            if (err) {
                                res.status(500);
                                res.json({ message: 'Please try again later' });
                                return;
                            }
                            res.status(200);
                            res.json({ sessionid: sid });
                        });
                    } else {
                        res.status(401);
                        res.json({ message: 'Password not valid!' });
                    }
                });
            }
        });
    });

    // Валидация хэша
    const validate = (password, hash, salt) => (hashPassword(password, salt).hash === hash);

    const hashPassword = (password, salt) => {
        // Генерим соль
        if (!salt)
            salt = crypto.randomBytes(Math.ceil(16/2))
            .toString('hex')
            .slice(0,16);

        // Генерим хэш
        const hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        const value = hash.digest('hex');
        return {
            salt: salt,
            hash: value
        };
    };
}