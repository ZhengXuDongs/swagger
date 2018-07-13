import Router from 'koa-router';
const rt = new Router();
import ScheduleLogic from '../logic/schedule';


rt.post('/add-schedule', ScheduleLogic.AddSchedule);
rt.post('/update-schedule', ScheduleLogic.UpdateSchedule);
rt.post('/delete-schedule', ScheduleLogic.DeleteSchedule);
rt.get('/search-schedule', ScheduleLogic.SearchSchedule);
rt.post('/forbid-or-start-schedule', ScheduleLogic.ForbidOrStartSchedule);
rt.post('/add-schedule-order', ScheduleLogic.AddScheduleOrder);
rt.post('/search-schedule-order', ScheduleLogic.SearchScheduleOrder);
rt.post('/add-schedule-reserve', ScheduleLogic.AddReserveSchedule);
rt.post('/search-schedule-reserve', ScheduleLogic.SearchReserveSchedule);
rt.post('/sign-schedule-reserve', ScheduleLogic.SignScheduleReserve);


export default rt;