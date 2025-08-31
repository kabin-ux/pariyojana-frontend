import { useState, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/bg4.png';
import toplogo from '../assets/toplogo.png';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/hooks';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface LoginResponse {
  access: string;
  refresh: string;
  id?: number;
  full_name: string;
  email?: string;
  role:
    | 'admin'
    | 'planning section'
    | 'ward/office seceratery'
    | 'engineer'
    | 'ward engineer'
    | 'user committee'
    | 'Data Entry'
    | 'Department chief';
  ward_no?: number;
}

const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>(localStorage.getItem('saved_email') || '');
  const [password, setPassword] = useState<string>(localStorage.getItem('saved_password') || '');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(
    localStorage.getItem('remember_me') === 'true'
  );

  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      const data: LoginResponse = res.data;

      if (rememberMe) {
        localStorage.setItem('saved_email', email);
        localStorage.setItem('saved_password', password);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('saved_email');
        localStorage.removeItem('saved_password');
        localStorage.setItem('remember_me', 'false');
      }

      const userData = {
        id: data.id ?? 0,
        full_name: data.full_name,
        role: data.role,
      };

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      login(userData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = async () => {
    setForgotMessage('');
    setForgotError('');

    try {
      await axios.post('http://213.199.53.33/api/auth/forgot-password/', {
        email: forgotEmail,
      });
      setForgotMessage('A new password has been sent to your email.');
      setForgotEmail('');
    } catch (error) {
      setForgotError('Failed to send email. Please try again.');
    }
  };

  return (
    <div
      className="flex bg-cover bg-center h-screen w-screen overflow-hidden"
      style={{ backgroundImage: `url(${logo})` }}
    >
      <div className="flex-1 relative hidden md:block" />

      <div className="w-165 flex items-center justify-center relative backdrop-blur-sm bg-slate-600/90 rounded-lg">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-opacity-40" />
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="flex flex-col w-20 h-20 mb-6 rounded-full shadow-lg items-center justify-center">
            <img src={toplogo} alt="Top Logo" className="bg-transparent" />
          </div>

          <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleLogin}>
            <h2 className="text-3xl font-bold text-white text-center drop-shadow-lg">
              परियोजना व्यवस्थापन प्रणाली
            </h2>
            <p className="text-center font-medium text-white drop-shadow-lg">
              बर्दगोरिया गाउँपालिकाको गाउँ कार्यपालिकाको कार्यालय
            </p>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900 bg-opacity-50 p-2 rounded">
                {error}
              </p>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-1 drop-shadow">इमेल</label>
              <input
                type="email"
                placeholder="इमेल"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-90 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-1 drop-shadow">पासवर्ड</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="पासवर्ड"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-90 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-white drop-shadow">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => setShowForgotDialog(true)}
                className="text-blue-300 hover:text-blue-100 underline drop-shadow"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg font-semibold cursor-pointer"
            >
              लगइन गर्नुहोस्
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {showForgotDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full mb-3"
            />
            {forgotMessage && (
              <p className="text-green-600 text-sm mb-2">{forgotMessage}</p>
            )}
            {forgotError && (
              <p className="text-red-600 text-sm mb-2">{forgotError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgotDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;