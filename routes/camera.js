var express = require('express');
var router = express.Router();

/* GET api json for hik camera */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;