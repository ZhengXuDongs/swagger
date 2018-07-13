import Base from '../db/base';
const log = require('log4js').getLogger('logic/user');
import cfg from '../../config/app';
import moment from 'moment';
import {
    request,
    summary,
    query,
    body,
    tags,
    middlewares,
    path,
    description
} from '../lib';
const tag = tags(['Users 用户相关接口']);
const table = 'user';

class UsersLogic {

    @request('post', '/users/add-regular-user')
    @summary('普通会员激活接口')
    @description('example of api')
    @tag
    @body({
        user_name:{type:'string',required:false,description:'用户名(昵称)'},
        baby_name:{type:'string',required:true,description:'宝宝姓名'},
        sex:{type:'number',required:true,description:'性别 1男 2女'},
        birth_date:{type:'string',required:true,description:'出生日期 xxxx-xx-xx'},
        parent_phone:{type:'string',required:true,description:'家长电话'},
        members_card_no:{type:'string',required:true,description:'会员号'},
        members_status:{type:'number',required:true,description:'会员状态 0未激活 1已激活'},
        openid:{type:'string',required:true,description:'openid'},
    })
    static async AddRegularUser(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        param.members_level = 1;
        if(param.baby_name && param.baby_name && param.sex && param.birth_date && param.parent_phone && param.members_card_no && param.openid){
            const data = await Base.Save({table,data:param});
            if(data){
                result = cfg.message.addSuccess;
            }else{
                result = cfg.message.addFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }


    @request('post', '/users/update-user')
    @summary('用户修改接口')
    @description('example of api')
    @tag
    @body({
        uid:{type:'number',required:true,description:'用户id'},
        baby_name:{type:'string',required:false,description:'宝宝姓名'},
        sex:{type:'number',required:false,description:'性别 1男 2女'},
        birth_date:{type:'string',required:false,description:'出生日期 xxxx-xx-xx'},
        parent_phone:{type:'string',required:false,description:'家长电话'},
    })
    static async UpdateUser(ctx) {
        let result = null;
        const param = ctx.request.body;
        if(param.uid){
            const where = {
                uid:param.uid
            };
            const updates = {
                baby_name:param.baby_name,
                sex:param.sex,
                birth_date:param.birth_date,
                parent_phone:param.parent_phone
            };
            const data = await Base.Update({table:table,where,updates});
            if(data){
                result = cfg.message.updateSuccess;
            }else{
                result = cfg.message.updateFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/users/delete-user')
    @summary('用户删除接口')
    @description('example of api')
    @tag
    @body({
        uid:{type:'number',required:true,description:'用户id'},
        status:{type:'number',required:true,description:'状态 0为禁用 1为启用 2为删除'},
    })
    static async DeleteUser(ctx) {
        let result = null;
        const param = ctx.request.body;
        if(param.uid && param.status>-1){
            const updates = {
                status:param.status
            };
            const data = await Base.Update({table,where:{uid:param.uid},updates});
            if(data){
                result = cfg.message.updateSuccess;
            }else{
                result = cfg.message.updateFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('get', '/users/search-user')
    @summary('用户查询接口')
    @description('example of api')
    @tag
    @query({
        uid:{type:'number',required:false,description:'用户id'},
        temp:{type:'number',required:false,description:'会员卡号/宝宝姓名/昵称'},
        members_level:{type:'number',required:false,description:'会员类型'},
        members_status:{type:'number',required:false,description:'会员状态'},
    })
    static async SearchUser(ctx) {
        let result = null;
        const param = ctx.request.query;
        var sql1 = 'select * from user where status != 2 ';
        if(param.uid){
            sql1 += ` and uid='${param.uid}' `;
        }
        if(param.temp){
            sql1 += ` and (members_card_no='${param.temp}' or user_name='${param.temp}' or baby_name='${param.temp}') `;
        }
        if(param.members_level){
            sql1 += ` and members_level='${param.members_level}' `;
        }
        if(param.members_status>-1){
            sql1 += ` and members_status='${param.members_status}' `;
        }
        sql1 += ' order by create_time DESC;';
        console.log(sql1)
        const data = await Base.search(sql1);
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }


    // static async RechargeUserOrder(ctx) {
    //     let result = null;
    //     const param = ctx.request.body;
    //     if(param.user_id && param.members_card_no && param.money){
    //         const userData = {
    //             order_no:moment(new Date()).format('yyyyMMddHHmmssSS'),
    //             order_money:param.money,
    //             user_id:param.user_id,
    //             order_type:1,
    //             status:0,
    //         }
    //     }
    // }

}

export default UsersLogic;