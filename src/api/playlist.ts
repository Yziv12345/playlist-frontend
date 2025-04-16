import axios from 'axios';

export const fetchMyPlaylists = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:5000/api/playlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
