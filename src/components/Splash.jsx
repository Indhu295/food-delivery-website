import React from 'react';

const Splash = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff6f3c',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      overflow: 'hidden'
    }} className="animate-fade-in">
      <div className="flex-center flex-column animate-scale-up" style={{ textAlign: 'center' }}>
        {/* Animated Food Logo */}
        <div style={{
          width: '140px',
          height: '140px',
          backgroundColor: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          marginBottom: '24px',
          position: 'relative'
        }} className="animate-float">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ff6f3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
          </svg>
          <div style={{
            position: 'absolute',
            fontSize: '2rem',
            animation: 'pulseSlow 1.5s infinite'
          }}>🍕</div>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '3.5rem',
          fontWeight: '800',
          letterSpacing: '-1px',
          marginBottom: '8px',
          textShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>Foodies</h1>
        
        <p style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          opacity: 0.9,
          maxWidth: '300px',
          lineHeight: '1.4'
        }}>
          Delicious Food Delivered to Your Doorstep
        </p>

        {/* Loading Spinner */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          gap: '8px'
        }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white', display: 'inline-block', animation: 'pulseSlow 1s infinite' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white', display: 'inline-block', animation: 'pulseSlow 1s infinite 0.2s' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white', display: 'inline-block', animation: 'pulseSlow 1s infinite 0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default Splash;
