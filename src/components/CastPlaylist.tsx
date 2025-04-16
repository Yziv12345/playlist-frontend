import { useState } from 'react';
import axios from 'axios';

interface Props {
  playlistId: string;
  onCast?: () => void;
}

const CastPlaylist = ({ playlistId, onCast }: Props) => {
  const [target, setTarget] = useState<'spotify' | 'youtube'>('spotify');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleCast = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/playlists/${playlistId}/cast`,
        { targetPlatform: target },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage(`Playlist cast to ${target}`);
      if (onCast) onCast();
    } catch (err) {
      setMessage('Failed to cast playlist');
    }
  };

  return (
    <div className="mt-2">
      <select
        className="border p-1 mr-2"
        value={target}
        onChange={(e) => setTarget(e.target.value as 'spotify' | 'youtube')}
      >
        <option value="spotify">Cast to Spotify</option>
        <option value="youtube">Cast to YouTube</option>
      </select>
      <button onClick={handleCast} className="bg-purple-600 text-white px-3 py-1 rounded">
        Cast
      </button>
      {message && <p className="text-sm mt-1 text-gray-500">{message}</p>}
    </div>
  );
};

export default CastPlaylist;
