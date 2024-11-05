import axios from "axios";

// Middleware to redirect to Spotify authorization URL
export const redirectToSpotifyAuth = (req, res, next) => {
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
	const scopes = "user-read-private user-read-email user-top-read"; // Modify scopes based on your requirements

	const authUrl =
		`https://accounts.spotify.com/authorize?` +
		`client_id=${clientId}` +
		`&response_type=code` +
		`&redirect_uri=${encodeURIComponent(redirectUri)}` +
		`&scope=${encodeURIComponent(scopes)}`;

	// Redirect to Spotify if there's no authorization code in quer
	if (!req.query.code) {
		return res.redirect(authUrl);
	}

	next(); // If there's a code, proceed to the next middleware
};

// Middleware to handle callback and exchange code for an access token
export const handleSpotifyCallback = async (req, res, next) => {
	const { code } = req.query;

	if (!code) {
		return res.status(400).json({ error: "Authorization code is missing" });
	}

	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
				client_id: process.env.SPOTIFY_CLIENT_ID,
				client_secret: process.env.SPOTIFY_CLIENT_SECRET,
			})
		);

		req.session.spotifyAccessToken = response.data.access_token;
		next(); // Pass control to the next middleware with access token available
	} catch (error) {
		console.error("Error exchanging code for access token:", error);
		res.status(500).json({ error: "Failed to get access token" });
	}
};

// Middleware to fetch user data with the access token
export const fetchSpotifyUserData = async (req, res) => {
  const accessToken = req.session.spotifyAccessToken;
  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

	try {
		const response = await axios.get("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		// Send user data as response, or handle it as necessary
		res.json({ spotifyUserData: response.data });
	} catch (error) {
		console.error("Error fetching Spotify user data:", error);
		res.status(500).json({ error: "Failed to fetch user data from Spotify" });
	}
};

export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.spotifyAccessToken) {
    next();
  } else  {
    res.status(401).json({ error: 'Unauthorized. Please log in to access this resource.' });
  }
};
