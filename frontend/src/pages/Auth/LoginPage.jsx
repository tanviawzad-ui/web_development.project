import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('ramesh.sharma@example.in');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(redirect);
    } else {
      setError(result.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-secondary-container shadow-md">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_hospital
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-title-lg text-2xl tracking-tight text-primary leading-tight font-display font-bold">
              MediCare
            </span>
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">
              Multispeciality Hospital
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-primary font-display">
          Sign in to Patient Portal
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          Access your digital health dossier, appointments, and NABL lab records
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-xl border border-surface-container rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-primary">
                Registered Email Address *
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.in"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-outline text-[20px]">
                  mail
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-primary">
                  Password *
                </label>
                <a href="#forgot" className="text-xs text-secondary hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-outline text-[20px]">
                  lock
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Box */}
          <div className="mt-6 pt-4 border-t border-surface-container">
            <p className="text-xs text-on-surface-variant font-semibold mb-2">⚡ Quick Test Logins:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('ramesh.sharma@example.in', 'Password123!')}
                className="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container text-primary rounded-lg text-xs font-semibold text-left border border-surface-container"
              >
                👤 Demo Patient
                <span className="block text-[10px] text-on-surface-variant font-normal">ramesh.sharma@example.in</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@medicare.com', 'Admin123!')}
                className="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container text-primary rounded-lg text-xs font-semibold text-left border border-surface-container"
              >
                🛡️ Hospital Admin
                <span className="block text-[10px] text-on-surface-variant font-normal">admin@medicare.com</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-on-surface-variant">
            Don't have a hospital UHID account?{' '}
            <Link to="/register" className="font-semibold text-secondary hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
