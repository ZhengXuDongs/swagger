import Router from 'koa-router';
const rt = new Router();
import CourseLogic from '../logic/course';


rt.post('/add-course', CourseLogic.AddCourse);
rt.post('/update-course', CourseLogic.UpdateCourse);
rt.post('/delete-course', CourseLogic.DeleteCourse);
rt.get('/search-course', CourseLogic.SearchCourse);


export default rt;