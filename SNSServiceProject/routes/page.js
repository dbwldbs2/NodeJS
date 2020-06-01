const express = require('express');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {Post, User} = require('../models');

const router = express.Router();



router.get('/profile', isLoggedIn, (req, res) => { //[.../page/profile]URL 접속시 실행되는 함수
    res.render('profile', {title: '내정보 - NodeBird', user: req.user}); //views폴더의 profile.pug파일에 변수를 전송
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
       title: '회원가입 - NodeBird', user: req.user, joinError: req.flash('joinError')
    });
});

router.get('/', (req, res, next) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ['id', 'nick']
        },
        order: [['createdAt', 'DESC']]
    })
        .then((posts) => { //main.pug파일이 실행되고, 상속받는 파일이 있으면 해당 파일도 같이 실행한다.
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError')
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

module.exports = router;