/*
const crypto = require('crypto');

function createtoken() {
    let header = {
        'alg': 'HS2560',
        'typ': 'JWT'
    }
    let encodeheader = Buffer.from(JSON.stringify(header)).toString('base64').replace('==', ''); // -> hello를 16진수로 만듬(bianry data로 비꿈)

    let payload = {
        "sub": "1234567890",
        "name": "HEINI",
        "iat": 1516239022
    }
    let encodepayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace('==', '');

    // 첫번째 인자값 = 어떤 암호화를 할거냐(sha256)
    // 두번째 인자값 = 암호화 규칙을 스트링으로 적는다. >> 16진수로 표현해주는게 좋음
    let signature = crypto.createHmac('sha256', Buffer.from('heini'))
        .update(`${encodeheader}.${encodepayload}`)
        .digest('base64')
        .replace('=', '');

    return (`${encodeheader}.${encodepayload}.${signature}`);
}

let token = createtoken();
console.log(token);
module.exports = createtoken;
*/

/*
TOKEN 완성
eyJhbGciOiJIUzI1NjAiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XW+AxA0+q3Fcbl2H7+r2npShhR4oLqqhjpodlEq9Qm0
*/

// let signature
// verify signature이 비밀키
// update 인자값으로 payload하고 header넣기

/*
0 0 0000
1 1 0001
2 2 0011
*/