import Router from 'koa-router';
const rt = new Router();
import axios from 'axios';
import conf from '../../config/app.js';
import UsersLogic from '../logic/users';


rt.post('/add-regular-user', UsersLogic.AddRegularUser);
rt.post('/update-user', UsersLogic.UpdateUser);
rt.post('/delete-user', UsersLogic.DeleteUser);
rt.get('/search-user', UsersLogic.SearchUser);

rt.get('/get-token', async (ctx, next) => {
    console.log(11, conf);
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.wx.appID}&secret=${conf.wx.appsecret}`).then(res => {
        console.log("webchat", res);
    })
    ctx.body = {}
})
export default rt;