import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        console.log('LOGIN SUCCESS:', response.data);
        login(response.data.user);
        localStorage.setItem('token', response.data.token);
        alert('Successfully logged in');
        navigate(
          response.data.user.role === 'admin'
            ? '/admin-dashboard'
            : '/employee-dashboard'
        );
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Server error. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-gray-200">
      <div className="bg-white shadow-xl rounded-xl px-8 py-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-2">
          Employee Management System
        </h2>
        <h3 className="text-lg font-semibold text-center mb-4">Login</h3>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-teal-600" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-teal-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;