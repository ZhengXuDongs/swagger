/**
 *create by ZXDong
 *date 2018/6/19
 *param
 *description
 **/
import Router from 'koa-router';
const multer = require('koa-multer'); //加载koa-multer模块
import cfg from '../../config/app';
import api from './api';
import users from './users';
import system from './system';
import sysUsers from './sysUsers';
import birthdaySuit from './birthdaySuit';
import course from './course';
import schedule from './schedule';
import gift from './gift';
import integral from './integral';
const log = require('log4js').getLogger('routes/index');
import conf from '../../config/app.js';
import axios from 'axios';
import {
    wrapper
} from '../lib';
//文件上传

//配置


var storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    //修改文件名称
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

const rt = new Router();

wrapper(rt);
// swagger docs avaliable at http://localhost:3000/swagger-html
rt.swagger({
    title: 'Example Server',
    description: 'API DOC',
    version: '1.0.0',

    // [optional] default is root path.
    prefix: '',

    // [optional] default is /swagger-html
    swaggerHtmlEndpoint: '/swagger-html',

    // [optional] default is /swagger-json
    swaggerJsonEndpoint: '/swagger-json',

    // [optional] additional options for building swagger doc
    // eg. add api_key as shown below
    swaggerOptions: {
        securityDefinitions: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization'
            }
        }
    }
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
rt.mapDir(__dirname, {
    // default: true. To recursively scan the dir to make router. If false, will not scan subroutes dir
    // recursive: true,
    // default: true, if true, you can call ctx.validatedBody[Query|Params] to get validated data.
    // doValidation: true,
});
rt.get('/', async (ctx, next) => {
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.wx.appID}&secret=${conf.wx.appsecret}`).then(res => {
        console.log("webchat", res);
    })
    await ctx.render('index', {});
});
rt.get('/server', async (ctx, next) => {
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.wx.appID}&secret=${conf.wx.appsecret}`).then(res => {
        console.log("webchat", res);
    })
    await ctx.render('index-server', {
        title: '企鹅呆呆'
    });
});

//加载配置

var upload = multer({
    storage: storage
});
rt.post('/upload', upload.single('file'), async (ctx, next) => {
    ctx.body = {
        filename: ctx.request.file.filename
    }
});


rt.use('/api', api.routes(), users.allowedMethods());
rt.use('/users', users.routes(), users.allowedMethods());
rt.use('/system', system.routes(), system.allowedMethods());
rt.use('/sysUsers', sysUsers.routes(), system.allowedMethods());
rt.use('/birthdaySuit', birthdaySuit.routes(), system.allowedMethods());
rt.use('/course', course.routes(), system.allowedMethods());
rt.use('/schedule', schedule.routes(), system.allowedMethods());
rt.use('/gift', gift.routes(), system.allowedMethods());
rt.use('/integral', integral.routes(), system.allowedMethods());

export default rt;