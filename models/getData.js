const db = require('./index')
const bcrypt = require('bcrypt-nodejs')

const session = require('express-session');
const pagination = 5;

class GetData {
    constructor(db) {
        this.db = db
    }

    register(req) {
        let username = req.body.username
        let password = req.body.password
        const _compare = 'INSERT INTO ws_userss(type_acount,username,password,count_download) VALUES ($1,$2,$3,$4)'
        return db.task('data', function* (t) {
            const compare_ = t.none(_compare, 2,username, password,0)
            return {
                message: 'Dang ki thanh cong'
            }
        })
    }

    download(req) {
        let id_ = req.params.id
        let user_ = req.session.user.user
        let Userid_ = req.session.user.id
        const _book = 'SELECT name,link_download FROM bookstore WHERE id = $1'
        const _check = 'SELECT username,type_acount,count_download,booklimit FROM ws_userss,cat_account WHERE user_id= $1 and ws_userss.user_id = cat_account.id'
        const user_info = 'SELECT user_id,username,count_download  FROM ws_userss WHERE user_id =$1'
        const _count = 'UPDATE ws_userss SET count_download = count_download+1 WHERE user_id = $1'
        return db.task('data', function* (t) {
            const count = yield  t.none(_count,Userid_)
            const check_ = yield t.one(_check,Userid_)
            const UserInfor_ = yield t.one(user_info, Userid_)
            const result_ = yield t.one(_book, id_)
            return {
                data: result_,
                UserInfor: UserInfor_,
                check: check_
            }
        })

    }

    search(req) {
        let _search = req.query['name']
        const _result = 'SELECT * FROM bookstore WHERE name LIKE  $1'
        const _category = `SELECT c.id, c.name,
                                (array(
                                    SELECT json_build_object('name', c_c.name, 'id', c_c.id) 
                                    FROM category AS c_c
                                    WHERE c_c.parent = c.id)
                                ) AS cat_child
                            FROM category as c
                            WHERE parent = 0`
        const _category_book = 'SELECT * FROM category  WHERE parent = 0'
        return db.task('data', function* (t) {
            const search_ = yield t.any(_result, '%' + _search + '%')
            const category = yield t.any(_category)
            const category_book = yield t.any(_category_book)
            return {
                result: search_,
                category: category,
                category_book: category_book
            }
        })

    }

    home(req) {
        let page_curent = Number(req.params.page)
        let star_row = page_curent
        // return this.getCategory()
        if (req.url === '/') {
            page_curent = 1
            star_row = 1
        }
        const _home = 'SELECT * FROM bookstore limit ${book_limit} offset ${star_row}'
        const _totalpage = 'SELECT COUNT(id) FROM bookstore'
        const _category = `SELECT c.id, c.name,
                                (array(
                                    SELECT json_build_object('name', c_c.name, 'id', c_c.id) 
                                    FROM category AS c_c
                                    WHERE c_c.parent = c.id)
                                ) AS cat_child
                            FROM category as c
                            WHERE parent = 0`
        const _category_book = 'SELECT * FROM category  WHERE parent = 0'
        return db.task('data', function* (t) {
            const book_limit = 5
            star_row = (star_row - 1) * book_limit
            const home = yield t.any(_home, {
                book_limit: book_limit,
                star_row: star_row
            })
            const category = yield t.any(_category)
            const category_book = yield t.any(_category_book)
            const totalpage = yield t.any(_totalpage)
            const total_rows = Number(totalpage[0].count)
            const total_page = Math.ceil(total_rows / book_limit)
            return {

                home: home,
                category: category,
                category_book: category_book,
                pagination: {
                    total_page: total_page,
                    page_curent: page_curent
                }
            }
        })
    }

    category(id) {
        let category_get = 'SELECT * FROM category WHERE parent = $1'
        //let category_detail = "SELECT * FROM category,bookstore WHERE category.id = bookstore.id_category AND category.id IN (${ids})"
        let cat_id = 'SELECT * FROM category,bookstore WHERE category.id = bookstore.id_category AND category.id = $1'

        const _category = `SELECT c.id, c.name,
            (array(
                SELECT json_build_object('name', c_c.name, 'id', c_c.id) 
                FROM category AS c_c
                WHERE c_c.parent = c.id)
            ) AS cat_child
        FROM category as c
        WHERE parent = 0`
        const _category_book = 'SELECT * FROM category  WHERE parent = 0'

        return db.task(t => {
            return t.any(category_get, id)
                .then(cat => {
                    if (cat.length > 0) {
                        console.log(1)
                        let arr_id_cat = ''
                        let count = 0
                        cat.map(cate => {
                            count++
                            if (count === 1) {
                                arr_id_cat += cate.id
                            } else {
                                arr_id_cat += ',' + cate.id
                            }
                        })
                        return db.task('data', function* (t) {
                            const home = yield t.any(`SELECT * FROM category,bookstore WHERE category.id = bookstore.id_category AND category.id IN (${arr_id_cat})`)
                            const category = yield t.any(_category)
                            const category_book = yield t.any(_category_book)
                            return {
                                home: home,
                                category: category,
                                category_book: category_book
                            }
                        })
                    } else {
                        return db.task('data', function* (t) {
                            const home = yield t.any(cat_id, id)
                            const category = yield t.any(_category)
                            const category_book = yield t.any(_category_book)
                            return {
                                home: home,
                                category: category,
                                category_book: category_book
                            }
                        })
                    }

                });
        })
    }

    detail(name_field, file_render) {
        const _home = 'SELECT * FROM bookstore'
        const _category = `SELECT c.id, c.name,
                                (array(
                                    SELECT json_build_object('name', c_c.name, 'id', c_c.id) 
                                    FROM category AS c_c
                                    WHERE c_c.parent = c.id)
                                ) AS cat_child
                            FROM category as c
                            WHERE parent = 0`
        const _category_book = 'SELECT * FROM category  WHERE parent = 0'
        const _detail = 'SELECT book.*,ca.name AS name_category,cb.name AS name_category_book FROM bookstore AS book JOIN category AS cb ON cb.id = book.id_category JOIN category AS ca ON ca.id = cb.parent'
        return db.task('data', function* (t) {
            const home = yield  t.any(_home)
            const detail = yield t.any(_detail)
            const category = yield t.any(_category)
            const category_book = yield t.any(_category_book)
            return {
                home: home,
                detail: detail,
                category: category,
                category_book: category_book
            }
        })
    }
}

//const result = new GetData (db)
module.exports = new GetData(db)
//module.exports.result = result