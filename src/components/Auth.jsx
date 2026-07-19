import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Mail, Lock, Phone, Shield, Store, User, ArrowRight } from 'lucide-react';

const Auth = () => {
  const { loginUser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('user'); // 'user', 'restaurant', 'admin'
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'otp'
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'user') {
      if (loginMethod === 'email') {
        if (!email) return;
        loginUser(email, 'user');
      } else {
        if (!phone) return;
        if (!showOtpScreen) {
          setShowOtpScreen(true);
        } else {
          if (!otp) return;
          loginUser(`${phone}@mobile.com`, 'user');
        }
      }
    } else if (activeTab === 'restaurant') {
      loginUser('owner@paradise.com', 'restaurant');
    } else if (activeTab === 'admin') {
      loginUser('admin@foodies.com', 'admin');
    }
  };

  const handleGoogleLogin = () => {
    loginUser('indhu@foodies.com', 'user');
  };

  const handleForgotPassword = () => {
    alert('Password reset link sent to your email!');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '40px 20px'
    }} className="animate-fade-in">
      <div className="card-premium glass-premium animate-scale-up" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '6px' }}>Welcome to Foodies</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Grab your favorite meals in minutes</p>
        </div>

        {/* Roles Tab Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-app)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px'
        }}>
          <button 
            type="button"
            onClick={() => { setActiveTab('user'); setShowOtpScreen(false); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'user' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'user' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'user' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <User size={14} /> User
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('restaurant'); setShowOtpScreen(false); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'restaurant' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'restaurant' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'restaurant' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Store size={14} /> Owner
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('admin'); setShowOtpScreen(false); }}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: activeTab === 'admin' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Shield size={14} /> Admin
          </button>
        </div>

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'user' ? (
            <>
              {/* User Signup / Login Toggle Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                  {isSignUp ? 'Create User Account' : 'Sign In'}
                </span>
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {isSignUp ? 'Already have an account? Login' : 'Create an Account'}
                </button>
              </div>

              {/* Login Method for User (Credentials vs Mobile) */}
              {!isSignUp && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => { setLoginMethod('email'); setShowOtpScreen(false); }}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: loginMethod === 'email' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: loginMethod === 'email' ? 'var(--primary-light)' : 'transparent',
                      color: loginMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >
                    Email / Password
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: loginMethod === 'otp' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: loginMethod === 'otp' ? 'var(--primary-light)' : 'transparent',
                      color: loginMethod === 'otp' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >
                    Mobile / OTP
                  </button>
                </div>
              )}

              {/* Inputs based on signup & login method */}
              {isSignUp && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Indhu" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-premium"
                    />
                  </div>
                </div>
              )}

              {loginMethod === 'email' || isSignUp ? (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="email" 
                        placeholder="yourname@domain.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-premium"
                        style={{ paddingLeft: '40px' }}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Password</label>
                      {!isSignUp && (
                        <button 
                          type="button"
                          onClick={handleForgotPassword}
                          style={{ border: 'none', background: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-premium"
                        style={{ paddingLeft: '40px' }}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                </>
              ) : (
                // OTP Login Flow
                <>
                  {!showOtpScreen ? (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="tel" 
                          placeholder="98765 43210" 
                          required 
                          pattern="[0-9]{10}"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="input-premium"
                          style={{ paddingLeft: '40px' }}
                        />
                        <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ animation: 'scaleUp 0.3s forwards' }}>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>We sent a 4-digit code to</p>
                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>+91 {phone}</p>
                      </div>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Verification Code (OTP)</label>
                      <input 
                        type="text" 
                        placeholder="Enter 4-digit OTP" 
                        required 
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="input-premium"
                        style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '8px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <button type="button" onClick={() => setShowOtpScreen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>Change Number</button>
                        <button type="button" onClick={() => alert('New OTP sent!')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>Resend OTP</button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* User Submit Button */}
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                {isSignUp ? 'Create Account' : showOtpScreen ? 'Verify & Login' : 'Login'} <ArrowRight size={16} />
              </button>

              {/* Divider */}
              {!isSignUp && (
                <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                  <span style={{ padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                </div>
              )}

              {/* Google Login button */}
              {!isSignUp && (
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px', border: '1px solid var(--border-color)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg> Continue with Google
                </button>
              )}
            </>
          ) : activeTab === 'restaurant' ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Store size={36} color="var(--primary)" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1.1rem' }}>Restaurant Owner Login</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Access your restaurant orders and menu</p>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Owner Email</label>
                <input 
                  type="email" 
                  placeholder="owner@paradise.com" 
                  value="owner@paradise.com"
                  readOnly
                  className="input-premium"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value="123456"
                  readOnly
                  className="input-premium"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Login to Dashboard <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <Shield size={36} color="var(--primary)" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '1.1rem' }}>Admin Control Center</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage site-wide settings and analytics</p>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Admin Email</label>
                <input 
                  type="email" 
                  placeholder="admin@foodies.com" 
                  value="admin@foodies.com"
                  readOnly
                  className="input-premium"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value="admin123"
                  readOnly
                  className="input-premium"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Login as Administrator <ArrowRight size={16} />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
