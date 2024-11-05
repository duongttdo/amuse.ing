import axios from "axios";
import getSpotifyAccessToken from "../../spotifyAuth";

const handler = async (req, res) => {
	const { id } = req.params;

	try {
		const accessToken = await getSpotifyAccessToken();
		const spotifyUrl = `https://api.spotify.com/v1/tracks/${id}`;

		const response = await axios.get(spotifyUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		res.status(200).json(response.data);
	} catch (error) {
		console.error("Error fetching track data:", error);
		res.status(500).json({ message: "Failed to fetch track data" });
	}
};

export default handler;
