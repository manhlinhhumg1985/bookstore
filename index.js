const express = require('express')
const app = express()
const router  = express.Router()
const port = 3002
const {db,} = require('./pgp')
const flash = require('connect-flash')
const session = require('express-session')
const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const home = require('./routers/home').home
const detail_book = require('./routers/detail_book').detail_book
const search = require('./routers/searching').search
const register = require('./routers/registering').register
const login = require('./routers/login').login
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// Using file static for project
app.use(express.static('public'))

// nunjucks config 
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true 
})
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

// route-middleware must put after app.use(express.static('public'))
app.use(router)

/**
 *  All routers
 *  router home: display all books
 *  router detail_book: display information of a book, author, category
 */
login(router)
home(router)
register(router)
detail_book(router)
search(router)
app.listen(port, function () {
    console.log(`Server on running on port ${port}!`)
})