const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {User} = require('../models');

const router = express.Router();

//라우터 인자값으로 미들웨어를 넣을 수 있다.
//회원가입폼의 회원가입 버튼
router.post('/join', isNotLoggedIn, async(req, res, next) => { //로그인한 사용자는 접근할 수 없다.
    const {email, nick, password} = req.body;
    try {
        const exUser = await User.findOne({where: {email}});
        
        if(exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }

        const hash = await bcrypt.hash(password, 12); //비밀번호를 암호화 한다. 2번째 인자는 암호화 반복횟수 이다. ~31까지 사용할 수 있다.
        await User.create({
            email,
            nick,
            password: hash
        });
        
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

//로그인 폼의 로그인 버튼
router.post('/login', isNotLoggedIn, (req, res, next) => {//로그인한 사용자는 접근할 수없다.
    passport.authenticate('local', (authError, user, info) => {  //localStrategy 수행(localStrategy.js의 passport.use함수 실행)
        if(authError) {
            console.error(authError);
            return next(error);
        }

        if(!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        //최종적으로 return 값은 res.redirect('/') 또는 return next(loginError)을 가진다.
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); //req.user 객체를 제거
    req.session.destroy(); //req.session 객체 내용을 제거
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;

