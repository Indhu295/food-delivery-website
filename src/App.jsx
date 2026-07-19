import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Splash from './components/Splash';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderTracker from './components/OrderTracker';
import UserPortal from './portals/UserPortal';
import RestaurantPortal from './portals/RestaurantPortal';
import AdminPortal from './portals/AdminPortal';
import { User, Heart, Compass, MapPin, X, ArrowRight, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

const AppContent = () => {
  const { 
    currentUser, 
    currentRole, 
    activeTrackingOrderId, 
    setActiveTrackingOrderId,
    orders,
    addAddress
  } = useContext(AppContext);

  const [showSplash, setShowSplash] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Profile Edit fields
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [profileAddressText, setProfileAddressText] = useState('');
  const [profileAddressTag, setProfileAddressTag] = useState('Home');

  // Trigger splash timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddProfileAddress = (e) => {
    e.preventDefault();
    if (!profileAddressText) return;
    addAddress(profileAddressTag, profileAddressText);
    setProfileAddressText('');
    setShowAddAddressModal(false);
    alert('Address saved successfully!');
  };

  if (showSplash) {
    return <Splash />;
  }

  if (!currentUser) {
    return <Auth />;
  }

  const userOrders = orders.filter(o => o.userId === currentUser.email);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="animate-fade-in">
      
      {/* Dynamic Navbar */}
      <Navbar 
        onViewCart={() => setShowCart(true)} 
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Content Area based on currentRole */}
      <main style={{ flex: 1 }}>
        {currentRole === 'user' && (
          <UserPortal 
            showCart={showCart}
            onCloseCart={() => setShowCart(false)}
            onOpenProfile={() => setShowProfile(true)}
            showProfile={showProfile}
            onCloseProfile={() => setShowProfile(false)}
          />
        )}
        {currentRole === 'restaurant' && <RestaurantPortal />}
        {currentRole === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Active Order Tracker Modal */}
      {currentRole === 'user' && activeTrackingOrderId && (
        <OrderTracker 
          orderId={activeTrackingOrderId} 
          onClose={() => setActiveTrackingOrderId(null)} 
        />
      )}

      {/* User Profile Modal */}
      {showProfile && currentRole === 'user' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} className="animate-fade-in" onClick={() => setShowProfile(false)}>
          <div className="card-premium glass-premium animate-scale-up" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1.2fr 2fr',
            gap: '24px'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowProfile(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* Profile left sidebar (Photo, Info) */}
            <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: '800',
                border: '2px solid var(--primary)',
                boxShadow: 'var(--shadow-md)'
              }}>
                {currentUser.name?.[0]}
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{currentUser.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Foodies Platinum User</span>
              </div>

              {/* Stats badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Loyalty Points</span>
                  <strong style={{ color: 'var(--primary)' }}>🏆 {currentUser.rewards}</strong>
                </div>
                <div style={{ backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Orders</span>
                  <strong>🧾 {userOrders.length}</strong>
                </div>
              </div>

              {/* Personal Info details */}
              <div style={{ width: '100%', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)' }}>
                  <Mail size={14} /> <span>{currentUser.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)' }}>
                  <Phone size={14} /> <span>+91 {currentUser.phone}</span>
                </div>
              </div>
            </div>

            {/* Profile right main content (Addresses, History) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
              <div>
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Saved Addresses</h4>
                  <button 
                    onClick={() => setShowAddAddressModal(true)}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    Add New
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentUser.addresses?.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No saved addresses.</p>
                  ) : (
                    currentUser.addresses?.map(addr => (
                      <div key={addr.id} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{addr.tag}</span>
                        <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{addr.address}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px' }}>Order History</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {userOrders.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>You haven't ordered anything yet.</p>
                  ) : (
                    userOrders.map(order => (
                      <div key={order.id} style={{
                        padding: '12px',
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: `3px solid ${order.status === 'Delivered' ? 'var(--success)' : order.status === 'Rejected' ? 'var(--danger)' : 'var(--primary)'}`
                      }}>
                        <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--text-main)' }}>{order.restaurantName}</strong>
                          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.total}</span>
                        </div>
                        <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>{new Date(order.timestamp).toLocaleDateString()}</span>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            backgroundColor: order.status === 'Delivered' ? '#d1fae5' : order.status === 'Rejected' ? '#fee2e2' : 'var(--primary-light)',
                            color: order.status === 'Delivered' ? '#065f46' : order.status === 'Rejected' ? 'var(--danger)' : 'var(--primary)'
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Address creation modal from inside Profile */}
      {showAddAddressModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} className="animate-fade-in">
          <div className="card-premium glass-premium animate-scale-up" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAddAddressModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '16px' }}>Add Saved Address</h3>

            <form onSubmit={handleAddProfileAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Label Tag</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Home', 'Office', 'Other'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setProfileAddressTag(tag)}
                      className={profileAddressTag === tag ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Address Details</label>
                <textarea 
                  required
                  placeholder="Street name, landmark, house number, pincode" 
                  value={profileAddressText}
                  onChange={(e) => setProfileAddressText(e.target.value)}
                  className="input-premium"
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Root element wrapping AppContent with AppProvider
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

import { AppProvider } from './context/AppContext';
export default App;
