import Router from 'koa-router';
import axios from 'axios';
import conf from '../../config/app.js';
const rt = new Router();
import ApiLogic from '../logic/api';
const multer = require('koa-multer'); //加载koa-multer模块
import sha1 from '../lib/sha1.js';


var upload1 = multer({
    dest: './'
});

var storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
        cb(null, './public/upload/')
    },
    //修改文件名称
    filename: function(req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

var upload = multer({
    storage: storage
});

rt.post('/upload-file', upload.single('file'), ApiLogic.UploadFile);
rt.post('/upload-file1', upload1.single('file'), ApiLogic.UploadFiles);
rt.post('/wx-pay',ApiLogic.WxPay);
rt.get('/test',ApiLogic.Test);

rt.get('/get-config', async (ctx, next) => {
    let url = ctx.request.query.url;
    console.log(29, url);
    let token = ctx.cookie.get('token') || " ";
    let jasp = ctx.cookie.get('jasp') || " ";
    console.log(32, token, jasp);
    if (token == " ") {
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.wx.appID}&secret=${conf.wx.appsecret}`
        await axios.get(url).then(res => {
            console.log(36, res.data);
            if (res.data.access_token) {
                token = res.data.access_token;
            }
        });
        ctx.cookie.set('token', token, Date.now() / 1000 + 3600);
    }
    if (jasp == " ") {
        let jsapi = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
        await axios.get(jsapi).then(res => {
            console.log(62, res.data);
            if (res.data.ticket) {
                jasp = res.data.ticket;
            }
        });
        console.log(43, jasp);
        ctx.cookie.set('jasp', jasp, Date.now() / 1000 + 3600);
    }
    var noncestr = conf.wx.noncestr;
    var timestamp = Math.floor(Date.now() / 1000); //精确到秒
    let signStr = 'jsapi_ticket=' + jasp + '&noncestr=' + noncestr + '&timestamp=' + timestamp +
        '&url=' + url;
    console.log('api 49', signStr);
    let signature = sha1.hex_sha1(signStr);
    console.log('api 47', signature);

    let config = {
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: conf.wx.appID, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: ['checkJsApi', 'chooseWXPay'] // 必填，需要使用的JS接口列表
    };
    console.log(config);
    ctx.body = {
        isSucc: true,
        result: config
    };

})
rt.get('/get-code', async (ctx, next) => {
    console.log("user get code", ctx.request.query);
    let uri = ctx.request.query.url;
    console.log("name", "wangfei", ctx.cookie);
    let redirectUri = encodeURIComponent(uri);
    console.log("user get code", redirectUri);
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${conf.wx.appID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    /*await ctx.redirect(url);*/
    ctx.body = {
        isSucc: true,
        result: url
    };
})
rt.get('/get-token', async (ctx, next) => {
    let code = ctx.request.query.code;
    console.log(38, code);
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${conf.wx.appID}&secret=${conf.wx.appsecret}&code=${code}&grant_type=authorization_code`
    let result = await axios.get(url);
    console.log(55, result.data);
    ctx.cookie.set('token', result.data.access_token);
    ctx.cookie.set('oid', result.data.openid);
    let user = await axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${result.data.access_token}&openid=${result.data.openid}&lang=zh_CN`)
    ctx.body = {
        isSucc: true,
        result: user.data
    }

})


export default rt;