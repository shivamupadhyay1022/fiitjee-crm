import React, { useState } from 'react';

interface SignInProps {
  onSignIn: (email: string, pass: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onSwitchToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onGoogleSignIn, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSignIn(email, password);
    } catch (err: any) {
      switch (err.message) {
        case 'EMPLOYEE_NOT_FOUND':
          setError('You are not authorized to access this platform.');
          break;
        case 'EMPLOYEE_NOT_APPROVED':
          setError('Ask admin to approve your account');
          break;
        default:
          if (err.code === 'auth/invalid-credential') {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else {
            setError('An unexpected error occurred during sign-in.');
          }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    setLoading(true);
    try {
      await onGoogleSignIn();
    } catch (err: any) {
       if (err.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do not show an error.
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in with your original method.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="https://i.ibb.co/yqg2L2W/image.png" alt="FIITJEE Logo" className="w-12 h-12 rounded-lg mr-3" />
              <h1 className="text-4xl font-extrabold tracking-tight font-orbitron text-slate-800 dark:text-white">FIITJEE CRM</h1>
            </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to access your dashboard</p>
        </div>
        
        {error && (
            <p className="text-lg text-center font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-700 animate-pulse">
                {error}
            </p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:bg-gray-100"
          >
            <svg className="w-5 h-5 mr-2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Google</title>
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-5.993 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .333 5.393.333 12.16s5.534 12.16 12.147 12.16c3.2 0 5.6-1.027 7.44-2.96 1.987-2.053 2.56-4.96 2.56-7.667 0-.8-.053-1.6-.187-2.4H12.48z" fill="#4285F4"/>
            </svg>
            Sign in with Google
          </button>
        </div>
        
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignUp(); }} className="font-medium text-red-600 hover:text-red-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;