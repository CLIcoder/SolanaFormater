/** source/routes/posts.ts */
import express from 'express';
import controller from './posts';
const router = express.Router();


router.get('/mint/:id', controller.getMint);

export default router;