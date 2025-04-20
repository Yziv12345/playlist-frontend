import { useEffect, useState } from 'react';
import axios from 'axios';
import { Friend } from '../interfaces/Friend';

interface Props {
  playlistId: string;
  onShared?: () => void;
}


const SharePlaylist = ({ playlistId, onShared }: Props) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const loadFriends = async () => {
    const res = await axios.get('http://localhost:5000/api/users/friends', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFriends(res.data);
  };

  const handleShare = async () => {
    if (!selected) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/playlists/${playlistId}/share`,
        { friendId: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Shared ✅');
      if (onShared) onShared();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessage('Already shared with this user');
      } else {
        setMessage('Error sharing playlist');
      }
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div className="mt-3">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border p-1 mr-2"
      >
        <option value="">Select friend</option>
        {friends.map((f) => (
          <option key={f._id} value={f._id}>
            {f.name} ({f.email})
          </option>
        ))}
      </select>
      <button onClick={handleShare} className="bg-blue-600 text-white px-3 py-1 rounded">
        Share
      </button>
      {message && <p className="text-sm mt-1 text-gray-600">{message}</p>}
    </div>
  );
};

export default SharePlaylist;
