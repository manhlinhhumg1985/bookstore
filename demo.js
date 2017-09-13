var download = require('download-pdf')

var url = 'http://file.allitebooks.com/20170623/Procedural%20Content%20Generation%20for%20C++%20Game%20Development.pdf'

var options = {
    directory:'./images',
    filename: 'cat.pdf'
}
download(url, options, function(err){
    if (err) throw err
    console.log('meow')
})