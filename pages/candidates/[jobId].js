import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { getCandidates } from '../../lib/api';

export default function CandidatesPage() {
  const router = useRouter();
  const { jobId } = router.query;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [candidates, setCandiates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!jobId) return;
    loadCandidates();
  }, [jobId, isAuthenticated, authLoading]);

  const loadCandidates = async () => {
    try {
      const data = await getCandidates(jobId);
      setCandiates(data.candidates);
      setJob(data.job);
    } catch (err) {
      setError(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div className="spinner"></div>
      </div>
    );
  }

  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length;
  const knockedOut = candidates.filter(c => c.status === 'knocked').length;

  return (
    <div className="container">
      <div style={styles.header}>
        <h2>Job Candidates</h2>
        <Link href="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {job && (
        <div className="card" style={styles.jobCard}>
          <h3>{job.jobRole}</h3>
          <p>{job.jobDescription}</p>
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div className="stat-card">
          <div className="stat-value">{totalCandidates}</div>
          <div className="stat-label">Total Candidates</div>
        </div>
        <div className="stat-card" style={styles.successStat}>
          <div className="stat-value">{shortlisted}</div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card" style={styles.dangerStat}>
          <div className="stat-value">{knockedOut}</div>
          <div className="stat-label">Knocked Out</div>
        </div>
      </div>

      {/* Candidates Table */}
      {candidates.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No candidates yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>
                    <span
                      className={
                        candidate.status === 'shortlisted'
                          ? 'badge badge-success'
                          : 'badge badge-danger'
                      }
                    >
                      {candidate.status === 'shortlisted' ? '✓ Shortlisted' : '✗ Knocked'}
                    </span>
                  </td>
                  <td>{new Date(candidate.submittedAt).toLocaleDateString()}</td>
                  <td>
                    {candidate.resume ? (
                      <a href="#" style={styles.resumeLink}>
                        📄 Resume
                      </a>
                    ) : (
                      <span style={styles.noResume}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 70px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderLeft: '4px solid #ef4444',
  },
  jobCard: {
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  successStat: {
    borderLeftColor: '#10b981',
  },
  dangerStat: {
    borderLeftColor: '#ef4444',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  resumeLink: {
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  noResume: {
    color: '#9ca3af',
  },
};
