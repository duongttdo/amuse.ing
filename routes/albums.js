import express from "express";
import { info } from "../controllers/albums";

const router = express.Router();
const ALBUMS = "albums";

router.get(`/${ALBUMS}/:id`, info.handler);

export default router;
