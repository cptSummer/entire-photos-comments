import express from 'express';
import ping from '../controllers/ping';
import comments from "./comments";

const router = express.Router();

router.get('/ping', ping);

router.use('/api/comments', comments);

export default router;
