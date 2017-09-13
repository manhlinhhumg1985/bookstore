const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
module.exports.login = function (app) {
    app.use(session({
        cookie: {maxAge: (3600 * 1000)},
        unser: 'destroy',
        secret: 'JackCodeHammer',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }))
    app.use(passport.initialize());
    app.use(flash());
    app.use(passport.session());
    require('../passport/passport')(passport)
    require('../passport/local/local')(passport)
    app.use((req, res, next) => {
        if (req.isAuthenticated()) {
            req.session.login = true;
            req.session.user = req.user;
        } else {
            req.session.login = false;
            req.session.user = {};
        }
        next();
    });
    app.get('/login', (req, res) => {
        let message = '';
        if (req.session.flash) {
            message = req.session.flash.error.length > 0 ? req.session.flash.error[0] : '';
        }
        req.session.flash = '';
        res.render('login', {
            message: message
        })
    });
    app.get('/logout',function (req,res) {
        req.logout();
        res.redirect('/')
    })

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
}