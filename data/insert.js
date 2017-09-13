const {db, config} = require('../pgp')
let data = require('./product_asp.json')

for (let count in data) {
    data[count].category = 16

    db.any(
        'insert into bookstore(author, description, id_category, file_format, file_size, images, isbn, language, link_download,   name, pages, read_online, year)' +
        'values (${author},${description},${category},${file_format},${file_size},${images},${isbn},${language},${link_download},${name},${pages},${read_online},${year})',
        data[count]
    ).then(()=>{
        console.log('insert location succeed')
    })
        .catch(error => {
            console.log('error',error)
        })
}