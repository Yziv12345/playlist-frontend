import { useState } from 'react';
import axios from 'axios';
import { Playlist } from '../interfaces/PlayList';

interface Props {
    onAdd: (newPlaylist: Playlist) => void;
}

const AddPlaylist = ({ onAdd }: Props) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<'spotify' | 'youtube'>('youtube');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/playlists',
        { title, url, platform },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const newPlaylist: Playlist = response.data;
      setTitle('');
      setUrl('');
      setPlatform('youtube');
      setMessage('Playlist added ✅');
      onAdd(newPlaylist); // Refresh playlists
    } catch (err) {
      setMessage('Failed to add playlist');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
      <h2 className="text-lg font-semibold">➕ Add Playlist</h2>
      <input
        type="text"
        placeholder="Playlist Title"
        className="w-full border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="Playlist URL"
        className="w-full border p-2"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <select
        className="w-full border p-2"
        value={platform}
        onChange={(e) => setPlatform(e.target.value as 'spotify' | 'youtube')}
      >
        <option value="youtube">YouTube</option>
        <option value="spotify">Spotify</option>
      </select>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Playlist
      </button>
      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
    </form>
  );
};

export default AddPlaylist;
