exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next(); //인자값으로 불러와 질 때(또는 단독으로 쓰일 때) 부모라우터(또는 다음 라우터)를 실행시켜준다.
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};