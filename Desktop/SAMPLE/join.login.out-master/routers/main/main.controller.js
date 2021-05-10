let main = (req,res)=>{
    res.render('./index.html',{
        userid:req.session.uid,
        isLogin:req.session.isLogin
    });
}

module.exports.main = main; // 뒤에가 함수 앞에가 변수