export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4338ca' }}>
        Welcome to EdPsych Connect
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Your comprehensive platform for educational psychology resources and tools.
      </p>
      <a href="/dashboard" style={{
        padding: '12px 24px',
        backgroundColor: '#4338ca',
        color: 'white',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        Get Started
      </a>
    </div>
  );
}
