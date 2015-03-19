var express = require('express');

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Compare products' });
});

/* GET products JSON */
router.get('/shards/products', function(req, res, next) {
    async.map(req.query.url || [], loadUrl, function(err, result) {
    	if (err) throw err;
    	res.json(result);
    });
});


function loadUrl(url, callback) {
    var options = {
       url: url,
       headers: {
           'User-Agent': 'Mozilla/5.0 (Macintosh)'
       }
    };

    request(options, function(err, res, html) {
        if (!err && res.statusCode == 200) {
            callback(null, parseData(html));
        } else {
            callback('Server responded with ' + res.statusCode + ' status.');
        }
    });
}

function parseData(data) {
    var $ = cheerio.load(data);

	var result = {
		name: $('h1').text().trim(),
		review_count: $('#review a').text().trim(),
		price: $('#price_box').text().trim(),
		price_special: $('#special_price_box').text().trim(),
		image: $('#productImageBox > .productImage').data('image'),
		href: $('link[rel=canonical]').attr('href'),
		specs: {}
	};

	$('.specification-table tr').each(function(index, elem) {
	    var $cells = $(elem).children(),
	        name = $cells.first().text().trim(),
            value = $cells.last().text().trim();

        if (name && value) {
            result.specs[name] = value;
        }
	});

	var rating = $('#rating .itm-ratRating').css('width');
	if (rating) {
		result.rating = rating.replace(/\D*/g, '');
	}

	return result;
}


module.exports = router;
