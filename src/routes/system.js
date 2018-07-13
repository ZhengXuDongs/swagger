import Router from 'koa-router';
const rt = new Router();
import SystemLogic from '../logic/system';


rt.post('/add-recharge', SystemLogic.AddRechargeManage);//充值管理添加接口
rt.post('/update-recharge',SystemLogic.UpdateRechargeManage);//充值管理修改接口
rt.post('/delete-recharge',SystemLogic.DeleteRechargeManage);//充值管理删除接口
rt.get('/search-recharge',SystemLogic.SearchRechargeManage);//充值管理查询接口
rt.post('/add-integral-set',SystemLogic.AddIntegralSet);//添加积分设置
rt.post('/update-integral-set',SystemLogic.UpdateIntegralSet);//修改积分设置
rt.get('/search-integral-set',SystemLogic.SearchIntegralSet);//查询积分设置


export default rt;