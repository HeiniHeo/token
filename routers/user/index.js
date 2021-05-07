const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

router.use('/join',controller.join);
router.use('/login',controller.login);
router.get('/logout',controller.logout);
router.use('/info',controller.info);
router.post('/join_success',controller.join_success);
router.post('/login_check',controller.login_check);

module.exports = router;


/*
nunjucks 구문

{% for[받을 변수] in [반복할배열] %}
{% endfor %}

{% if [조건] %}
    html태그 가능
{% else %}
    html태그 가능
{% endif %}


{{}} == 출력용
{%%} == 언어용
*/