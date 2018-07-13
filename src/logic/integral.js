import Base from '../db/base';
const log = require('log4js').getLogger('logic/integral');
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
const tag = tags(['Integral 积分相关接口']);
const table = 'integral';

class IntegralLogic {

    @request('get', '/integral/search-integral')
    @summary('积分详情列表查询接口 ')
    @description('example of api')
    @tag
    @query({
        integral_id:{type:'number',required:false,description:'积分明细id'},
        temp:{type:'string',required:false,description:'会员号/宝宝姓名/电话'},
        use_type:{type:'number',required:false,description:'使用方式 1赠送 2兑换'},
    })
    static async SearchIntegral(ctx) {
        let result = null;
        const param = ctx.request.query;
        var sql1 = 'select a.baby_name,a.members_card_no,a.parent_phone,b.* from user as a,integral as b ';
        sql1 += ' where a.uid = b.user_id ';
        if(param.temp){
            sql1 += ` and (a.members_card_no like '%${param.temp}%' or a.baby_name like '%${param.temp}%' or a.parent_phone like '%${param.temp}%') `;
        }
        if(param.use_type){
            sql1 += ` and b.use_type=${param.use_type} `;
        }
        if(param.integral_id){
            sql1 += ` and b.integral_id=${param.integral_id} `
        }
        sql1 += ';';
        const data = await Base.search(sql1);
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else {
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }


}

export default  IntegralLogic;