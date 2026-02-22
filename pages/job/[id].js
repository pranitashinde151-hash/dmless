import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '../../components/Alert';
import { getJob, submitApplication } from '../../lib/api';

export default function JobSubmissionPage() {
  const router = useRouter();
  const { id: jobId } = router.query;
  const [job, setJob] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (!jobId) return;
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const data = await getJob(jobId);
      setJob(data);
      // Initialize answers object
      const ans = {};
      data.questions.forEach((_, idx) => {
        ans[idx] = '';
      });
      setAnswers(ans);
    } catch (err) {
      setMessage(err.message || 'Failed to load job');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!name || !email) {
      setMessage('Please fill in your name and email');
      setMessageType('error');
      return;
    }

    // Check all answers are filled
    for (let i = 0; i < job.questions.length; i++) {
      if (!answers[i]) {
        setMessage('Please answer all questions');
        setMessageType('error');
        return;
      }
    }

    // Convert resume to base64 if provided
    let resumeBase64 = null;
    if (resume) {
      try {
        resumeBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(resume);
        });
      } catch (err) {
        setMessage('Failed to read resume file');
        setMessageType('error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await submitApplication(jobId, name, email, Object.values(answers), resumeBase64);
      setMessageType('success');
      setMessage(result.message);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setMessage(err.message || 'Submission failed');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={styles.container}>
        <Alert type="error" message="Job not found. Please check the link." />
      </div>
    );
  }

  return (
    <div className="container" style={styles.formContainer}>
      <div className="card" style={styles.cardMargin}>
        <h2>{job.jobRole}</h2>
        <p style={styles.description}>{job.jobDescription}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Your Information */}
        <div className="card" style={styles.cardMargin}>
          <h3>Your Information</h3>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        {/* Screening Test */}
        <div className="card" style={styles.cardMargin}>
          <h3>📝 Screening Test</h3>
          <p style={styles.testNote}>
            Answer all 5 questions correctly to proceed to the next stage. One wrong answer will result in elimination.
          </p>

          {job.questions.map((q, idx) => (
            <div key={idx} style={styles.mcqSection}>
              <h4>
                {idx + 1}. {q.question}
              </h4>
              {q.options.map((option, optIdx) => (
                <label key={optIdx} style={styles.mcqOption}>
                  <input
                    type="radio"
                    name={`question_${idx}`}
                    value={option}
                    checked={answers[idx] === option}
                    onChange={() => setAnswers({ ...answers, [idx]: option })}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* Resume Upload */}
        <div className="card" style={styles.cardMargin}>
          <h3>📄 Upload Your Resume</h3>
          <p style={styles.resumeNote}>Only required if you pass the screening test.</p>

          <div className="form-group">
            <label htmlFor="resume">Resume (PDF, DOC, DOCX)</label>
            <input
              id="resume"
              type="file"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>

        {/* Alert */}
        {message && (
          <Alert
            type={messageType}
            message={message}
            onClose={() => setMessage('')}
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-success btn-block"
          style={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 70px)',
  },
  formContainer: {
    maxWidth: '900px',
  },
  cardMargin: {
    marginBottom: '30px',
  },
  description: {
    marginTop: '10px',
    whiteSpace: 'pre-wrap',
  },
  testNote: {
    color: '#4b5563',
    marginBottom: '20px',
  },
  mcqSection: {
    marginBottom: '24px',
  },
  mcqOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resumeNote: {
    color: '#4b5563',
    marginBottom: '12px',
  },
  submitBtn: {
    padding: '14px',
    fontSize: '18px',
  },
};
