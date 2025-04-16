import { useState, useEffect } from 'react';
import axios from 'axios';

interface Friend {
  id: string;
  name: string;
  email: string;
}

const Friends = () => {
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchFriends = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/friends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(res.data);
    } catch (err) {
      console.error('Failed to load friends', err);
    }
  };

  const handleSearch = async () => {
    setMessage('');
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResult(res.data);
    } catch (err: any) {
      setSearchResult(null);
      if (err?.response?.status === 404) setMessage('User not found');
    }
  };

  const handleAddFriend = async () => {
    if (!searchResult) return;

    try {
      await axios.post(
        'http://localhost:5000/api/users/add-friend',
        { friendId: searchResult.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Friend added 🎉');
      setSearchResult(null);
      fetchFriends();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setMessage('Already friends!');
      } else {
        setMessage('Failed to add friend');
      }
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">👯‍♂️ Friends</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Add a Friend</h2>
        <input
          type="email"
          placeholder="Search by email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Search
        </button>

        {searchResult && (
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <p>
              <strong>{searchResult.name}</strong> ({searchResult.email})
            </p>
            <button onClick={handleAddFriend} className="bg-green-600 text-white px-3 py-1 mt-2 rounded">
              Add Friend
            </button>
          </div>
        )}

        {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Your Friends</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet.</p>
        ) : (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f.id} className="border-b pb-2">
                {f.name} – <span className="text-sm text-gray-500">{f.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Friends;
