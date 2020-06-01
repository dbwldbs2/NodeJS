var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express!!!' }); //index 파일의 title을 Express로 설정함
});

module.exports = router;
