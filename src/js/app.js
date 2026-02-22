// ==================== Configuration ====================
// For Vite dev server: /api is proxied to http://localhost:5000
// For production: /api resolves to backend at same origin
const API = '/api';

console.log('🔌 API URL:', API);

// ==================== Page Navigation ====================
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  
  // Show selected page
  const page = document.getElementById(pageName);
  if (page) {
    page.classList.add('active');
    
    // Show/hide navbar links based on auth state
    updateNavBar();
    
    // Load data for specific pages
    if (pageName === 'dashboard' && isAuthenticated()) {
      loadDashboard();
    } else if (pageName === 'createJob' && isAuthenticated()) {
      initializeMCQForm();
    }
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// ==================== Authentication ====================
function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

function getAuthHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  };
}

function updateNavBar() {
  const navLogin = document.getElementById('navLogin');
  const navRegister = document.getElementById('navRegister');
  const navDashboard = document.getElementById('navDashboard');
  const navButton = document.getElementById('navButton');
  
  if (isAuthenticated()) {
    navLogin.style.display = 'none';
    navRegister.style.display = 'none';
    navDashboard.style.display = 'block';
    navButton.style.display = 'block';
  } else {
    navLogin.style.display = 'block';
    navRegister.style.display = 'block';
    navDashboard.style.display = 'none';
    navButton.style.display = 'none';
  }
}

function logout() {
  localStorage.clear();
  showAlert('loginAlert', 'You have been logged out.', 'success');
  setTimeout(() => {
    showPage('landing');
  }, 1000);
}

