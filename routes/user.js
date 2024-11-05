import express from "express";

import {
  auth,
  topItems
 } from "../controllers/user";

const router = express.Router();
const USER = "user";

router.get(
	`/${USER}/login`,
	auth.redirectToSpotifyAuth,
	auth.handleSpotifyCallback,
	auth.fetchSpotifyUserData
);

router.get(`/${USER}/top`, auth.isAuthenticated, topItems.handler);

export default router;
