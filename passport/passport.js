const {db,} = require('../pgp')
module.exports = function (passport) {
    //Dữ liệu ở serializeUser trả về và lưu vào session.passport
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user)
        done(null, user)
    })

    //Dữ liệu ở deserializeUser trả về và lưu vào req.user
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser', user)
        db.one('SELECT * FROM ws_userss WHERE username = $1', user)
            .then(data => {
                console.log(data)
                //done(null, data.username)
                done(null,{id: data.user_id,user: data.username})
            })
            .catch(err => {
                console.log(err)
            })

    });
}