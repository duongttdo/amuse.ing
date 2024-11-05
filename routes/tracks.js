import express from "express";
import { info } from "../controllers/tracks";

const router = express.Router();
const TRACKS = "tracks";

router.get(`/${TRACKS}/:id`, info.handler);

export default router;
