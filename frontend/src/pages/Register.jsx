import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains letters', met: /[a-zA-Z]/.test(formData.password) },
    { text: 'Passwords match', met: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-subtle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-300 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-subtle" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-primary-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-hard">
              <span className="text-white font-bold text-3xl">M</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-medium">
              <SparklesIcon className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Join MittArv
          </h2>
          <p className="text-lg text-secondary-600 mb-6">
            Start your storytelling journey today
          </p>
          <p className="text-sm text-secondary-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass shadow-hard sm:rounded-3xl sm:px-10 px-4 py-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center space-x-3 animate-slide-up">
                <div className="flex-shrink-0">
                  <XCircleIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-secondary-700 mb-3">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input pl-12 text-lg"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-3">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input pl-12 text-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-12 pr-12 text-lg"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-secondary-700 mb-3">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input pl-12 pr-12 text-lg"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm font-medium text-secondary-700">Password requirements:</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {req.met ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-secondary-300" />
                      )}
                      <span className={`text-sm ${req.met ? 'text-green-600' : 'text-secondary-500'}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms and Privacy */}
            <div className="text-sm text-secondary-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700 underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                Privacy Policy
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !passwordRequirements.every(req => req.met)}
                className="btn btn-primary w-full py-4 text-lg font-semibold relative overflow-hidden disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating your account...</span>
                  </div>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-secondary-500 font-medium">Or sign up with</span>
              </div>
            </div>

            {/* Social Registration */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn btn-secondary py-3 text-sm font-medium"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="btn btn-secondary py-3 text-sm font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
