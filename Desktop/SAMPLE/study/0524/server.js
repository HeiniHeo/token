/*
<카카오 로그인 API 활용>
Autherication 인증 - 내 서버
Authoization 허가 - 카카오 서버

REST API 키 : 	fe43a3fc9c491565c2335b62864a756d                //clientID
Redirect URI : http://localhost:3000/auth/kakao/callback        // redirectUri
secret key : 	HoTEJbZp6Mv1IflX6I9mvtukkw7eInkH                //clientSecret
*/
const express = require('express');
const nunjucks = require('nunjucks');
const axios = require('axios');
const qs = require('qs');
const session = require('express-session');
const bodyParser = require('body-parser')
const app = express();

app.use(session({
    secret: 'aaa',
    resave: false,
    secure: false,
    saveUninitialized: false,
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
});

const kakao = {
    clientID: "fe43a3fc9c491565c2335b62864a756d",
    clientSecret: "HoTEJbZp6Mv1IflX6I9mvtukkw7eInkH",
    redirectUri: "http://localhost:3000/auth/kakao/callback"
}

app.get('/', (req, res) => {
    const { msg } = req.query;
    res.render('./index.html', {
        msg,
        logininfo: req.session.authData,
    });
});

app.post('/login2',(req,res)=>{
    console.log(req.headers);
    res.set('token','heini');
    res.set('Authorization',`Bearer hello HI`)
    res.json({
        test:'ok'
    })
})

app.get('/login', (req, res) => {
    res.render('login.html')
})

app.post('/login', (req, res) => {
    const { session } = req;
    const { userid, userpw } = req.body;

    //userid & pw 값을 DB에서 검색 해야하지만 db없으니까 패스
    // 대신 userid = root userpw = root 일때 성공하는 시나리오 작성

    if (userid == 'root' && userpw == 'root') {
        const data = {
            userid,
            userpw,
        }
        session.authData = {
            ['local']: data,
        }

        res.redirect('/?msg=login success');
    } else {
        console.log('login fail')
        res.redirect('/?msg=check your id or password')
    }
})

// profile account_email 를 쿼리스트링으로 
app.get('/auth/kakao', (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile,account_email`;
    res.redirect(kakaoAuthURL);
})
// /auth/kakao/callback  : 이 url로 사용자가 들어오면 우리는 카카오에게 두번(로그인 해달라 ,정보 달라) 요청한다
app.get('/auth/kakao/callback', async (req, res) => {
    // axios => Promise Object
    const { session, query } = req;
    const { code } = query;
    // let session = req.session;
    let token;
    try {
        token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }, // npm install qs
            data: qs.stringify({
                grant_type: 'authorization_code', // 특정 스트링 
                client_id: kakao.clientID,
                client_secret: kakao.clientSecret,
                redirectUri: kakao.redirectUri,
                //code:req.query.code,
                code,
            }) // 객체를 String으로 변환.
        })
    } catch (err) {
        res.json(err.data)
    }

    let user;
    try {
        user = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${token.data.access_token}`
            }
        })
    } catch (err) {
        res.json(err.data)
    }

    const authData = {
        ...token.data,
        ...user.data,
    }

    req.session.authData = {
        ['kakao']: authData,
    }

    res.redirect('/');  // callback 갔다가 세션에 담고 다시 인덱스 페이지로 오게함
})

const authMiddleware = (req, res, next) => {
    const { session } = req;
    if (session.authData == undefined) {
        console.log('NO LOGIN INFORMATION');
        res.redirect('/?msg=NO LOGIN INFORMATION');
    } else {
        console.log('YES LOGIN');
        next();
    }
}

app.get('/auth/info', authMiddleware, (req, res) => {

    const { authData } = req.session;
    const provider = Object.keys(req.session.authData)[0];
    // console.log(provider);
    switch (provider) {
        case 'kakao':
            userinfo = {
                userid: authData[provider].properties.nickname,
                userimage: authData[provider].properties.profile_image,
            }
            break;
        case 'local':
            userinfo = {
                userid: authData[provider].userid,
            }
            break;
    }
    // console.log(authData)
    res.render('info', {
        userinfo,
    })
})

app.get('/auth/kakao/unlink', authMiddleware, async (req, res) => {
    //내용을 담아서 카카오에게 요청을 보내야 한다. => 비동기로
    const { session } = req;
    const { access_token } = session.authData.kakao;

    // console.log(access_token);

    let unlink;

    try {
        unlink = await axios({
            method: 'POST',
            url: 'https://kapi.kakao.com/v1/user/unlink',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    }
    catch (err) {
        res.json(err.data)
    }

    // console.log(unlink.data) // 카카오쪽에서는 이미 처리가 완료 됐기 때문에 값이 나온다.
    //카카오 쪽에선 끝났으니 우리 쪽에서는 세션을 지워줘야 한다.

    const { id } = unlink.data;

    if (session.authData['kakao'].id == id) {
        delete session.authData;
    }

    res.redirect('/?msg=LOGGED OUT');
})

app.get('/auth/logout', (req, res) => {
    const {session} = req;
    const {authData} = req.session;
    const provider = Object.keys(authData)[0];
    switch (provider) {
        case 'local': 
            delete session.authData;
            res.redirect('/?msg=LOGGED OUT')
        break;
        case 'kakao':
            res.redirect('/auth/kakao/unlink')
        break;
    }
})

app.listen(3000, () => {
    console.log('server 3000');
});