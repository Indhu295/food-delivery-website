import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: '40px 0 20px 0',
      marginTop: 'auto',
      zIndex: 10
    }}>
      <div className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <h3 style={{ color: 'var(--primary)', fontFamily: 'var(--font-accent)', marginBottom: '16px', fontSize: '1.4rem' }}>Foodies</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Delicious Food Delivered to Your Doorstep. Bringing the finest meals from top-rated restaurants straight to you.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>For Users</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Popular Eateries</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Active Offers</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Our App</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>For Partners</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Join as a Restaurant</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Delivery Partner</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Business Resources</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li style={{ color: 'var(--text-muted)' }}>Email: support@foodies.com</li>
              <li style={{ color: 'var(--text-muted)' }}>Phone: +91 98765 43210</li>
              <li style={{ color: 'var(--text-muted)' }}>Address: Hyderabad, TS, India</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>© {new Date().getFullYear()} Foodies. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
