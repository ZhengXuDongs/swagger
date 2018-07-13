import Base from '../db/base';
const log = require('log4js').getLogger('logic/birthdaySuit');
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
const tag = tags(['BirthdaySuit 生日套餐相关接口']);
const table = 'birthday_suit';

class BirthdaySuitLogic {

    @request('post', '/birthdaySuit/add-birthday-suit')
    @summary('生日套餐添加接口')
    @description('example of api')
    @tag
    @body({
        name:{type:'string',required:true},
        price:{type:'number',required:true},
        status:{type:'number',required:true},
        img_url:{type:'string',required:false,description:'生日套餐图片'},
        description:{type:'string',required:false},
    })
    static async AddBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        if(param.name && param.price && (param.status===0 || param.status===1)){
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

    @request('post', '/birthdaySuit/update-birthday-suit')
    @summary('生日套餐更新接口')
    @description('example of api')
    @tag
    @body({
        birthday_suit_id:{type:'number',required:true},
        name:{type:'string',required:false},
        price:{type:'number',required:false},
        img_url:{type:'string',required:false,description:'生日套餐图片'},
        status:{type:'number',required:false},
        description:{type:'string',required:false},
    })
    static async UpdateBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const where ={
            birthday_suit_id:param.birthday_suit_id
        };
        delete param.birthday_suit_id;
        if(where.birthday_suit_id){
            const data = await Base.Update({table,where,updates:param});
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

    @request('post', '/birthdaySuit/forbid-birthday-suit')
    @summary('生日套餐禁用接口')
    @description('example of api')
    @tag
    @body({
        birthday_suit_id:{type:'number',required:true},
        status:{type:'number',required:true,description:'0禁用 1启用 2删除'},
    })
    static async ForbidBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const where = {
            birthday_suit_id:param.birthday_suit_id
        };
        const updates = {
            status:param.status
        };
        if(param.birthday_suit_id){
            const data = await Base.Update({table,where,updates});
            if(data){
                result = {isSucc:true,code:200,message:'禁用成功',result:''};
            }else{
                result = {isSucc:false,code:202,message:'禁用失败',result:''};
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('get', '/birthdaySuit/search-birthday-suit')
    @summary('生日套餐查询 有id查询单条 没有查询所有')
    @description('example of api')
    @tag
    @query({
        birthday_suit_id:{type:'number',required:false},
    })
    static async SearchBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.query;
        if(param.birthday_suit_id){
            var where = {
                birthday_suit_id:param.birthday_suit_id,
                status:['!=', 2]
            };
        }else{
            where = {
                status:['!=', 2]
            };
        }
        const order = {
            create_time:'DESC'
        };
        const data = await Base.Search({table,where,order});
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('post', '/birthdaySuit/add-reserve-birthday-suit')
    @summary('预定生日套餐添加接口')
    @description('example of api')
    @tag
    @body({
        user_id:{type:'number',required:true},
        birthday_suit_id:{type:'number',required:true},
        reservation_time:{type:'string',required:true},
    })
    static async AddReserveBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        param.status = 0;
        const table = 'birthday_suit_reserve';
        if(param.user_id && param.birthday_suit_id && param.reservation_time){
            const data = await Base.Save({table,data:param});
            if(data){
                result = {isSucc:true,code:200,message:'添加成功',result:{birthday_suit_reserve_id:data}};
            }else{
                result = cfg.message.addFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/birthdaySuit/use-reserve-birthday-suit')
    @summary('预定生日套餐使用接口')
    @description('example of api')
    @tag
    @body({
        birthday_suit_reserve_id:{type:'number',required:true},
    })
    static async UseReserveBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const table = 'birthday_suit_reserve';
        const where = {
            birthday_suit_reserve_id:param.birthday_suit_reserve_id
        };
        delete param.birthday_suit_reserve_id;
        const updates = {
            status:1
        };
        if(where.birthday_suit_reserve_id){
            const data = await Base.Update({table,where,updates});
            if(data){
                result = {isSucc:true,code:200,message:'更新成功',result:{upRows:data}}
            }else{
                result = cfg.message.updateFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/birthdaySuit/search-reserve-birthday-suit')
    @summary('预定生日套餐查询接口 不传参数查询所有')
    @description('example of api')
    @tag
    @body({
        temp:{type:'string',required:false},
        birthday_suit_id:{type:'number',required:false},
        status:{type:'number',required:false,description:'预定生日套餐的状态 0未使用 1已使用'},
    })
    static async SearchReserveBirthdaySuit(ctx) {
        let result = null;
        const param = ctx.request.body;
        const temp = param.temp;//temp为变量，可能是会员号，宝宝姓名，电话
        const birthday_suit_id = param.birthday_suit_id;//套餐id
        const status = param.status;//订购的套餐状态
        var sql1 = '';
        sql1 += 'select a.birthday_suit_reserve_id,a.reservation_time,a.status,b.baby_name,b.members_card_no,b.parent_phone,c.name,c.price,c.img_url from  birthday_suit_reserve as a, user as b,birthday_suit as c where a.user_id=b.uid and a.birthday_suit_id=c.birthday_suit_id';
        if(temp){
            sql1 += ` and (b.baby_name = '${temp}' OR b.parent_phone = '${temp}' or b.members_card_no = '${temp}')`;
        }
        if(birthday_suit_id){
            sql1 += ` and c.birthday_suit_id = '${birthday_suit_id}' `;
        }
        if(status>-1){
            sql1 += ` and a.status = '${status}'`
        }
        sql1 += ';';
        console.log(sql1);
        const data = await Base.search(sql1);
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

}

export default BirthdaySuitLogic;