// ==================== Form Handlers ====================
async function handleRegister(event) {
  event.preventDefault();
  clearErrors(['regName', 'regEmail', 'regPassword', 'regConfirmPassword']);
  
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  // Validation
  if (!name) {
    showError('regNameError', 'Please enter your name');
    return;
  }
  
  if (!email.includes('@')) {
    showError('regEmailError', 'Please enter a valid email');
    return;
  }
  
  if (password.length < 6) {
    showError('regPasswordError', 'Password must be at least 6 characters');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('regConfirmPasswordError', 'Passwords do not match');
    return;
  }
  
  try {
    const response = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_name', data.user.name);
      
      showAlert('registerAlert', 'Registration successful! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        showPage('dashboard');
        updateNavBar();
      }, 1500);
    } else {
      showAlert('registerAlert', data.error || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Register error:', error);
    showAlert('registerAlert', 'An error occurred. Please try again.', 'error');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  clearErrors(['loginEmail', 'loginPassword']);
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Validation
  if (!email) {
    showError('loginEmailError', 'Please enter your email');
    return;
  }
  
  if (!password) {
    showError('loginPasswordError', 'Please enter your password');
    return;
  }
  
  try {
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_name', data.user.name);
      
      showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
      setTimeout(() => {
        showPage('dashboard');
        updateNavBar();
      }, 1500);
    } else {
      showAlert('loginAlert', data.error || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert('loginAlert', 'An error occurred. Please try again.', 'error');
  }
}

// ==================== MCQ Form Initialization ====================
function initializeMCQForm() {
  const mcqContainer = document.getElementById('mcqContainer');
  mcqContainer.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'mcq-form-container';
    questionDiv.innerHTML = `
      <h4>Question ${i + 1}</h4>
      <div class="form-group">
        <label>Question Text *</label>
        <input type="text" class="question-text" placeholder="Enter the question" required>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--gray-700);">Answer Options (4 options) *</label>
        <div class="options-group">
          <div class="option-input">
            <input type="text" class="option-text" placeholder="Option 1" required>
          </div>
          <div class="option-input">
            <input type="text" class="option-text" placeholder="Option 2" required>
          </div>
          <div class="option-input">
            <input type="text" class="option-text" placeholder="Option 3" required>
          </div>
          <div class="option-input">
            <input type="text" class="option-text" placeholder="Option 4" required>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label>Correct Answer *</label>
        <select class="correct-answer" required>
          <option value="">Select the correct answer</option>
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
          <option value="Option 4">Option 4</option>
        </select>
      </div>
    `;
    mcqContainer.appendChild(questionDiv);
  }
}

async function handleCreateJob(event) {
  event.preventDefault();
  
  const jobRole = document.getElementById('jobRole').value.trim();
  const jobDescription = document.getElementById('jobDesc').value.trim();
  const recruiterId = localStorage.getItem('user_id');
  
  if (!jobRole || !jobDescription) {
    showAlert('createJobAlert', 'Please fill in all job details', 'error');
    return;
  }
  
  // Extract MCQ data
  const questions = [];
  const mcqContainers = document.querySelectorAll('.mcq-form-container');
  
  mcqContainers.forEach((container, index) => {
    const questionText = container.querySelector('.question-text').value.trim();
    const optionTexts = Array.from(container.querySelectorAll('.option-text')).map(el => el.value.trim());
    const correctAnswer = container.querySelector('.correct-answer').value;
    
    if (!questionText || optionTexts.some(opt => !opt) || !correctAnswer) {
      showAlert('createJobAlert', `Please complete Question ${index + 1}`, 'error');
      throw new Error('Incomplete question');
    }
    
    questions.push({
      question: questionText,
      options: optionTexts,
      correct: correctAnswer
    });
  });
  
  if (questions.length !== 5) {
    showAlert('createJobAlert', 'Please create exactly 5 questions', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API}/createJob`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recruiterId,
        jobRole,
        jobDescription,
        questions
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.id) {
      // Generate the candidate link
      const candidateLink = `${window.location.origin}${window.location.pathname}?jobId=${data.id}`;
      
      showAlert('createJobAlert', 'Job created successfully!', 'success');
      
      // Show the link and copy option
      setTimeout(() => {
        const alert = document.getElementById('createJobAlert');
        alert.innerHTML = `
          <div class="alert alert-success">
            <strong>Hiring Link Created!</strong><br>
            <p style="margin-top: 10px;">Share this link with candidates:</p>
            <div class="link-display">${candidateLink}</div>
            <button onclick="copyToClipboard('${candidateLink}')" class="copy-btn">📋 Copy Link</button>
          </div>
        `;
      }, 100);
      
      // Reset form and redirect after 3 seconds
      setTimeout(() => {
        document.querySelector('form').reset();
        showPage('dashboard');
      }, 3000);
    } else {
      showAlert('createJobAlert', data.error || 'Failed to create job', 'error');
    }
  } catch (error) {
    console.error('Create job error:', error);
    showAlert('createJobAlert', 'An error occurred. Please try again.', 'error');
  }
}

// ==================== Dashboard ====================
async function loadDashboard() {
  const recruiterId = localStorage.getItem('user_id');
  const jobsContainer = document.getElementById('jobsContainer');
  
  try {
    const response = await fetch(`${API}/jobs?recruiterId=${recruiterId}`);
    const jobs = await response.json();
    
    if (!jobs || jobs.length === 0) {
      jobsContainer.innerHTML = `
        <div style="grid-column: 1/-1;">
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h3>No Jobs Yet</h3>
            <p>Create your first job posting to start recruiting</p>
            <a href="#" onclick="showPage('createJob')" class="btn btn-primary" style="margin-top: 20px;">Create a Job</a>
          </div>
        </div>
      `;
      return;
    }
    
    jobsContainer.innerHTML = jobs.map(job => `
      <div class="card">
        <h3>${job.jobRole}</h3>
        <p style="color: var(--gray-600); margin-bottom: 16px;">${job.jobDescription.substring(0, 150)}...</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="padding: 12px; background-color: var(--gray-50); border-radius: 6px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: var(--primary-color);">${job.candidates || 0}</div>
            <div style="font-size: 12px; color: var(--gray-600);">Candidates</div>
          </div>
          <div style="padding: 12px; background-color: var(--gray-50); border-radius: 6px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: var(--success-color);">${job.shortlisted || 0}</div>
            <div style="font-size: 12px; color: var(--gray-600);">Shortlisted</div>
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: var(--gray-600);">Knocked Out: ${job.knocked || 0}</div>
        </div>
        <button onclick="viewCandidates('${job._id}')" class="btn btn-secondary btn-small btn-block">View Candidates</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Load dashboard error:', error);
    jobsContainer.innerHTML = '<div class="alert alert-error">Failed to load jobs. Please refresh the page.</div>';
  }
}

async function viewCandidates(jobId) {
  try {
    const response = await fetch(`${API}/candidates?jobId=${jobId}`);
    const data = await response.json();
    
    // Store current job ID for navigation
    localStorage.setItem('current_job_id', jobId);
    
    // Update job info
    const job = data.job;
    document.getElementById('jobTitle').textContent = job.jobRole;
    document.getElementById('jobDescription').textContent = job.jobDescription;
    
    // Update stats
    const totalCandidates = data.candidates.length;
    const shortlisted = data.candidates.filter(c => c.status === 'shortlisted').length;
    const knockedOut = data.candidates.filter(c => c.status === 'knocked').length;
    
    document.getElementById('totalCandidates').textContent = totalCandidates;
    document.getElementById('shortlistedCount').textContent = shortlisted;
    document.getElementById('knockedOutCount').textContent = knockedOut;
    
    // Populate candidates table
    const candidatesList = document.getElementById('candidatesList');
    if (data.candidates.length === 0) {
      candidatesList.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No candidates yet.</td></tr>';
    } else {
      candidatesList.innerHTML = data.candidates.map(candidate => `
        <tr>
          <td>${candidate.name}</td>
          <td>${candidate.email}</td>
          <td>
            <span class="badge ${candidate.status === 'shortlisted' ? 'badge-success' : 'badge-danger'}">
              ${candidate.status === 'shortlisted' ? '✓ Shortlisted' : '✗ Knocked'}
            </span>
          </td>
          <td>${new Date(candidate.submittedAt).toLocaleDateString()}</td>
          <td>
            ${candidate.resume ? `<a href="#" class="btn btn-small btn-secondary" onclick="downloadResume('${candidate._id}')">📄 Resume</a>` : '-'}
          </td>
        </tr>
      `).join('');
    }
    
    showPage('candidates');
  } catch (error) {
    console.error('View candidates error:', error);
    showAlert('registerAlert', 'Failed to load candidates', 'error');
  }
}

function downloadResume(candidateId) {
  // In a production app, this would download the resume
  // For now, just show a placeholder
  alert('Resume download functionality would be implemented here');
}

// ==================== Candidate Job Submission ====================
function loadJobFromURL() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('jobId');
  
  if (jobId) {
    localStorage.setItem('current_job_id', jobId);
    showPage('jobSubmission');
    loadJobSubmissionPage(jobId);
  }
}

