import Router from 'koa-router';
const rt = new Router();
import BirthdaySuitLogic from '../logic/birthdaySuit';

rt.post('/add-birthday-suit', BirthdaySuitLogic.AddBirthdaySuit);
rt.post('/update-birthday-suit', BirthdaySuitLogic.UpdateBirthdaySuit);
rt.post('/forbid-birthday-suit', BirthdaySuitLogic.ForbidBirthdaySuit);
rt.get('/search-birthday-suit', BirthdaySuitLogic.SearchBirthdaySuit);

rt.post('/add-reserve-birthday-suit', BirthdaySuitLogic.AddReserveBirthdaySuit);
rt.post('/use-reserve-birthday-suit', BirthdaySuitLogic.UseReserveBirthdaySuit);
rt.post('/search-reserve-birthday-suit', BirthdaySuitLogic.SearchReserveBirthdaySuit);
export default rt;