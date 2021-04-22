var express = require('express');
var router = express.Router();
var spaceModel = require('../models/spaceModel').spaceModel;
/* GET home page. */
/*router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});*/

router.get('/', function(req, res, next) {
    res.redirect('/admin/main.html');
});
router.get('/admin/main.html',function(req,res){
    res.render('main', {});
});

router.get('/show/:spaceCode', function(req, res, next) {
    var spaceCode = req.params['spaceCode'];
    spaceModel.getPtexts(spaceCode,function(ptexts){
        res.render('show/show', {spaceCode:spaceCode,spaceName:ptexts});
    })
});

module.exports = router;
