/** source/routes/posts.ts */
import express from 'express';
import controller from './posts';
const router = express.Router();


router.get('/mint', controller.getMint);

export default router;