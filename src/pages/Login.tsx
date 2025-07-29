import { useState, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/bg4.png';
import toplogo from '../assets/toplogo.png';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/hooks';
import { Eye, EyeOff } from 'lucide-react';

interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  full_name: string;
  email?: string;
  role: "admin" | "planning section" | "ward/office seceratery" | "engineer" | "ward engineer" | "user committee" | "Data Entry" | "Department chief";
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

    // Prepare user data for storage and context
    const userData = {
      user_id: data.user_id,
      full_name: data.full_name,
      role: data.role,
    };

    // Store tokens and user data
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(userData));

    // Pass the user data to your auth context
    login(userData);

    navigate('/');
  } catch (err) {
    console.error('Login error:', err);
    setError('Invalid email or password');
  }
};

  return (
    <div
      className="flex bg-cover bg-center h-screen w-screen overflow-hidden"
      style={{ backgroundImage: `url(${logo})` }}
    >
      {/* Left Side - Clear Image */}
      <div className="flex-1 relative hidden md:block" />

      {/* Right Side - Login Form */}
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
    </div>
  );
};

export default LoginPage;