async function loadJobSubmissionPage(jobId) {
  try {
    const response = await fetch(`${API}/job/${jobId}`);
    const job = await response.json();
    
    if (!job) {
      document.getElementById('jobSubmissionContent').innerHTML = `
        <div class="alert alert-error">Job not found. Please check the link.</div>
      `;
      return;
    }
    
    const html = `
      <div class="card" style="margin-bottom: 30px;">
        <h2>${job.jobRole}</h2>
        <p style="margin-top: 10px; white-space: pre-wrap;">${job.jobDescription}</p>
      </div>
      
      <form onsubmit="handleJobSubmission(event, '${jobId}')">
        <div class="card" style="margin-bottom: 30px;">
          <h3>Your Information</h3>
          
          <div class="form-group">
            <label for="candidateName">Full Name *</label>
            <input type="text" id="candidateName" required placeholder="John Doe">
          </div>
          
          <div class="form-group">
            <label for="candidateEmail">Email Address *</label>
            <input type="email" id="candidateEmail" required placeholder="john@example.com">
          </div>
        </div>
        
        <div class="card" style="margin-bottom: 30px;">
          <h3>📝 Screening Test</h3>
          <p style="color: var(--gray-600); margin-bottom: 20px;">Answer all 5 questions correctly to proceed to the next stage. One wrong answer will result in elimination.</p>
          
          <div id="questionsContainer"></div>
        </div>
        
        <div class="card" style="margin-bottom: 30px;">
          <h3>📄 Upload Your Resume</h3>
          <p style="color: var(--gray-600); margin-bottom: 12px;">Only required if you pass the screening test.</p>
          
          <div class="form-group">
            <label for="resumeFile">Resume (PDF, DOC, DOCX)</label>
            <input type="file" id="resumeFile" accept=".pdf,.doc,.docx" placeholder="Choose file">
          </div>
        </div>
        
        <button type="submit" class="btn btn-success btn-block" style="padding: 14px; font-size: 18px;">Submit Application</button>
      </form>
      
      <div id="submissionAlert" style="margin-top: 20px;"></div>
    `;
    
    document.getElementById('jobSubmissionContent').innerHTML = html;
    
    // Populate questions
    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = job.questions.map((q, index) => `
      <div class="mcq-section">
        <h4>${index + 1}. ${q.question}</h4>
        ${q.options.map(opt => `
          <div class="mcq-option">
            <input type="radio" id="q${index}_${opt}" name="question_${index}" value="${opt}" required>
            <label for="q${index}_${opt}">${opt}</label>
          </div>
        `).join('')}
      </div>
    `).join('');
  } catch (error) {
    console.error('Load job submission error:', error);
    document.getElementById('jobSubmissionContent').innerHTML = `
      <div class="alert alert-error">Failed to load job. Please try again.</div>
    `;
  }
}

