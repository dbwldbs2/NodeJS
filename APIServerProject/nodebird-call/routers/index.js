const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';

axios.defaults.headers.origin = 'http://localhost:8003';

const request = async (req, api) => {
    try {
        if(!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET
            });
            req.session.jwt= tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`, {
            headers: {authorization: req.session.jwt}
        });
    } catch(error) {
        console.error('error: ', error);
        if (error.response.status === 419) { // 토큰 만료시 토큰 재발급 받기
            delete req.session.jwt;
            return request(req, api);
          } // 419 외의 다른 에러면
          return error.response;
    }
};

router.get('/', (req, res) => {
    res.render('main', {key: process.env.CLIENT_SECRET});
});

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        console.log('result :: ', result);
        res.json(result.data);
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router; 