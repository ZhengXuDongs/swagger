const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
import cors from 'koa-cors';
const {
    cookieOptions
} = require('./config/app.js');
//const index = require('./src/routes/index')
// const users = require('./src/routes/users')
import index from './src/routes/index';

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/'))
app.use(cors({
    credentials: true,
}));

app.use(views(__dirname + '/views', {
    extension: 'hjs',
    map: {
        hjs: 'hogan'
    }
}))
app.use(async (ctx, next) => {
    // 插入cookie函数加入了 cookie maxAge @author xs
    ctx.cookie = {
        set: (k, v, opt) => {
            console.log(40, opt);
            opt = Object.assign({}, cookieOptions, opt);
            console.log(opt);
            return ctx.cookies.set(k, v, opt);
        },
        get: (k, opt) => {
            opt = Object.assign({}, cookieOptions, opt);
            return ctx.cookies.get(k, opt);
        }
    };
    await next();
});

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

module.exports = app