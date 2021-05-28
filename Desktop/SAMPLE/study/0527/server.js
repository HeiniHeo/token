const express = require('express');
const cookieParser = require('cookie-parser');
let token = require("./createtoken");
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const ctoken = require('./jwt');
const auth = require('./middleware/auth');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static('public'))
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
});

app.get('/',(req,res)=>{
    // cookie 기본 형식 == 'key','value'
    //cookie는 header에 실림 (이름은 set-cookie) => 응답을 요청했을때가 아니라 받았을때 값이 생김
    let {msg} = req.query;
    res.render('index');
    //res.send(`${msg} HELLO WORLD <a href='/menu1'>menu1</a> <a href='/login?id=root&pw=root'>login</a>`);
    // 여기서 a 태그는 문서로써 보내졌지만 브라우저가 html 태그로 인정하고 만들어줌
});

app.get('/menu1',(req,res)=>{
    console.log(req.cookies);
    res.send('menu1 page');
});

app.get('/user/info',auth,(req,res)=>{
    res.send(`HELLO ${req.userid}`)
});

// POST auth/local/login
app.post('/auth/local/login',(req,res)=>{
    let {userid,userpw} = req.body;
    // let{userid,userpw} = JSON.parse(req.get('data'));
    // console.log('data req : ',userid,userpw);
    console.log('body req : ',userid,userpw);
    let result = {};
    if(userid=='root' && userpw=='root'){
        result = {
            result:true,
            msg:'login success'
        }

        //token 생성
        let token = ctoken(userid);
        res.cookie('AccessToken',token,{});
    } else{
        result={
            result:false,
            msg:'check your ID and PASSWORD'
        }
    }
    res.json(result);
})

app.get('/login',(req,res)=>{
    let {id,pw} = req.query;
    if(id == 'root' && pw =='root'){
        //token 생성
        let ctoken = token();
        res.cookie('token',ctoken,{httpOnly:true,secure:true,});
        res.redirect('/?msg=login success');
    }else{
        //token 실패
        res.redirect('/?msg=login fail');
    }
})

app.listen(3000,()=>{
    console.log('server starting port 3000');
});