async function handleJobSubmission(event, jobId) {
  event.preventDefault();
  
  const name = document.getElementById('candidateName').value.trim();
  const email = document.getElementById('candidateEmail').value.trim();
  const resumeFile = document.getElementById('resumeFile').files[0];
  
  if (!name || !email) {
    showAlert('submissionAlert', 'Please fill in your name and email', 'error');
    return;
  }
  
  // Collect answers
  const answers = [];
  for (let i = 0; i < 5; i++) {
    const answer = document.querySelector(`input[name="question_${i}"]:checked`);
    if (!answer) {
      showAlert('submissionAlert', `Please answer all questions`, 'error');
      return;
    }
    answers.push(answer.value);
  }
  
  // Handle resume file
  let resumeBase64 = null;
  if (resumeFile) {
    try {
      resumeBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(resumeFile);
      });
    } catch (error) {
      showAlert('submissionAlert', 'Failed to read resume file', 'error');
      return;
    }
  }
  
  try {
    const response = await fetch(`${API}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        name,
        email,
        answers,
        resume: resumeBase64
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      const resultMessage = data.status === 'shortlisted'
        ? '🎉 Congratulations! You have been shortlisted. Your resume has been saved.'
        : '❌ Thank you for applying. Unfortunately, you did not pass this round.';
      
      showAlert('submissionAlert', resultMessage, 'success');
      
      setTimeout(() => {
        document.querySelector('form').reset();
      }, 1000);
    } else {
      showAlert('submissionAlert', data.error || 'Submission failed', 'error');
    }
  } catch (error) {
    console.error('Job submission error:', error);
    showAlert('submissionAlert', 'An error occurred. Please try again.', 'error');
  }
}

// ==================== Helper Functions ====================
function showAlert(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const alertClass = type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-success';
  element.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
}

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
  }
}

function clearErrors(elementIds) {
  elementIds.forEach(id => {
    const error = document.getElementById(id + 'Error');
    if (error) error.textContent = '';
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Link copied to clipboard!');
  }).catch(() => {
    alert('Failed to copy. Please copy manually: ' + text);
  });
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is coming from a job link
  loadJobFromURL();
  
  // Update navbar on load
  updateNavBar();
  
  // Check if already logged in
  if (isAuthenticated()) {
    showPage('dashboard');
  } else {
    showPage('landing');
  }
});

// Handle back button
window.addEventListener('popstate', function() {
  loadJobFromURL();
});

// ==================== Export functions to global scope ====================
// Enable access from inline onclick handlers
window.showPage = showPage;
window.logout = logout;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleCreateJob = handleCreateJob;
window.copyToClipboard = copyToClipboard;
