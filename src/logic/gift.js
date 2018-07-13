import Base from '../db/base';
const log = require('log4js').getLogger('logic/gift');
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
const tag = tags(['Gift 礼物相关接口']);
const table = 'gift';

class UsersLogic {

    @request('post', '/gift/add-gift')
    @summary('礼品添加接口')
    @description('example of api')
    @tag
    @body({
        gift_name:{type:'string',required:true,description:'礼品名'},
        img_url:{type:'string',required:false,description:'图片路径'},
        integral:{type:'number',required:true,description:'积分兑换数量'},
        inventory:{type:'number',required:true,description:'库存'},
        gift_type:{type:'number',required:true,description:'分类'},
        remark:{type:'string',required:false,description:'备注说明'},
    })
    static async AddGift(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        if(param.gift_name && param.integral && param.inventory && param.gift_type){
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

    @request('post', '/gift/update-gift')
    @summary('礼品修改接口')
    @description('example of api')
    @tag
    @body({
        gift_id:{type:'number',required:true,description:'礼品编号'},
        gift_name:{type:'string',required:false,description:'礼品名'},
        img_url:{type:'string',required:false,description:'图片路径'},
        integral:{type:'number',required:false,description:'积分兑换数量'},
        inventory:{type:'number',required:false,description:'库存'},
        gift_type:{type:'number',required:false,description:'分类'},
        remark:{type:'string',required:false,description:'备注说明'},
    })
    static async UpdateGift(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const where = {
            gift_id:param.gift_id
        };
        if(param.gift_id){
            const data = await Base.Update({table,where,updates:param});
            if(data){
                result = {isSucc:true,code:200,message:'更新成功',result:data};
            }else{
                result = cfg.message.updateFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/gift/delete-gift')
    @summary('礼品删除接口')
    @description('example of api')
    @tag
    @body({
        gift_id:{type:'number',required:true,description:'礼品编号'},
        status:{type:'number',required:true,description:'状态 0禁用 1启用 2删除'},
    })
    static async DeleteGift(ctx) {
        let result = null;
        const param = ctx.request.body;
        const where = {
            gift_id:param.gift_id
        };
        const updates = {
            status:param.status
        };
        if(param.gift_id && param.status>-1){
            const data = await Base.Update({table,where,updates});
            if(data){
                result = {isSucc:true,code:200,message:'更新成功',result:data};
            }else{
                result = cfg.message.updateFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('get', '/gift/search-gift')
    @summary('礼品查询接口 没有id查询所有,编号和名称只能传一个')
    @description('example of api')
    @tag
    @query({
        gift_id:{type:'number',required:false,description:'礼品编号'},
        temp:{type:'string',required:false,description:'礼品名称或礼品id'},
    })
    static async SearchGift(ctx){
        let result = null;
        const param = ctx.request.query;
        var sql1 = 'select g.*,gt.gift_type_name from gift as g,gift_type as gt where g.gift_type=gt.gift_type_id and status!=2';

        if(param.gift_id){
            sql1 += ` and g.gift_id='${param.gift_id}' `;
        }
        if(param.temp){
            sql1 += ` and (g.gift_id='${param.temp}' or g.gift_name like '%${param.temp}%') `;
        }
        sql1 += ';';
        console.log(sql1)
        const data = await Base.search(sql1);
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('get', '/gift/search-gift-type')
    @summary('礼品类型查询接口 ')
    @description('example of api')
    @tag
    @query({

    })
    static async GetGiftType(ctx) {
        let result = null;
        const data = await Base.Search({table:'gift_type'});
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('post', '/gift/add-gift-exchange')
    @summary('礼品兑换添加接口')
    @description('example of api')
    @tag
    @body({
        user_id:{type:'number',required:true,description:'用户id'},
        gift_id:{type:'number',required:true,description:'礼品id'},
        integral:{type:'number',required:true,description:'此次兑换使用总积分'},
        gift_num:{type:'number',required:true,description:'此次兑换礼品数量'},
    })
    static async AddGiftExchange(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        if(param.user_id && param.gift_id && param.integral && param.gift_num){
            const data = await Base.Save({table:'gift_exchange',data:param});
            if(data){
                const userData = await Base.Search({table:'user',where:{uid:param.user_id}});
                const giftData = await Base.Search({table:'gift',where:{gift_id:param.gift_id}});
                const giftName = giftData[0].gift_name;
                const integralNow = userData[0].integral-param.integral;
                const inventoryNow = giftData[0].inventory - param.gift_num;
                const exchangedQuantity = giftData[0].exchanged_quantity;
                const updatesIntegral = {
                    integral:integralNow
                };
                const upInventory = {
                    inventory:inventoryNow,
                    exchanged_quantity:exchangedQuantity+param.gift_num
                };
                const upUserIntegral = await Base.Update({table:'user',where:{uid:param.user_id},updates:updatesIntegral});
                const upGiftInventory = await Base.Update({table:'gift',where:{gift_id:param.gift_id},updates:upInventory});
                if(upUserIntegral){
                    if(upGiftInventory){
                        const integralData = {
                            user_id:param.user_id,
                            use_type:2,
                            integral:param.integral,
                            create_time:moment(new Date()).format(),
                            remark:`兑换${giftName}礼品${param.gift_num}个`
                        };
                        const SaveIntegral = await Base.Save({table:'integral',data:integralData});
                        result = cfg.message.addSuccess;
                    }else{
                        const upUserIntegrals = await Base.Update({table:'user',where:{uid:param.user_id},updates:{integral:userData[0].integral}});
                        const deleteGiftExchange = await Base.Delete({table:'gift_exchange',where:{gift_exchange_id:data}});
                        log.info(`upUserIntegrals的值为${upUserIntegrals},deleteGiftExchange的值为：${deleteGiftExchange}`);
                        result = cfg.message.addFailed;
                    }
                }else{
                    const deleteGiftExchange = await Base.Delete({table:'gift_exchange',where:{gift_exchange_id:data}});
                    log.info(`deleteGiftExchange删除的行数的值为：${deleteGiftExchange}`);
                    result = cfg.message.addFailed;
                }
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('get', '/gift/search-gift-exchange')
    @summary('礼品兑换查询接口')
    @description('example of api')
    @tag
    @query({
        temp:{type:'string',required:false,description:'会员卡号,宝宝姓名,联系电话'},
    })
    static async SearchGiftExchange(ctx) {
        let result = null;
        const param = ctx.request.query;
        var sql1 = 'select u.uid,u.baby_name,u.members_card_no,u.parent_phone,g.gift_id,g.gift_name,ge.integral,ge.gift_num,ge.create_time from ';
        sql1 += ' gift_exchange as ge,gift as g,user as u ';
        sql1 += ' where ge.user_id=u.uid and ge.gift_id=g.gift_id ';
        if(param.temp){
            sql1 += ` and (u.members_card_no='${param.temp}' or u.baby_name='${param.temp}' or u.parent_phone='${param.temp}') `
        }
        sql1 += 'order by ge.create_time DESC;';
        console.log(sql1)
        const data = await Base.search(sql1);
        if(data){
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

}

export default UsersLogic;