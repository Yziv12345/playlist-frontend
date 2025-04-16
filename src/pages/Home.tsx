import { useEffect, useState } from 'react';
import { fetchMyPlaylists } from '../api/playlist';
import AddPlaylist from '../components/AddPlaylist';
import { Playlist } from '../interfaces/PlayList';
import SharePlaylist from '../components/SharePlaylist';
import CastPlaylist from '../components/CastPlaylist';

const Home = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMyPlaylists();
                setPlaylists(data);
            } catch (err) {
                console.error('Error loading playlists', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">🎧 My Playlists</h1>
            <AddPlaylist onAdd={(newPlaylist) => setPlaylists((prev) => [...prev, newPlaylist])} />
            {loading ? (
                <p>Loading...</p>
            ) : playlists.length === 0 ? (
                <p className="text-gray-500">No playlists yet.</p>
            ) : (
                <ul className="space-y-4">
                    {playlists.map((playlist) => (
                        <li key={playlist._id} className="bg-white p-4 rounded shadow">
                            <h3 className="text-xl font-semibold">{playlist.title}</h3>
                            <p className="text-sm text-gray-600">Platform: {playlist.platform}</p>
                            <a href={playlist.url} target="_blank" className="text-blue-600 underline">
                                Open Playlist
                            </a>
                            <SharePlaylist playlistId={playlist._id} />
                            <CastPlaylist playlistId={playlist._id} onCast={() => setPlaylists((prev) => [...prev])} />

                        </li>
                        
                    ))}
                </ul>
            )}
        </div>
    );

};

export default Home;
