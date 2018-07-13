import Base from '../db/base';
const log = require('log4js').getLogger('logic/system');
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
const tag = tags(['SystemManage 系统管理相关接口']);

class SystemLogic {

    @request('post', '/system/add-recharge')
    @summary('充值管理添加接口')
    @description('example of api')
    @tag
    @body({
        money:{type:'number',required:true},
        is_vip:{type:'number',required:true},
        quantity:{type:'number',required:true},
        tickets_num:{type:'number',required:false},
    })
    static async AddRechargeManage(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        const table = 'recharge_manage';
        if(param.money && param.quantity){
            console.log(param);
            const data = await Base.Save({table,data:param});
            if(data){
                result = {isSucc:true,code:200,message:'添加成功',result:''};
            }else{
                result = {isSucc:false,code:202,message:'添加失败',result:''};
            }
        }else{
            result = {isSucc:false,code:203,message:'添加失败',result:'参数不全'};
        }

        ctx.body = result;
    }

    @request('post', '/system/update-recharge')
    @summary('充值管理修改接口')
    @description('example of api')
    @tag
    @body({
        recharge_manage_id:{type:'number',required:true},
        money:{type:'number',required:false},
        is_vip:{type:'number',required:false},
        quantity:{type:'number',required:false},
        tickets_num:{type:'number',required:false},
    })
    static async UpdateRechargeManage(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const table = 'recharge_manage';
        const where = {
            recharge_manage_id:param.recharge_manage_id
        };
        delete param.recharge_manage_id;
        const updates = param;
        console.log(param);
        if(where.recharge_manage_id){
            const data = await Base.Update({table,where,updates});
            if(data){
                result = {isSucc:true,code:200,message:'修改成功',result:''};
            }else{
                result = {isSucc:false,code:202,message:'修改失败',result:''};
            }
        }else{
            result = {isSucc:false,code:203,message:'修改失败',result:'参数不全'};
        }

        ctx.body = result;
    }

    @request('post', '/system/delete-recharge')
    @summary('充值管理删除接口ById')
    @description('example of api')
    @tag
    @body({
        recharge_manage_id:{type:'number',required:true},
    })
    static async DeleteRechargeManage(ctx) {
        let result = null;
        const param = ctx.request.body;
        const table = 'recharge_manage';
        const where = {
            recharge_manage_id:param.recharge_manage_id
        };
        console.log(param);
        if(where.recharge_manage_id){
            const data = await Base.Delete({table,where});
            if(data){
                result = {isSucc:true,code:200,message:'删除成功',result:''};
            }else{
                result = {isSucc:false,code:202,message:'删除失败',result:''};
            }
        }else{
            result = {isSucc:false,code:203,message:'删除失败',result:'参数不全'};
        }

        ctx.body = result;
    }

    @request('get', '/system/search-recharge')
    @summary('充值管理查询 有id查询单条 没有查询所有')
    @description('example of api')
    @tag
    @query({
        recharge_manage_id:{type:'number',required:false},
    })
    static async SearchRechargeManage(ctx){
        let result = null;
        const param = ctx.request.query;
        const where = {
            recharge_manage_id:param.recharge_manage_id?param.recharge_manage_id:'',
        };
        const order = {
            money:'ASC'
        };
        if(param.recharge_manage_id){
            var data = await Base.Search({table:'recharge_manage',where,order});
        }else{
            data = await Base.Search({table:'recharge_manage',order});
        }

        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = {isSucc:false,code:202,message:'查询失败',result:data};
        }
        ctx.body = result;
    }

    @request('post', '/system/add-integral-set')
    @summary('添加积分设置')
    @description('example of api')
    @tag
    @body({
        money:{type:'number',required:true},
        integral:{type:'number',required:true},
    })
    static async AddIntegralSet(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        if(param.money && param.integral){
            const data = await Base.Save({table:'integral_set',data:param});
            if(data){
                result = {isSucc:true,code:200,message:'添加成功',result:''};
            }else{
                result = {isSucc:false,code:202,message:'添加失败',result:''};
            }
        }else{
            result = {isSucc:false,code:202,message:'添加失败',result:'参数不全'};
        }
        ctx.body = result;
    }

    @request('post', '/system/update-integral-set')
    @summary('根据id修改积分设置')
    @description('example of api')
    @tag
    @body({
        integral_set_id:{type:'number',required:true},
        money:{type:'number',required:false},
        integral:{type:'number',required:false},
    })
    static async UpdateIntegralSet(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const table = 'integral_set';
        const where = {
            integral_set_id:param.integral_set_id
        };
        delete param.integral_set_id;
        const updates = param;
        if(where.integral_set_id){
            const data = await Base.Update({table,where,updates});
            if(data){
                result = {isSucc:true,code:200,message:'修改成功',result:''};
            }else{
                result = {isSucc:false,code:202,message:'修改失败',result:''};
            }
        }else{
            result = {isSucc:false,code:203,message:'修改失败',result:'参数不全'};
        }
        ctx.body = result;
    }

    @request('get', '/system/search-integral-set')
    @summary('积分设置查询 有id查询单条 没有查询所有')
    @description('example of api')
    @tag
    @query({
        integral_set_id:{type:'number',required:false},
    })
    static async SearchIntegralSet(ctx) {
        let result = null;
        const param = ctx.request.query;
        if(param.integral_set_id){
            var where = {
                integral_set_id:param.integral_set_id
            };
        }else{
            where = {};
        }
        const data = await Base.Search({table:'integral_set',where});
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = {isSucc:false,code:202,message:'查询失败',result:data};
        }
        ctx.body = result;
    }

}

export default SystemLogic;