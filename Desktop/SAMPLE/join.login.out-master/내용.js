    /* query insert 문 */
    
    User.create({ //Sequelize.Model에 create라는 method가 존재하는 거
        userid:'test2',
        userpw:'789462',
        username:'더 더 막무가내',
        gender:false,
        userimage:'NO IMAGE',
    });
    

    /* select 문 */
    
    let userList = User.findAll({})
    .then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    })
    
    /*version 2*/
    let userList = await User.findAll({});
    console.log(userList);
    

    /* update + WHERE 절 ==> WHERE 두번째 객체에 객체로 넣어주기*/
    let result = await User.update({ 
        userpw:'nomorewait',
        username:'개명했어',
        gender:false,
        userimage:'YES IMAGE'
    },{
        where:{userid:'bye'}
    })
    console.log(result); // [0]일때는 변경 X [1]일때는 변경 O
    

    /* 삭제 */
    User.destroy({
        where:{id:4}
    })