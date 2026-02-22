const API = "https://YOUR_BACKEND_URL.vercel.app/api";

/* ---------------- REGISTER ---------------- */

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (data.message) {
    alert("Registered Successfully!");
    window.location = "login.html";
  } else {
    alert(data.error);
  }
}

/* ---------------- LOGIN ---------------- */

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.id) {
    localStorage.setItem("recruiterId", data.id);
    window.location = "dashboard.html";
  } else {
    alert(data.error);
  }
}

/* ---------------- CREATE JOB ---------------- */

async function createJob() {
  const recruiterId = localStorage.getItem("recruiterId");

  const job = {
    recruiterId,
    jobRole: document.getElementById("jobRole").value,
    jobDescription: document.getElementById("jobDesc").value,
    questions: [
      {
        question: "HTML?",
        options: ["Programming", "Markup"],
        correct: "Markup",
      },
      {
        question: "CSS?",
        options: ["Styling", "Database"],
        correct: "Styling",
      },
      {
        question: "JS runs?",
        options: ["Browser", "Fridge"],
        correct: "Browser",
      },
      {
        question: "Not language?",
        options: ["Python", "HTML"],
        correct: "HTML",
      },
      { question: "Backend?", options: ["Java", "Paint"], correct: "Java" },
    ],
  };

  const res = await fetch(API + "/createJob", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });

  const data = await res.json();

  alert("Hiring Link: job.html?id=" + data.id);
}

/* ---------------- LOAD JOB ---------------- */

async function loadJob() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!jobId) return;

  const res = await fetch(API + "/getJob?id=" + jobId);
  const job = await res.json();

  document.getElementById("jobTitle").innerText = job.jobRole;
  document.getElementById("jobDescription").innerText = job.jobDescription;

  const container = document.getElementById("questions");

  job.questions.forEach((q, index) => {
    let html = `<div class="question">
      <p>${index + 1}. ${q.question}</p>`;

    q.options.forEach((opt) => {
      html += `
        <label>
          <input type="radio" name="q${index}" value="${opt}">
          ${opt}
        </label><br>`;
    });

    html += `</div>`;
    container.innerHTML += html;
  });
}

/* ---------------- SUBMIT TEST ---------------- */

async function submitTest() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const answers = [];
  document
    .querySelectorAll("input[type=radio]:checked")
    .forEach((r) => answers.push(r.value));

  const resumeFile = document.getElementById("resume").files[0];
  let resumeBase64 = null;

  if (resumeFile) {
    const reader = new FileReader();
    reader.onload = async function () {
      resumeBase64 = reader.result;

      await sendSubmission(jobId, name, email, answers, resumeBase64);
    };
    reader.readAsDataURL(resumeFile);
  } else {
    await sendSubmission(jobId, name, email, answers, null);
  }
}

async function sendSubmission(jobId, name, email, answers, resume) {
  const res = await fetch(API + "/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId,
      name,
      email,
      answers,
      resume,
    }),
  });

  const data = await res.json();

  alert("Result: " + data.status);
}

/* ---------------- DASHBOARD ---------------- */

async function loadDashboard() {
  const jobId = prompt("Enter Job ID to see stats:");

  const res = await fetch(API + "/dashboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId }),
  });

  const data = await res.json();

  document.getElementById("total").innerText = data.total;
  document.getElementById("knocked").innerText = data.knocked;
  document.getElementById("shortlisted").innerText = data.shortlisted;
}
