import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ShoppingBag, Bell, Heart, Sun, Moon, MapPin, 
  ChevronDown, LogOut, Shield, User, Store, MoonStar 
} from 'lucide-react';

const Navbar = ({ onViewCart, onOpenProfile, onOpenComplaints }) => {
  const { 
    currentUser, 
    currentRole, 
    loginUser, 
    logout, 
    cart, 
    notifications, 
    theme, 
    setTheme 
  } = useContext(AppContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.read && (
    (currentRole === 'user' && n.type === 'user') ||
    (currentRole === 'restaurant' && n.type === 'owner') ||
    (currentRole === 'admin' && n.type === 'admin')
  ));

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleRoleChange = (role) => {
    loginUser(
      role === 'user' ? 'indhu@foodies.com' : role === 'restaurant' ? 'owner@paradise.com' : 'admin@foodies.com',
      role
    );
    setShowRoleDropdown(false);
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)',
      borderBottom: '1px solid var(--border-color)',
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container-custom flex-between" style={{ width: '100%' }}>
        {/* Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.4rem',
            boxShadow: 'var(--shadow-primary)'
          }}>F</div>
          <span style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '1.6rem',
            fontWeight: '800',
            color: 'var(--primary)',
            letterSpacing: '-0.5px'
          }}>Foodies</span>
          
          {/* Active Portal Badge */}
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '4px 8px',
            borderRadius: '20px',
            backgroundColor: currentRole === 'user' ? 'var(--primary-light)' : currentRole === 'restaurant' ? '#d1fae5' : '#dbeafe',
            color: currentRole === 'user' ? 'var(--primary)' : currentRole === 'restaurant' ? '#065f46' : '#1e40af',
            marginLeft: '8px'
          }}>
            {currentRole === 'user' ? 'User' : currentRole === 'restaurant' ? 'Owner' : 'Admin'}
          </span>
        </div>

        {/* Center / User Address Indicator (Only for User Portal) */}
        {currentRole === 'user' && currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)'
          }} className="btn-secondary" onClick={onOpenProfile}>
            <MapPin size={16} color="var(--primary)" />
            <span style={{ fontWeight: '600' }}>
              {currentUser.addresses?.[0]?.tag || 'Deliver to'}
            </span>
            <span style={{
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--text-muted)'
            }}>
              {currentUser.addresses?.[0]?.address || 'Add address...'}
            </span>
            <ChevronDown size={14} />
          </div>
        )}

        {/* Right Navigation controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Portal Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              Portal Switcher <ChevronDown size={14} />
            </button>
            
            {showRoleDropdown && (
              <div className="glass-premium" style={{
                position: 'absolute',
                top: '45px',
                right: 0,
                width: '180px',
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <button 
                  onClick={() => handleRoleChange('user')}
                  className="btn-secondary"
                  style={{ justifyContent: 'flex-start', border: 'none', width: '100%', padding: '8px 12px' }}
                >
                  <User size={16} /> User Portal
                </button>
                <button 
                  onClick={() => handleRoleChange('restaurant')}
                  className="btn-secondary"
                  style={{ justifyContent: 'flex-start', border: 'none', width: '100%', padding: '8px 12px' }}
                >
                  <Store size={16} /> Owner Portal
                </button>
                <button 
                  onClick={() => handleRoleChange('admin')}
                  className="btn-secondary"
                  style={{ justifyContent: 'flex-start', border: 'none', width: '100%', padding: '8px 12px' }}
                >
                  <Shield size={16} /> Admin Portal
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Cart Icon (User Only) */}
          {currentRole === 'user' && currentUser && (
            <button onClick={onViewCart} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  boxShadow: '0 2px 5px rgba(255, 111, 60, 0.4)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Notifications Bell */}
          {currentUser && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn-secondary" 
                style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
              >
                <Bell size={18} />
                {unreadNotifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--danger)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%'
                  }}></span>
                )}
              </button>

              {showNotifications && (
                <div className="glass-premium" style={{
                  position: 'absolute',
                  top: '45px',
                  right: 0,
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 1000
                }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Notifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notifications.filter(n => n.type === (currentRole === 'user' ? 'user' : currentRole === 'restaurant' ? 'owner' : 'admin')).length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No new notifications</p>
                    ) : (
                      notifications
                        .filter(n => n.type === (currentRole === 'user' ? 'user' : currentRole === 'restaurant' ? 'owner' : 'admin'))
                        .map(n => (
                          <div key={n.id} style={{
                            padding: '10px',
                            backgroundColor: 'var(--bg-app)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '3px solid var(--primary)',
                            fontSize: '0.85rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}>
                            <div>{n.text}</div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Avatar / Login */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={currentRole === 'user' ? onOpenProfile : null}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: currentRole === 'user' ? 'pointer' : 'default',
                  border: '1px solid var(--primary)'
                }}
              >
                {currentUser.name?.[0]}
              </div>
              <button onClick={logout} className="btn-secondary" style={{ padding: '8px' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleRoleChange('user')}
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
