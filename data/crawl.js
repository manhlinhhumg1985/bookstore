// Gọi module Nightmare để sử dụng
const Nightmare = require('nightmare');
const async = require('async');

// khởi tạo nightmare
const nightmare = Nightmare();

function getOption(url, name) {
    console.log(url, name)
    // let destPath = __dirname + '/public/images';
    // let des = destPath + '/' + name;
    // options = {
    //     url: url,
    //     dest: des,
    //     destPath: destPath,
    //     done: function (err, filename, image) {
    //         if (err) {
    //             throw err
    //         }
    //         console.log('File saved to', filename)
    //     }
    // }
    return 'sdf';
}

let url = `
http://www.allitebooks.com/web-development/asp-net/page/12/
`;
nightmare.goto(url)
    .evaluate(function () {
        let posts = document.querySelectorAll('.type-post > .entry-thumbnail > a');
        let arr = [];
        posts.forEach(item => {
            arr.push(item.getAttribute('href'));
        });
        return arr;
    })
    .end()
    .then(function (arr) {
        crawlDetail(arr, function (err, res) {
            console.log(res);
            //exportJson(res);
        });
    })
    .catch(error => {
        console.log('ERROR: ', error);
    });

function crawlDetail(arr, cb) {
    function test(item, cb) {
        let night = new Nightmare({show: true});
        night.goto(item)
            .wait(1000)
            .evaluate(function () {
                try {
                    let obj = {};

                    let name = document.querySelector('h1.single-title').innerText;

                    let author = document.querySelector('.book-detail dl dd:nth-child(2)').innerText;
                    let isbn = document.querySelector('.book-detail dl dd:nth-child(4)').innerHTML;
                    let year = document.querySelector('.book-detail dl dd:nth-child(6)').innerHTML;
                    let pages = document.querySelector('.book-detail dl dd:nth-child(8)').innerHTML;
                    let language = document.querySelector('.book-detail dl dd:nth-child(10)').innerHTML;
                    let file_size = document.querySelector('.book-detail dl dd:nth-child(12)').innerHTML;
                    let file_format = document.querySelector('.book-detail dl dd:nth-child(14)').innerHTML;
                    let cat_id = 4;

                    let description = document.querySelector('.entry-content').innerHTML;

                    let image_name = document.querySelector('.attachment-post-thumbnail').getAttribute('src');

                    let file_name = document.querySelector('.download-links:first-child a').getAttribute('href');


                    obj['name'] = name;
                    obj['author'] = author;
                    obj['isbn'] = isbn;
                    obj['year'] = year;
                    obj['pages'] = pages;
                    obj['language'] = language;
                    obj['file_name'] = file_name;
                    obj['file_size'] = file_size;
                    obj['file_format'] = file_format;
                    obj['cat_id'] = cat_id;
                    obj['description'] = description;
                    obj['image_name'] = image_name;
                    return obj;
                } catch (err) {
                    console.log('Searching not found');
                    return {};
                }
            })
            .end()
            .then(function (res) {
                if (!res) {
                    cb(null, {});
                }
                try {
                    console.log('res', res);
                    let arr = res.image_name.split('/');
                    let n = arr.length - 1;
                    let name = arr[n];
                    let opt = getOption(res.image_name, name);
                    console.log('opt: ', opt)
                    shell.mkdir('-p',opt['destPath']);
                    downloader(opt);
                    res['image'] = opt['dest'];
                    cb(null, res);
                } catch (err) {
                    console.log('Error File not found');
                    cb(null, {});
                }
            });
    }

    // so luong web truy cap 1 luc
    async.mapLimit(arr, 2, test, function (err, res) {
        cb(null, res);
    });
}

function exportJson(arr) {
    let json = {};
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        json[i] = arr[i];
    }
    let jsonString = JSON.stringify(json);
    fs.writeFile('data.json', jsonString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}