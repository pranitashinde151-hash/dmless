import Link from 'next/link';

export default function Landing() {
  return (
    <div style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>dmless - Smart Recruitment Platform</h1>
        <p style={styles.heroText}>
          Create smart hiring links with MCQ-based screening and track your candidates effortlessly. No complexity, just results.
        </p>
        <div style={styles.heroButtons}>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '48px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  heroText: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.95,
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
};
