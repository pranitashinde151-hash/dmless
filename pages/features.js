import Link from 'next/link';

export default function Features() {
  const features = [
    {
      icon: '📋',
      title: 'Create Hiring Links',
      desc: 'Generate shareable links instantly. No complex setup needed. Share on LinkedIn, Instagram, or anywhere.',
    },
    {
      icon: '❌',
      title: 'Smart Knockouts',
      desc: '5 MCQs with knockout logic. Wrong answer = eliminated. Automated screening saves time and resources.',
    },
    {
      icon: '📊',
      title: 'Real-time Dashboard',
      desc: 'See live stats: total candidates, knockouts, and shortlisted. Get instant insights on each job posting.',
    },
    {
      icon: '📄',
      title: 'Resume Management',
      desc: 'Qualified candidates can upload resumes. Auto-stored for shortlisted applicants only.',
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      desc: 'Your data is safe with enterprise-grade security. JWT-based authentication for recruiter accounts.',
    },
    {
      icon: '⚡',
      title: 'Fast Deployment',
      desc: 'Run on Vercel or any platform. Serverless architecture ensures high availability and performance.',
    },
  ];

  return (
    <div className="container">
      <h2 style={styles.heading}>Why Choose dmless?</h2>
      <div className="card-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="card">
            <h3>
              {feature.icon} {feature.title}
            </h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
      <div style={styles.ctaContainer}>
        <Link href="/register" className="btn btn-primary">
          Start Recruiting Now
        </Link>
      </div>
    </div>
  );
}

const styles = {
  heading: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '36px',
  },
  ctaContainer: {
    textAlign: 'center',
    marginTop: '40px',
  },
};
