const flash = require('connect-flash')
const session = require('express-session')
var download1 = require('download-pdf')
module.exports.home = function (router) {
    const home = require('../models/getData').home
    const download = require('../models/getData').download
    /**
     *  router home to display page = 1
     */
    router.get('/', (req, res) => {
        home(req)
            .then(data => {
                // res.json(data)
                res.render('index',{
                    data: data,
                    id: req.session.user.id,
                    user: req.session.user.user,
                    login: req.session.login

                })
            })
    })
    /**
     *  router home to display page > 1
     */
    router.get('/page/:page', (req, res) => {
        home(req)
            .then(data => {
                //res.json(data);
                res.render('index',{
                    data: data,
                    id: req.session.user.id,
                    user: req.session.user.user,
                    login: req.session.login
                })
            })
    })
    router.get('/download/:id',(req,res) =>{
        download(req)
            .then(data =>{
                //res.json(data)
                //console.log('linkdownload:',data.data.link_download)
                if(data.check.booklimit - data.check.count_download -1>=0){
                    let url = data.data.link_download
                    var options = {
                        directory:'./images',
                        filename: 'cat.pdf'
                    }
                    download1(url, options, function(err){
                        if (err) throw err
                        else res.render('ok',{
                            data: 'Thanh cong'
                        })
                    })
                }else{
                    res.render('thatbai',{
                        data:'Ban phai nang cap'
                    })
                }



            })
    })
}