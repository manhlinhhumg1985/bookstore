module.exports.detail_book = function (app) {
    const detail = require('../models/getData')
    const home = require('../models/getData')
    app.get('/category/:id',(req,res) => {
        let cat = req.params.id
        detail.category(cat)
            .then(data => {
                res.render('index',{
                    data: data,
                    id: req.session.user.id,
                    user: req.session.user.user,
                    login: req.session.login
                })
            }).catch(err => {
            console.log(err)
        })
    })


    app.get('/:type/:item', (req, res) => {
        const type = req.params.type
        const name_item = req.params.item
        if(type === 'book') {
            let name_field = 'name'
            const file_render = 'detail_book'
            detail.detail(name_field, file_render)
                .then(data => {
                    console.log(data)
                    let result = []
                    for(let item in data.detail) {
                        // Convert name item to compare param item on url
                        const itemConverted = data.detail[item][name_field].replace(/ /g, '-').toLowerCase().replace(/,/g,'').replace('#','-sharp')
                        if(name_item === itemConverted) {

                            result.push(data.detail[item])
                        }
                    }
                    res.render(file_render, {
                        detail: result,
                        data    : data,
                        id: req.session.user.id,
                        user: req.session.user.user,
                        login: req.session.login
                    })
                })
        } else if(type === 'author' ) {
            let name_field = 'author'
            const file_render = 'book'
            detail.detail(name_field, file_render)
                .then(data => {
                    console.log(data)
                    let result = []
                    /*for(let item in data.detail) {
                        // Convert name item to compare param item on url
                        let itemConverted = data.detail[item][name_field].replace(/ /g, '-').toLowerCase()
                        if(name_item === itemConverted) {
                            result.push(data.detail[item])
                        }
                    }*/
                    res.render(file_render, {
                        //detail: result,
                        data: data
                    })
                })
        } else if (type === 'category') {
            let name_field = 'name_category'
            const file_render = 'book'
            detail.detail(name_field, file_render)
                .then(data => {
                    let result = []
                    /*for(let item in data.detail) {
                        // Convert name item to compare param item on url
                        let itemConverted = data.detail[item][name_field].replace(/ /g, '-').toLowerCase()
                        if(name_item === itemConverted) {
                            result.push(data.detail[item])
                        }
                    }*/
                    res.render(file_render, {
                        //detail: result,
                        data: data
                    })
                })
        }
    })
}