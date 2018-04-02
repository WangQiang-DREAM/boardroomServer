const router = require('koa-router')();

router.get('/', function (ctx, next) {
    ctx.body = 'ok';
});

module.exports = router;
