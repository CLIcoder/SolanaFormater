/** source/routes/posts.ts */
import express from 'express';
import mintAuth from './middlware';
import controller from './posts';
const router = express.Router();


router.get('/mint', mintAuth ,controller.getMint);

export default router;