var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
};

// select euslisp client number
// router.get('/', function (req, res, next) {

//   var articles = [new Article(), new Article()];
//     res.render('index', {
//       title: 'Generator-Express MVC',
//       articles: articles
//     });
// });
router.get('/', function(req, res, next){
  res.render('index', {
    title: 'python'
  });
});
