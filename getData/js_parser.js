// const request = require('request');
const needle = require('needle')
const cheerio = require('cheerio');
//const async = require('async');
const KPparser = require('./index');

URL = 'https://www.kinopoisk.ru/lists/m_act%5Bgenre%5D/3/';
let ids = []
let namesOrig = []

needle.get(URL, function (err, res) {
    if (err) throw err;

    var $ = cheerio.load(res.body)
    //console.log($('.tenItems').text())
    item = $('.tenItems .item')
    
    item.each((i, val) =>{
        ids.push(($(val).attr('id')).slice(3))
    })
    names = $('.tenItems .name span')//.text()
    names.each((i, val) =>{
        namesOrig.push($(val).text().split(' (')[0])
    })
    //console.log(names.text())
    console.log('namesOrig', namesOrig)

    

     });

// const myParser = new KPparser();
//       myParser.parseKinopoiskFilm('389')
//         .then((res)=>{
//           console.log(res);
//         }).catch((err)=>{
//           console.log(`err: ${err}`);
//         });


