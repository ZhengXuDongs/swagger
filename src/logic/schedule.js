import Base from '../db/base';
const log = require('log4js').getLogger('logic/schedule');
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
const tag = tags(['Schedule 课表相关接口']);
const table = 'schedule';

class ScheduleLogic {

    @request('post', '/schedule/add-schedule')
    @summary('课表添加接口')
    @description('example of api')
    @tag
    @body({
        schedule_name:{type:'string',required:true,description:'课表名'},
        schedule_content:{type:'array',required:false,description:'课表内容',
            items: { type: 'object', properties: {
                    week_day: {type: 'number',required:true,description:'周几'},
                    course_time: {type: 'number',required:true,description:'课时长'},
                    course_id: {type: 'number',required:true,description:'课程id'}}}
        },
        week_num:{type:'number',required:true,description:'共几周期'},
        effect_time:{type:'string',required:true,description:'生效时间'},
        remark:{type:'string',required:false,description:'课表说明'},
        section:{type:'number',required:true,description:'课的节数'},
        price:{type:'number',required:true,description:'几节课的钱'},
        status:{type:'number',required:true,description:'状态'},
    })
    static async AddSchedule(ctx) {
        let result = null;
        const param = ctx.request.body;
        console.log(param)
        param.create_time = moment(new Date()).format();
        const content = param.schedule_content;

        if(param.schedule_name && param.week_num && param.effect_time && param.section && param.price && param.status>-1){
            const data = await Base.Save({table,data:param});
            if(data){
                if(content && content.length>0){
                    for(var i=0;i<content.length;i++){
                        const mData = await Base.Search({table:'course',where:{course_id:content[i].course_id}});
                        const paramContent = content[i];
                        paramContent.schedule_id = data;
                        paramContent.course_name = mData[0].course_name;
                        paramContent.create_time = moment(new Date()).format();
                        const pData = await Base.Save({table:'schedule_content',data:paramContent});
                        if(pData){
                            result = cfg.message.addSuccess;
                        }else{
                            result = {isSucc:false,code:202,message:'课表内容添加失败',result:''};
                            await Base.Delete({table,where:{schedule_id:data}});
                            return;
                        }
                    }
                }

            }else{
                result = cfg.message.addFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/update-schedule')
    @summary('课表修改接口')
    @description('example of api')
    @tag
    @body({
        schedule_id:{type:'number',required:true,description:'课表id'},
        schedule_name:{type:'string',required:false,description:'课表名'},
        schedule_content:{type:'array',required:false,description:'课表内容',
            items: { type: 'object', properties: {
                    week_day: {type: 'number',required:false,description:'周几'},
                    course_time: {type: 'number',required:false,description:'课时长'},
                    course_id: {type: 'number',required:false,description:'课程id'}}}
        },
        schedule_content_update:{type:'array',required:false,description:'课表新增内容',
            items: { type: 'object', properties: {
                    schedule_content_id:{type: 'number',required:false,description:'课表内容详情id'},
                    week_day: {type: 'number',required:false,description:'周几'},
                    course_time: {type: 'number',required:false,description:'课时长'},
                    course_id: {type: 'number',required:false,description:'课程id'}}}
        },
        week_num:{type:'number',required:false,description:'共几周期'},
        effect_time:{type:'string',required:false,description:'生效时间'},
        remark:{type:'string',required:false,description:'课表说明'},
        section:{type:'number',required:false,description:'课的节数'},
        price:{type:'number',required:false,description:'几节课的钱'},
        status:{type:'number',required:false,description:'状态'},
    })
    static async UpdateSchedule(ctx) {
        let result = null;
        const param = ctx.request.body;
        console.log(111,param.schedule_id)
        const where = {
            schedule_id:param.schedule_id
        };
        if(param.schedule_content){
            var scheduleContent = param.schedule_content;
        }
        if(param.schedule_content_update){
            var scheduleContentUpdate = param.schedule_content_update;
        }
        delete param.schedule_content_update;
        delete param.schedule_content;
        if(param.schedule_id){
            console.log(param.schedule_id)
            const data = await Base.Update({table,where,updates:param});
            console.log(11111)
            if(data){
                const content = scheduleContent;
                console.log(content);
                if(content){
                    for(var i=0;i<content.length;i++){
                        const mData = await Base.Search({table:'course',where:{course_id:content[i].course_id}});
                        const paramContent = content[i];
                        paramContent.schedule_id = data;
                        paramContent.course_name = mData[0].course_name;
                        paramContent.create_time = moment(new Date()).format();
                        const pData = await Base.SaveThen({table:'schedule_content',data:paramContent,where:{schedule_content_id:paramContent.schedule_content_id}});
                        if(pData){
                            result = cfg.message.updateSuccess;
                        }else{
                            result = {isSucc:false,code:202,message:'课表详情更新添加时报错'};
                            return;
                        }
                    }
                }
                if(scheduleContentUpdate){
                    for(var j=0;j<scheduleContentUpdate.length;j++){
                        const mData = await Base.Search({table:'course',where:{course_id:scheduleContentUpdate[j].course_id}});
                        console.log(222,mData[0])
                        const paramContent = scheduleContentUpdate[j];
                        console.log(444,JSON.stringify(scheduleContentUpdate[j]))
                        paramContent.schedule_content_id = scheduleContentUpdate[j].schedule_content_id;
                        paramContent.course_name = mData[0].course_name;
                        paramContent.course_id = mData[0].course_id;
                        paramContent.update_time = moment(new Date()).format();
                        console.log(33334,JSON.stringify(paramContent))
                        const pData = await Base.Update({table:'schedule_content',where:{schedule_content_id:paramContent.schedule_content_id},updates:paramContent});
                        if(pData){
                            result = cfg.message.updateSuccess;
                        }else{
                            result = {isSucc:false,code:202,message:'课表详情更新时报错'};
                            return;
                        }
                    }
                }

                result = cfg.message.updateSuccess;
            }else{
                result = cfg.message.updateSuccess;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/delete-schedule')
    @summary('课表删除接口')
    @description('example of api')
    @tag
    @body({
        schedule_id:{type:'number',required:true,description:'课表id'},
        status:{type:'number',required:true,description:'状态 2代表删除'},
    })
    static async DeleteSchedule(ctx) {
        let result = null;
        const param = ctx.request.body;
        const where = {
            schedule_id:param.schedule_id
        };
        const updates = {
            status:param.status
        };

        if(param.schedule_id){
            const data = await Base.Update({table:'schedule',where,updates:updates});
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

    @request('get', '/schedule/search-schedule')
    @summary('课表查询接口 不写参数id查询所有')
    @description('example of api')
    @tag
    @query({
        schedule_id:{type:'number',required:false,description:'课表id'},
    })
    static async SearchSchedule(ctx) {
        let result = null;
        const param = ctx.request.query;
        if(param.schedule_id){
            var where = {
                schedule_id:param.schedule_id,
            };
            var content = await Base.Search({table:'schedule_content',where});
        }else{
            where = {
                status:['!=',2]
            };
        }
        const data = await Base.Search({table,where});
        if(data){
            if(param.schedule_id){
                data[0].schedule_content = content;
            }
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/forbid-or-start-schedule')
    @summary('课表启动禁止接口 不写参数id查询所有')
    @description('example of api')
    @tag
    @body({
        schedule_id:{type:'number',required:false,description:'课表id'},
        status:{type:'number',required:false,description:'课表状态 0禁用 1使用'},
    })
    static async ForbidOrStartSchedule(ctx) {
        let result = null;
        const param = ctx.request.body;
        const where = {
            schedule_id:param.schedule_id
        };
        const updates = {
            status:param.status
        };
        const data = await Base.Update({table,where,updates});
        if(data){
            result = cfg.message.updateSuccess;
        }else{
            result = cfg.message.updateFailed;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/add-schedule-order')
    @summary('购买课表订单生成接口')
    @description('example of api')
    @tag
    @body({
        schedule_id:{type:'number',required:false,description:'课表id'},
        user_id:{type:'number',required:false,description:'用户id'},
    })
    static async AddScheduleOrder(ctx) {
        let result = null;
        const param = ctx.request.body;
        if(param.user_id && param.schedule_id){
            var sql1 = `select a.baby_name,a.members_card_no,a.parent_phone,b.* from user as a,schedule as b where a.uid = '${param.user_id}' and b.schedule_id = '${param.schedule_id}';`;
            const scheduleData = await Base.search(sql1);
            if(scheduleData){
                const orderParam = {
                    user_id:param.user_id,
                    schedule_id:param.schedule_id,
                    total_class:scheduleData[0].section,
                    members_card_no:scheduleData[0].members_card_no,
                    baby_name:scheduleData[0].baby_name,
                    user_phone:scheduleData[0].parent_phone,
                    schedule_price:scheduleData[0].price,
                    schedule_name:scheduleData[0].schedule_name,
                    pay_status:0,
                    create_time:moment(new Date()).format()
                };
                const data = await Base.Save({table:'schedule_order',data:orderParam});
                if(data){
                    result = {isSucc:true,code:200,message:'生成订单成功',result:data}
                }else{
                    result = cfg.message.addFailed;
                }
            }else{
                result = cfg.message.addFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/search-schedule-order')
    @summary('已购买课表订单接口 不写参数id查询所有')
    @description('example of api')
    @tag
    @body({
        schedule_order_id:{type:'number',required:false,description:'已购课表订单号'},
        temp:{type:'string',required:false,description:'电话/会员号/宝宝姓名'},
    })
    static async SearchScheduleOrder(ctx) {
        let result = null;
        const param = ctx.request.body;
        const temp = param.temp;
        const schedule_order_id = param.schedule_order_id;
        var sql1 = '';
        sql1 += 'select * from schedule_order';
        if (schedule_order_id) {
            sql1 += ` where schedule_order_id='${schedule_order_id}' `;
        }
        if (temp) {
            sql1 += ` where (baby_name='${temp}' or members_card_no='${temp}' or user_phone='${temp}')`;
        }
        sql1 += ';';
        const data = await Base.search(sql1);
        if(data){
            if(schedule_order_id>-1 && data[0]){
                console.log(JSON.stringify(data[0]));
                const uid  = data[0].user_id;
                var sql2 = `select a.course_name,b.* from schedule_content as a,schedule_reserve as b where a.schedule_content_id=b.schedule_content_id and b.user_id='${uid}' and b.status !=0;`;
                const pData = await Base.search(sql2);
                data[0].schedule_content = pData;
            }
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/add-schedule-reserve')
    @summary('预约课程添加接口')
    @description('example of api')
    @tag
    @body({
        user_id:{type:'number',required:true,description:'用户id'},
        schedule_content_id:{type:'number',required:true,description:'课表内容详情id'},
        week_day:{type:'number',required:true,description:'周几'},
        course_time:{type:'number',required:true,description:'1代表上午 2代表下午'},
        reserve_time:{type:'string',required:true,description:'预约时间'},
    })
    static async AddReserveSchedule(ctx){
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        param.reserve_time = moment(param.reserve_time).format('yyyy-MM-dd');
        if(param.user_id && param.schedule_content_id && param.week_day && param.course_time && param.reserve_time){
            const data = await Base.Save({table:'schedule_reserve',data:param});
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

    @request('post', '/schedule/search-schedule-reserve')
    @summary('预约课程查询接口 reserve_time 格式xxxx-xx-xx,schedule_content_id两个都要传')
    @description('example of api')
    @tag
    @body({
        schedule_content_id:{type:'number',required:false,description:'课表内容详情id'},
        reserve_time:{type:'string',required:false,description:'预约时间 格式xxxx-xx-xx'},
    })
    static async SearchReserveSchedule(ctx) {
        let result = null;
        const param = ctx.request.body;
        var sql1 = '';
        sql1 += 'select a.*,b.course_id,b.course_name,b.schedule_id ' ;
        if(param.schedule_content_id){

        }else{
            sql1 += ',COUNT(\'schedule_content_id\') ';
        }
        sql1 += ' from schedule_reserve as a,schedule_content as b ';
        sql1 += ' where a.schedule_content_id = b.schedule_content_id ';
        if(param.reserve_time){
            sql1 += ` and a.reserve_time='${param.reserve_time}' `;
        }else{
            sql1 += ' GROUP BY a.reserve_time,a.schedule_content_id';
        }

        sql1 += ' ORDER BY a.reserve_time ASC ';
        sql1 += ';';
        console.log('sql1',sql1)
        var data = await Base.search(sql1);
        if(data){
            console.log('xx',data)
            console.log(param.reserve_time ,11, param.schedule_content_id)
            if(param.reserve_time && param.schedule_content_id){
                var sql2 = `select * from schedule_reserve where schedule_content_id='${param.schedule_content_id}' and reserve_time='${param.reserve_time}' `;
                console.log(sql2)
                const pData = await Base.search(sql2);
                // console.log('pData',JSON.stringify(pData))
                var reserveDetailArray = [];
                for(var i=0;i<pData.length;i++){
                    const uid = pData[i].user_id;
                    console.log('uid',uid)
                    var sql3 = `select a.baby_name,a.parent_phone,a.uid,a.members_card_no,b.status from user as a, schedule_reserve as b where a.uid = b.user_id and b.user_id='${uid}' and b.reserve_time='${param.reserve_time}';`;
                    console.log('sql3',sql3)
                    const reserveDetail = await Base.search(sql3);
                    console.log('reserveDetail',JSON.stringify(reserveDetail))
                    if(reserveDetail){
                        reserveDetailArray.push(reserveDetail[0]);
                    }else{
                        result = {isSucc:false,code:202,message:'联合查询用户和预定表时失败'};
                        return;
                    }
                }
                data[0].reserve_detail = reserveDetailArray;
                data = data[0];
            }
            result = {isSucc:true,code:200,message:'查询成功',result:data};
        }else{
            result = cfg.message.searchFailed;
        }
        ctx.body = result;
    }

    @request('post', '/schedule/sign-schedule-reserve')
    @summary('预约课程打卡接口 reserve_time 格式xxxx-xx-xx')
    @description('example of api')
    @tag
    @body({
        user_id:{type:'number',required:true,description:'用户id'},
        schedule_content_id:{type:'number',required:true,description:'课表内容详情id'},
        reserve_time:{type:'string',required:true,description:'预约时间 格式xxxx-xx-xx'},
        status:{type:'number',required:true,description:'打卡状态 1代表已打卡'},
    })
    static async SignScheduleReserve(ctx) {
        let result = null;
        const param = ctx.request.body;
        const where = {
            user_id:param.user_id,
            reserve_time:param.reserve_time,
            schedule_content_id:param.schedule_content_id
        };
        const updates = {
          status:param.status,
            update_time:moment(new Date()).format(),
        };
        if(param.user_id && param.reserve_time && param.schedule_content_id){
            const data = await Base.Update({table:'schedule_reserve',where:where,updates:updates});
            if(data){
                if(param.status===1){
                    const scheduleData = await Base.Search({table:'schedule_content',where:{schedule_content_id:param.schedule_content_id}});
                    const scheduleId = scheduleData[0].schedule_id;
                    const scheduleOrder = await Base.Search({table:'schedule_order',where:{schedule_id:scheduleId,user_id:param.user_id}});
                    console.log('121',scheduleOrder[0]);
                    const hadClass = scheduleOrder[0].had_class;
                    const schedule_order_id = scheduleOrder[0].schedule_order_id;
                    const updateScheduleOrder = {
                        had_class:hadClass+1
                    };
                    const upDates = await Base.Update({table:'schedule_order',where:{schedule_order_id:schedule_order_id},updates:updateScheduleOrder});
                }
                result = cfg.message.updateSuccess;
            }else{
                result = cfg.message.updateFailed;
            }
        }else{
            result = cfg.message.paramErr;
        }
        ctx.body = result;
    }


}


export default ScheduleLogic;