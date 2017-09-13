module.exports.search = function (app) {
    const search = require('../models/getData');
    app.get('/search', function (req,res) {
        search.search(req)
            .then(data =>{
                res.render('search',{
                    data:data,
                    id: req.session.user.id,
                    user: req.session.user.user,
                    login: req.session.login
                })
            })
    })
}