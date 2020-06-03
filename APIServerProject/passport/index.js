const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const {User} = require('../models');

module.exports = (passport) => {
    //req.login에 의해서 실행된다.
    passport.serializeUser((user, done) => {
        done(null, user.id); //첫번째 인자는 에러 발생시 사용되고, 두번째 인자로 세션(req.session)에 해당 인자만 저장됨
    });

    //새로운 요청이 있을 때마다 실행된다.
    passport.deserializeUser((id, done) => { //id는 req.session에서 가져온 값이다.
        User.findOne({where: {id},
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings'
            }]
        })
            .then(user => done(null, user)) //req.user에 사용자 정보를 저장
            .catch(err => done(err));
    });
    local(passport);
    kakao(passport);
 };