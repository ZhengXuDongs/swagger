import Base from '../db/base';
const log = require('log4js').getLogger('logic/course');
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
const tag = tags(['Course 课程相关接口']);
const table = 'course';

class CourseLogic {

    @request('post', '/course/add-course')
    @summary('课程添加接口')
    @description('example of api')
    @tag
    @body({
        course_name:{type:'string',required:true,description:'课程名'},
        course_time:{type:'number',required:true,description:'课时长'},
        adapt_age:{type:'string',required:true,description:'适合年龄'},
        min_person:{type:'number',required:true,description:'上课最少人数'},
        max_person:{type:'number',required:true,description:'上课最多人数'},
        course_type:{type:'string',required:true,description:'课程类型'},
        remark:{type:'string',required:false,description:'备注说明'},
    })
    static async AddCourse(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.create_time = moment(new Date()).format();
        param.status = 1;
        if(param.course_name && param.course_time && param.adapt_age && param.min_person && param.max_person && param.course_type && param.remark){
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

    @request('post', '/course/update-course')
    @summary('课程修改接口')
    @description('example of api')
    @tag
    @body({
        course_id:{type:'number',required:true,description:'课程id'},
        course_name:{type:'string',required:false,description:'课程名'},
        course_time:{type:'number',required:false,description:'课时长'},
        adapt_age:{type:'string',required:false,description:'适合年龄'},
        min_person:{type:'number',required:false,description:'上课最少人数'},
        max_person:{type:'number',required:false,description:'上课最多人数'},
        course_type:{type:'string',required:false,description:'课程类型'},
        status:{type:'number',required:false,description:'是否禁用 0禁用 1启用'},
        remark:{type:'string',required:false,description:'备注说明'},
    })
    static async UpdateCourse(ctx) {
        let result = null;
        const param = ctx.request.body;
        param.update_time = moment(new Date()).format();
        const where = {
            course_id:param.course_id
        };
        if(where.course_id){
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

    @request('post', '/course/delete-course')
    @summary('课程删除接口 根据id')
    @description('example of api')
    @tag
    @body({
        course_id:{type:'number',required:true,description:'课程id'},
    })
    static async DeleteCourse(ctx) {
        let result = null;
        const param = ctx.request.body;
        const where = {
            course_id:param.course_id
        };
        if(param.course_id){
            const data = await Base.Delete({table,where});
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

    @request('get', '/course/search-course')
    @summary('课程查询接口 没有id查询所有课程')
    @description('example of api')
    @tag
    @query({
        course_id:{type:'number',required:false,description:'课程id'},
    })
    static async SearchCourse(ctx) {
        let result = null;
        const param = ctx.request.query;
        if(param.course_id){
            var where = {
                course_id:param.course_id
            };
        }else{
            where = {};
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

}

export default CourseLogic;