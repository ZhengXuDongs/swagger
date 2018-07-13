import Base from '../db/base';
const log = require('log4js').getLogger('logic/sysUsers');
import cfg from '../../config/app';
import Des from 'des_zxd';
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
const tag = tags(['SystemUsers 系统管理员相关接口']);
const table = 'sys_user';

class SysUsersLogic {

    @request('post', '/sysUsers/add-system-users')
    @summary('系统管理员添加接口')
    @description('example of api')
    @tag
    @body({
        user_name:{type:'string',required:true},
        pass_word:{type:'string',required:true},
        real_name:{type:'string',required:true},
    })
    static async AddSystemUsers(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.status = 1;
        param.pass_word = Des.encryptDes(param.pass_word,cfg.cryptoDes.KEY,cfg.cryptoDes.IV);
        param.create_time = moment(new Date()).format();
        const userData = await Base.Search({table,where:{user_name:param.user_name}});
        if(userData.length>0){
            result = {isSucc:false,code:202,message:'该用户名已存在'};
        }else{
            if(param.user_name && param.pass_word && param.real_name){
                const data = await Base.Save({table,data:param});
                if(data){
                    result = cfg.message.addSuccess;
                }else{
                    result = cfg.message.addFailed;
                }
            }else{
                result = cfg.message.paramErr;
            }
        }

        ctx.body = result;
    }

    @request('post', '/sysUsers/update-system-users')
    @summary('系统管理员修改接口')
    @description('example of api')
    @tag
    @body({
        sys_user_id:{type:'number',required:true},
        user_name:{type:'string',required:false},
        real_name:{type:'string',required:false},
    })
    static async UpdateSystemUsers(ctx){
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const where = {
            sys_user_id:param.sys_user_id
        };
        delete param.sys_user_id;
        if(where.sys_user_id){
            const data = await Base.Update({table,where});
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

    @request('post', '/sysUsers/delete-system-users')
    @summary('系统管理员删除接口')
    @description('example of api')
    @tag
    @body({
        sys_user_id:{type:'number',required:true},
    })
    static async DeleteSystemUsers(ctx){
        let result = null;
        const param = ctx.request.body;
        const where = {
            sys_user_id:param.sys_user_id
        };
        const updates = {
            status:0
        };
        if(param.sys_user_id){
            const data = await Base.Update({table,where,updates});
            if(data){
                result = cfg.message.deleteSuccess;
            }else{
                result = cfg.message.deleteFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('get', '/sysUsers/search-system-users')
    @summary('管理员查询 有id查询单条 没有查询所有')
    @description('example of api')
    @tag
    @query({
        sys_user_id:{type:'number',required:false},
    })
    static async SearchSystemUsers(ctx){
        let result = null;
        const param = ctx.request.query;
        if(param.sys_user_id){
            var where = {
                sys_user_id:param.sys_user_id,
                status:1,
            };
        }else{
            where = {
                status:1
            };
        }
        const order = {
            create_time:'Desc'
        };
        const field = 'user_name,real_name,create_time,update_time';

        const data = await Base.Search({table,field,where,order});
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('post', '/sysUsers/login')
    @summary('管理员登录接口')
    @description('example of api')
    @tag
    @body({
        user_name:{type:'string',required:true,description:'用户名'},
        pass_word:{type:'string',required:true,description:'密码'},
    })
    static async LoginUser(ctx) {
        let result = null;
        const param = ctx.request.body;
        if(param.user_name && param.pass_word){
            const passWord = Des.encryptDes(param.pass_word,cfg.cryptoDes.KEY,cfg.cryptoDes.IV);
            const userData = await Base.Search({table:'sys_user',where:{user_name:param.user_name,pass_word:passWord,status:['!=',2]}});
            if(userData){
                const data = {
                    sys_user_id:userData[0].sys_user_id,
                    user_name:userData[0].user_name,
                    create_time:userData[0].create_time,
                    real_name:userData[0].real_name,
                    status:userData[0].status
                };
                result = {isSucc:true,code:200,message:'登录成功',result:data};
            }else{
                result = {isSucc:false,code:202,message:'用户名或密码错误'};
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

}

export default SysUsersLogic;