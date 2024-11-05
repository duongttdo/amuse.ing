import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

let spotifyAccessToken = null;
let accessTokenExpiry = null;

async function getSpotifyAccessToken() {
	if (spotifyAccessToken && Date.now() < accessTokenExpiry) {
		return spotifyAccessToken;
	}

	try {
		const tokenUrl = "https://accounts.spotify.com/api/token";
		const authHeader = Buffer.from(
			`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
		).toString("base64");

		const response = await axios.post(
			tokenUrl,
			`grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
			{
				headers: {
					Authorization: `Basic ${authHeader}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		spotifyAccessToken = response.data.access_token;
		accessTokenExpiry = Date.now() + response.data.expires_in * 1000;
		
		return spotifyAccessToken;
	} catch (error) {
		console.error("Error fetching Spotify access token:", error);
		throw new Error("Failed to authenticate with Spotify");
	}
}

export default getSpotifyAccessToken;
