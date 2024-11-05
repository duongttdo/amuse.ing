import axios from 'axios';

const handler = async (req, res) => {
	const { type, limit, time_range } = req.query;

	if (!["artists", "tracks"].includes(type)) {
		return res
			.status(400)
			.json({ error: 'Invalid type. Must be "artists" or "tracks".' });
	}

	try {
		const topItems = await getUserTopItems(
			req.session.spotifyAccessToken,
			type,
			limit,
			time_range
		);
		res.status(200).json({ topItems });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUserTopItems = async (
	accessToken,
	type = "artists",
	limit = 10,
	time_range = "medium_term"
) => {
	const url = `https://api.spotify.com/v1/me/top/${type}`;

	const params = {
		limit,
		time_range, 
	};

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			params,
		});
		return response.data.items;
	} catch (error) {
		throw new Error(
			error.response ? error.response.data.error.message : error.message
		);
	}
};

export default handler; 