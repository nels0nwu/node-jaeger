var express = require('express');
var routethis = express.Router();

routethis.get('/', function (req, res) {
    res.send('Routed');
})

routethis.get('/yes', function (req, res) {
    res.send('yes');
})
routethis.get('/no', function (req, res) {
    res.send('no');
})

module.exports = routethis;