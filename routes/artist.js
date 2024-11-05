import express from 'express';
import { info } from '../controllers/artist';

const router = express.Router();
const ARTISTS = 'artists';

router.get(`/${ARTISTS}/:id`, info.handler);

export default router;