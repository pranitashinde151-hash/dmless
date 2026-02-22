const API = '/api';

export async function apiCall(endpoint, options = {}) {
  const url = `${API}${endpoint}`;
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}

export async function register(name, email, password) {
  return apiCall('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(email, password) {
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function createJob(recruiterId, jobRole, jobDescription, questions) {
  return apiCall('/createJob', {
    method: 'POST',
    body: JSON.stringify({ recruiterId, jobRole, jobDescription, questions }),
  });
}

export async function getJob(id) {
  return apiCall(`/getJob?id=${id}`);
}

export async function getJobs(recruiterId) {
  return apiCall(`/getJobs?recruiterId=${recruiterId}`);
}

export async function getCandidates(jobId) {
  return apiCall(`/getCandidates?jobId=${jobId}`);
}

export async function submitApplication(jobId, name, email, answers, resume) {
  return apiCall('/submit', {
    method: 'POST',
    body: JSON.stringify({ jobId, name, email, answers, resume }),
  });
}

export async function getDashboard(jobId) {
  return apiCall('/dashboard', {
    method: 'POST',
    body: JSON.stringify({ jobId }),
  });
}
