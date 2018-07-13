import Router from 'koa-router';
const rt = new Router();
import IntegralLogic from '../logic/integral';


rt.get('/search-integral', IntegralLogic.SearchIntegral);


export default rt;