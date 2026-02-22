import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <Link href="/" style={styles.navBrand}>
          <span style={{ fontSize: '28px' }}>🚀</span>
          <span>dmless</span>
        </Link>

        <ul style={styles.navLinks}>
          <li>
            <Link href="/" style={styles.navLink}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/features" style={styles.navLink}>
              Features
            </Link>
          </li>

          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/login" style={styles.navLink}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" style={styles.navLink}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/dashboard" style={styles.navLink}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} style={styles.navLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  },
  navBrand: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    textDecoration: 'none',
    color: '#374151',
    fontWeight: '500',
    cursor: 'pointer',
  },
  navLogout: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
};
