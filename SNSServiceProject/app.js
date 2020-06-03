const express = require('express'); //웹서버 역할
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

require('dotenv').config();

const pageRouter = require('./routes/page');//./routes폴더의 page.js모듈을 불러온다.
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync() //모델 폴더에 있는 DB 모델과 실제 DB와 싱크를 맞춘다.
passportConfig(passport); //./passport의 모듈을 사용함

app.set('views', path.join(__dirname, 'views')); //템플릿 엔진 랜더링 경로(default 값이 설정 되어 있음[views: __dirname, 'views'])
app.set('view engine', 'pug');//사용하는 템플릿 엔진
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev')); //요청에 대한 정보를 콘솔에 기록
app.use(express.static(path.join(__dirname, 'public'))); //정적 리소스들을 모아 놓은 폴더 경로
app.use('/img', express.static(path.join(__dirname, 'uploads')));

app.use(express.json()); //본문(body)의 json형식 데이터를 해석(req.body에 해석한 데이터가 들어감)
app.use(express.urlencoded({extended: false}));//URL형식의 쿼리(e.g. http://...?x=1&y=2)를 json형식(querystring library)으로 변환해서 req.body에 데이터를 추가, true일 경우 qs library 참조
app.use(cookieParser(process.env.COOKIE_SECRET));//요청(request)에 동봉된 쿠기를 해석, 해석된 쿠키들은 req.cookies에 추가됨. 입력된 비밀키(1번째 인자)는 클라이언트에서 쿠키를 수정하지 못하도록 방지
app.use(session({
    resave: false, //세션에 수정사항이 생기지 않아도 세션을 다시 저장하는 옵션을 설정(true: 저장, false: 저장하지 않음)
    saveUninitialized: false, //세션에 저장할 내역이 없어도 세션을 저장하는 옵션을 설정(true: 저장, false: 저장하지 않음)
    secret: process.env.COOKIE_SECRET, //클라이언트에서 요청받은 쿠키의 비밀키와 비교
    cookie: {
        httpOnly: true, //클라이언트에서 쿠키 확인 가능여부를 설정함(javascript로 쿠키에 접근 가능여부를 설정함)
        secure: false //https가 아닌 환경에서도 쿠키 사용여부를 설정함
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter); //라우터모듈(e.g. pageRouter)에서는 next()함수를 입력하지 않는다.
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);


//라우터가 실행 되지 않았을 때 실행되는 미들웨어
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//next함수 종류
//next(): 다음 미들웨어로 이동
//next('route'): 'route'로 선언 되어있는 라우트(미들웨어)로 이동
//next(error): 에러 핸들러로 이동

//next(err)와 같은 함수가 실행 됐을 때 실행되는 에러 핸들러, 에러 핸들러의 err인자는 next(err)의 err를 받는다.
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
