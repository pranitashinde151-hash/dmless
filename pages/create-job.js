import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { createJob } from '../lib/api';

export default function CreateJobPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState(Array(5).fill(null).map(() => ({
    question: '',
    options: ['', '', '', ''],
    correct: '',
  })));
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [jobLink, setJobLink] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading]);

  const handleQuestionChange = (idx, field, value) => {
    const newQuestions = [...questions];
    newQuestions[idx][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options[optIdx] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!jobRole || !jobDescription) {
      setError('Please fill in job details');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || q.options.some(opt => !opt) || !q.correct) {
        setError(`Please complete Question ${i + 1}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await createJob(user.id, jobRole, jobDescription, questions);
      const link = `${window.location.origin}/job/${result.id}`;
      setJobLink(link);
      setSuccess(`Job created! Share this link: ${link}`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={styles.formContainer}>
      <h2 style={styles.heading}>Create a New Job Opening</h2>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit}>
        {/* Job Details */}
        <div className="card" style={styles.cardMargin}>
          <h3>Job Details</h3>

          <div className="form-group">
            <label htmlFor="jobRole">Job Role/Title *</label>
            <input
              id="jobRole"
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Frontend Developer, Product Manager"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDesc">Job Description *</label>
            <textarea
              id="jobDesc"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Provide a detailed job description..."
              required
            ></textarea>
          </div>
        </div>

        {/* MCQ Section */}
        <div className="card" style={styles.cardMargin}>
          <h3>📝 Create 5 Screening Questions (MCQs)</h3>
          <p style={styles.mcqNote}>
            These questions will be used for candidate screening. Wrong answers result in elimination.
          </p>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="card" style={styles.questionCard}>
              <h4>Question {qIdx + 1}</h4>

              <div className="form-group">
                <label>Question Text *</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                  placeholder="Enter the question"
                  required
                />
              </div>

              <div style={styles.optionsSection}>
                <label style={styles.optionsLabel}>Answer Options (4 options) *</label>
                <div>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} style={styles.optionInput}>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Correct Answer *</label>
                <select
                  value={q.correct}
                  onChange={(e) => handleQuestionChange(qIdx, 'correct', e.target.value)}
                  required
                >
                  <option value="">Select the correct answer</option>
                  {q.options.map((opt, idx) => (
                    opt && <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <button
          type="submit"
          className="btn btn-success btn-block"
          style={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? 'Creating Job...' : 'Create Job'}
        </button>
        <Link href="/dashboard" className="btn btn-secondary btn-block" style={styles.cancelBtn}>
          Cancel
        </Link>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
    maxWidth: '800px',
  },
  heading: {
    marginBottom: '30px',
  },
  cardMargin: {
    marginBottom: '24px',
  },
  mcqNote: {
    color: '#4b5563',
    marginBottom: '20px',
  },
  questionCard: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f9fafb',
  },
  optionsSection: {
    marginBottom: '16px',
  },
  optionsLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
  },
  optionInput: {
    marginBottom: '8px',
  },
  submitBtn: {
    padding: '14px',
    fontSize: '18px',
    marginBottom: '12px',
  },
  cancelBtn: {
    padding: '14px',
  },
};
