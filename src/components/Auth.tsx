import { useState } from 'react';
import { Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, sendPasswordResetEmail, updatePassword, isRecovering } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isRecovering) {
        const { error } = await updatePassword(password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Password updated successfully. You can now sign in.');
        }
      } else if (isForgotPassword) {
        const { error } = await sendPasswordResetEmail(email);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the password reset link');
        }
      } else {
        const { error } = isLogin
          ? await signIn(email, password)
          : await signUp(email, password, fullName);

        if (error) {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CertifyHub</h1>
          <p className="text-gray-600">
            {isRecovering ? 'Set your new password' : isForgotPassword ? 'Reset your password' : 'Professional Certificate Management Platform'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isForgotPassword && !isRecovering && (
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-1 text-sm rounded-md font-medium transition-all ${isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-1 text-sm rounded-md font-medium transition-all ${!isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && !isRecovering && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            {!isRecovering && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            )}

            {!isForgotPassword && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {isRecovering ? 'New Password' : 'Password'}
                  </label>
                  {isLogin && !isRecovering && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            {!isForgotPassword && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                    defaultChecked
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                </label>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-xs">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Please wait...' : isRecovering ? 'Update Password' : isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {isForgotPassword && !isRecovering && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium py-1"
              >
                Back to Sign In
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
