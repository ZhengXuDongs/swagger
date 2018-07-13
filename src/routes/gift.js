import Router from 'koa-router';
const rt = new Router();
import GiftLogic from '../logic/gift';


rt.post('/add-gift', GiftLogic.AddGift);
rt.post('/update-gift', GiftLogic.UpdateGift);
rt.post('/delete-gift', GiftLogic.DeleteGift);
rt.get('/search-gift', GiftLogic.SearchGift);
rt.get('/search-gift-type', GiftLogic.GetGiftType);
rt.post('/add-gift-exchange', GiftLogic.AddGiftExchange);
rt.get('/search-gift-exchange', GiftLogic.SearchGiftExchange);


export default rt;