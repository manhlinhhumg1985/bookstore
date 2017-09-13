const initOptions = {
    // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn)
            console.log('EVENT:', error.message || error)
        }
    }
}
const connection = {
    host: 'localhost',
    port: 5432,
    database: 'demobook',
    user: 'postgres',
    password: '123'
}
const pgp = require('pg-promise')(initOptions)
const db = module.exports = pgp(connection)