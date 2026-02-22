import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getJobs } from '../lib/api';

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadJobs();
  }, [isAuthenticated, loading, user?.id]);

  const loadJobs = async () => {
    if (!user?.id) return;

    setJobsLoading(true);
    try {
      const data = await getJobs(user.id);
      setJobs(data);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  if (loading || jobsLoading) {
    return (
      <div style={styles.container}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={styles.header}>
        <h2>Recruiter Dashboard</h2>
        <Link href="/create-job" className="btn btn-primary">
          + Create New Job
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {jobs.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3>No Jobs Yet</h3>
          <p>Create your first job posting to start recruiting</p>
          <Link href="/create-job" className="btn btn-primary" style={styles.emptyBtn}>
            Create a Job
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <h3>{job.jobRole}</h3>
              <p>{job.jobDescription.substring(0, 150)}...</p>

              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statValue}>{job.candidates || 0}</div>
                  <div style={styles.statLabel}>Candidates</div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statValue}>{job.shortlisted || 0}</div>
                  <div style={styles.statLabel}>Shortlisted</div>
                </div>
              </div>

              <div style={styles.knockedOut}>
                Knocked Out: {job.knocked || 0}
              </div>

              <Link
                href={`/candidates/${job._id}`}
                className="btn btn-secondary btn-small btn-block"
              >
                View Candidates
              </Link>
            </div>
          ))}
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
    marginBottom: '40px',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderLeft: '4px solid #ef4444',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    gridColumn: '1/-1',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyBtn: {
    marginTop: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  },
  statBox: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: '12px',
    color: '#4b5563',
    marginTop: '4px',
  },
  knockedOut: {
    fontSize: '12px',
    color: '#4b5563',
    marginBottom: '16px',
  },
};
