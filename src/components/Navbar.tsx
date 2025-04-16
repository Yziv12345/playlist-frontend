import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-semibold">🎵 PlaylistApp</Link>
            <div className="flex gap-4 items-center">
                <Link to="/" className="hover:text-blue-400">Home</Link>
                {token && <Link to="/friends" className="hover:text-blue-400">Friends</Link>}
                {!token && <Link to="/login" className="hover:text-blue-400">Login</Link>}
                {!token && <Link to="/register" className="hover:text-blue-400">Register</Link>}
                {token && <button onClick={handleLogout} className="hover:text-red-400">Logout</button>}
            </div>
        </nav>
    );
};

export default Navbar;
