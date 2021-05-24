console.log('switch 문 이해하기');

let gender = 'male';

if(gender == 'male'){
    console.log(1);
} else if(gender == 'female'){
    console.log(2);
}

// 값이 여러개일때는 switch문이 더 나음 가독성도 좋음 다만 기능면에서는 차이가 없다.
switch(gender){
    case 'male':
        console.log(1)
    break;
    case 'female':
        console.log(2)
    break;
}


let fruit = 'banana';

switch(fruit){
    case 'banana':
    case '참외':
        console.log('yellow')
    break;
    case 'apple':
        console.log('red')
    break;
    case 'kiwi':
    case 'watermelon':
        console.log('green')
    break;
    case 'grape':
        console.log('purple')
    break;
    default:
        console.log('해당되지 않는 과일입니다.')
    break;
}


if(fruit == 'banana' || fruit == '참외'){
    console.log('yellow');
}  else if(fruit == 'apple'){
    console.log('red');
} else if(fruit == 'kiwi' || fruit == 'watermelon'){
    console.log('green');
} else if(fruit == 'grape'){
    console.log('purple');
}