const Nightmare = require('nightmare')
const nightmare = Nightmare({
    show: true
})
const fs = require('fs')
const async = require('async')
let ids = require('short-id')
let realdata = []
nightmare
    .goto('http://www.allitebooks.com/programming/c-programming/')
    .evaluate(() => {
        let allHref = document.querySelectorAll('.entry-title >a')
        let arr = []
        allHref.forEach(item => {
            arr.push(item.href)
        })
        return arr
    })

    .end()
    .then(arr => {
        getInfoBooks(arr, function (err, res) {
            if (err) console.log(err.message);
            console.log('Hoàn thành chạy crawl()');

        })
    })
    .catch(err => {
        console.log('err', err);
    })



function getInfoBooks(arr, cb) {
    function getBookItem(item, cb) {
        let night = new Nightmare()
        night.goto(item)
            .wait(1000)
            .evaluate(() => {
                try {
                    let books = {}
                    // books.id = ids.generate()
                    books.name = document.querySelector('.single-title').innerText.trim()
                    books.author = document.querySelector('dd:nth-child(2) > a').innerText.trim()
                    books.code = document.querySelector('dd:nth-child(4)').innerText.trim()
                    books.year = document.querySelector('dd:nth-child(6) ').innerText.trim()
                    books.pages = document.querySelector('dd:nth-child(8)').innerText.trim()
                    books.language = document.querySelector('dd:nth-child(10)').innerText.trim()
                    books.file_size = document.querySelector('dd:nth-child(12)').innerText.trim()
                    books.file_format = document.querySelector('dd:nth-child(14)').innerText.trim()
                    books.category = document.querySelector('dd:nth-child(16)').innerText.trim()
                    books.download_links = document.querySelector('.download-links:nth-child(1) > a').href
                    books.read_online = document.querySelector('.download-links:nth-child(2) > a').href
                    books.content = document.querySelector('#main-content > div > article > div.entry-content').innerHTML
                    books.img = document.querySelector('.entry-body-thumbnail img').src
                    return books
                } catch (error) {
                    console.log(err.message);
                    return {}
                }
            })
            .end()
            .then(res => {
                if (!res) {
                    cb(null, {});
                }
                try {
                    //update data every crawl time
                    realdata.push(res);
                    exportJson(realdata, 'product_c#.json');
                    cb(null, res);
                } catch (err) {
                    console.log(err.message);
                    cb(null, {});
                }
            })
    }
    async
    .mapLimit(arr, 2, getBookItem, function (err, res) {
        cb(null, res);
    });
}

function exportJson(arr, filename) {
    // chuyển dữ liệu từ mảng arr sang json
    let json = {};
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        json[i] = arr[i];
    }
    let jsonString = JSON.stringify(json);
    // lưu vào file json trong máy
    fs.writeFile(filename, jsonString, (err) => {
        if (err)
            throw err;
        console.log('Sản phẩm lưu vào file json ok!');
    });
}