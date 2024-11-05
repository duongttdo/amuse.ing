import axios from "axios";
import getSpotifyAccessToken from "../spotifyAuth";

const handler = async (req, res) => {
  const { q, type } = req.query;
  
  if (!q || !type) {
    return res.status(400).json({ error: 'Search param is required.' });
  };

  try {
    const accessToken = await getSpotifyAccessToken();

    const response = await axios.get("https://api.spotify.com/v1/search", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			params: {
				q: decodeURIComponent(q),
        type: type,
        limit: 1
			},
    });
    
    const results = {
			albums: response.data.albums ? response.data.albums.items : [],
			artists: response.data.artists ? response.data.artists.items : [],
			tracks: response.data.tracks ? response.data.tracks.items : [],
    };

    res.status(200).json({ spotify: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;