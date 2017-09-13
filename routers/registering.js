const bcrypt = require('bcrypt-nodejs');
const {db,} = require('../pgp');
module.exports.register = function (app) {
    app.get('/register', (req, res) => {
        res.render('register')
    })
    app.post('/register', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        bcrypt.hash(password, null, null, function (err, hash) {
            db.none('INSERT INTO ws_userss(type_acount, username, password,count_download) VALUES($1, $2,$3,$4)', [2,username, hash,0])
                .then(() => {
                    res.render('register', {message: 'Đăng ký thành công!'})
                })
                .catch(error => {
                    res.render('register', {message: error.message})
                })
        })
    })
}