import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify'; // Importing toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
        userType,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('firstName', response.data.firstName);
        localStorage.setItem('lastName', response.data.lastName);
        localStorage.setItem('profilePicture', response.data.profilePicture || '/default-avatar.jpg');
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', response.data.userId);

        // Show success toast
        toast.success('Logged in successfully!');

        if (userType === 'admin') {
          navigate('/admin');
        } else if (userType === 'person_in_charge') {
          navigate('/personincharge');
        } else if (userType === 'super_admin') {
          navigate('/super-admin');
        } else if (userType === 'student') {
          navigate('/student');
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
      toast.error('Invalid username or password'); // Show error toast
    }
  };

  // React Spring animation for the form and image
  const formAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(50px)' },
    config: { tension: 200, friction: 20 },
  });

  const imageAnimation = useSpring({
    opacity: 1,
    transform: 'translateX(0px)',
    from: { opacity: 0, transform: 'translateX(50px)' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="bg-white shadow-md rounded-lg flex overflow-hidden max-w-5xl h-[600px]">
        <animated.div style={formAnimation} className="w-1/2 p-8">
          <div className="flex items-center mt-10">
            <div className="text-blue-600 text-3xl font-bold">
              <i className="fas fa-wave-square"></i>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-5">Sign in</h2>
          <p className="text-gray-600 mb-6">Please sign in to your account</p>
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Login as</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="admin">Faculty</option>
                <option value="person_in_charge">Person In Charge</option>
                <option value="super_admin">Super Admin</option>
                <option value="student">Student</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Sign in
            </button>
          </form>
        </animated.div>

        <animated.div style={imageAnimation} className="w-1/2">
          <img src="/lcc.jpg" alt="lcc logo" className="w-full h-full object-cover" />
        </animated.div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Login;
