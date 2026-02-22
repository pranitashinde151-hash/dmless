import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { login } from '../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      authLogin(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={styles.heading}>Welcome Back</h2>
      <Alert type="error" message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          style={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={styles.footer}>
        Don't have an account?{' '}
        <Link href="/register" style={styles.link}>
          Register
        </Link>
      </p>
    </div>
  );
}

const styles = {
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  submitBtn: {
    padding: '14px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#4b5563',
  },
  link: {
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
