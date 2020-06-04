const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models').User;

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email', //'email' = req.body.email로 파싱됨, html의 id가 email인 것을 id로 함
        passwordField: 'password', //'password' = req.body.password로 파싱됨, html의 id가 password인 것을 password로 함
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email } }); //local사용자를 찾는 기준
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};