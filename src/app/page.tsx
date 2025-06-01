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
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#4338ca' }}>
        EdPsych Connect
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Our new platform is coming soon.
      </p>
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#4338ca',
        color: 'white',
        borderRadius: '5px'
      }}>
        Coming Soon
      </div>
    </div>
  );
}
