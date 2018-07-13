import Router from 'koa-router';
const rt = new Router();
import SysUsersLogic from '../logic/sysUsers';


rt.post('/add-system-users', SysUsersLogic.AddSystemUsers);//系统管理员添加接口
rt.post('/update-system-users', SysUsersLogic.UpdateSystemUsers);//系统管理员修改接口
rt.post('/delete-system-users', SysUsersLogic.DeleteSystemUsers);//系统管理员修改接口
rt.get('/search-system-users', SysUsersLogic.SearchSystemUsers);//系统管理员查询接口
rt.post('/login', SysUsersLogic.LoginUser);//系统管理员登录接口



export default rt;