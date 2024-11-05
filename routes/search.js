import express from "express";
import handler from "../controllers/search/index";

const router = express.Router();
const SEARCH = "search";

router.get(`/${SEARCH}`, handler);

export default router;
