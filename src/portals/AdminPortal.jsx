import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Users, Store, ClipboardList, ShieldAlert, Award, 
  Trash, Plus, Check, X, ShieldCheck, TrendingUp, IndianRupee 
} from 'lucide-react';

const AdminPortal = () => {
  const { 
    users, 
    restaurants, 
    orders, 
    coupons, 
    complaints, 
    resolveComplaint, 
    addCoupon 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'restaurants', 'coupons', 'complaints'
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);

  // Form states for coupon manager
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponMinOrder, setCouponMinOrder] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponPercent, setCouponPercent] = useState(true);

  // General Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Rejected' ? o.total : 0), 0);
  const pendingComplaints = complaints.filter(c => c.status === 'Pending');

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const newCoupon = {
      code: couponCode.toUpperCase().trim(),
      discount: Number(couponDiscount),
      minOrder: Number(couponMinOrder),
      isPercent: couponPercent,
      desc: couponDesc
    };

    addCoupon(newCoupon);
    setShowAddCouponModal(false);
    setCouponCode('');
    setCouponDiscount('');
    setCouponMinOrder('');
    setCouponDesc('');
    alert('Coupon added successfully!');
  };

  // Mock revenue chart data (last 6 months)
  const revenueHistory = [
    { month: 'Jan', amount: 15000 },
    { month: 'Feb', amount: 28000 },
    { month: 'Mar', amount: 42000 },
    { month: 'Apr', amount: 35000 },
    { month: 'May', amount: 62000 },
    { month: 'Jun', amount: totalRevenue || 75000 }
  ];

  const maxRevenue = Math.max(...revenueHistory.map(h => h.amount));

  return (
    <div className="container-custom" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div className="glass-premium" style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Admin Console</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive management and real-time site analytics.</p>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL REVENUE</span>
            <span style={{ color: 'var(--success)', padding: '4px', backgroundColor: '#d1fae5', borderRadius: '50%' }}><IndianRupee size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{totalRevenue}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accumulated gross sales</span>
        </div>

        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL USERS</span>
            <span style={{ color: 'var(--info)', padding: '4px', backgroundColor: '#dbeafe', borderRadius: '50%' }}><Users size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{users.length}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered consumer base</span>
        </div>

        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>RESTAURANTS</span>
            <span style={{ color: 'var(--primary)', padding: '4px', backgroundColor: 'var(--primary-light)', borderRadius: '50%' }}><Store size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{restaurants.length}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active partner kitchens</span>
        </div>

        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>COMPLAINTS</span>
            <span style={{ color: 'var(--danger)', padding: '4px', backgroundColor: '#fee2e2', borderRadius: '50%' }}><ShieldAlert size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{pendingComplaints.length} Pending</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting resolution</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        gap: '24px',
        overflowX: 'auto'
      }}>
        {['analytics', 'users', 'restaurants', 'coupons', 'complaints'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 6px',
              border: 'none',
              background: 'none',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab === 'analytics' && 'Dashboard Analytics 📈'}
            {tab === 'users' && `Users (${users.length})`}
            {tab === 'restaurants' && `Restaurants (${restaurants.length})`}
            {tab === 'coupons' && `Coupons (${coupons.length})`}
            {tab === 'complaints' && `Complaints (${complaints.length})`}
          </button>
        ))}
      </div>

      {/* 1. Dashboard Analytics */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          {/* Revenue Bar Chart (Custom CSS) */}
          <div className="card-premium" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Revenue Trend (Simulated)</h3>
            
            {/* Chart Area */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '240px',
              paddingTop: '20px',
              borderBottom: '2px solid var(--border-color)',
              position: 'relative'
            }}>
              {revenueHistory.map(hist => {
                const heightPercentage = Math.round((hist.amount / maxRevenue) * 100);

                return (
                  <div key={hist.month} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                  }}>
                    {/* Bar details */}
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px' }}>₹{hist.amount}</span>
                    <div style={{
                      width: '60%',
                      maxWidth: '50px',
                      height: `${heightPercentage * 1.6}px`, // scaled
                      backgroundColor: 'var(--primary)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.5s ease',
                      boxShadow: 'var(--shadow-primary)'
                    }} className="animate-fade-in"></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>{hist.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders summary */}
          <div className="card-premium" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Orders Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Delivered Orders</span>
                <strong style={{ fontSize: '0.95rem' }}>{orders.filter(o => o.status === 'Delivered').length}</strong>
              </div>
              <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cooking / Out for Delivery</span>
                <strong style={{ fontSize: '0.95rem' }}>{orders.filter(o => ['Preparing', 'Cooking', 'Packed', 'Out for Delivery'].includes(o.status)).length}</strong>
              </div>
              <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Confirmation</span>
                <strong style={{ fontSize: '0.95rem' }}>{orders.filter(o => o.status === 'Placed').length}</strong>
              </div>
              <div className="flex-between" style={{ padding: '10px 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rejected Orders</span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--danger)' }}>{orders.filter(o => o.status === 'Rejected').length}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Users Management */}
      {activeTab === 'users' && (
        <div className="card-premium" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px' }}>Name</th>
                <th style={{ padding: '16px' }}>Email</th>
                <th style={{ padding: '16px' }}>Phone</th>
                <th style={{ padding: '16px' }}>Primary Address</th>
                <th style={{ padding: '16px' }}>Loyalty Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: '700' }}>{u.name}</td>
                  <td style={{ padding: '16px' }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>{u.phone}</td>
                  <td style={{ padding: '16px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.addresses?.[0]?.address || 'No address added'}
                  </td>
                  <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }}>🏆 {u.rewards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Restaurants Management */}
      {activeTab === 'restaurants' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {restaurants.map(rest => (
            <div key={rest.id} className="card-premium" style={{ display: 'flex', gap: '12px', padding: '16px', alignItems: 'center' }}>
              <img src={rest.logo} alt={rest.name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{rest.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rest.cuisines.join(', ')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: '700' }}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" /> {rest.rating}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>({rest.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Coupons Management */}
      {activeTab === 'coupons' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Active Promo Coupons</h3>
            <button 
              onClick={() => setShowAddCouponModal(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
            >
              <Plus size={16} /> Create Coupon
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {coupons.map(coupon => (
              <div key={coupon.code} className="card-premium" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px' }}>
                    {coupon.code}
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {coupon.isPercent ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{coupon.desc}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Min Order: ₹{coupon.minOrder}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Complaints Management */}
      {activeTab === 'complaints' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {complaints.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No complaints raised.</p>
          ) : (
            complaints.map(comp => (
              <div key={comp.id} className="card-premium animate-fade-in" style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '2px 6px', borderRadius: '4px' }}>
                      {comp.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Order: {comp.orderId}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {comp.userName}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>"{comp.text}"</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.75rem', fontWeight: '700', color: comp.status === 'Resolved' ? 'var(--success)' : 'var(--warning)' }}>
                    {comp.status === 'Resolved' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    {comp.status}
                  </div>
                  {comp.status === 'Pending' && (
                    <button 
                      onClick={() => { resolveComplaint(comp.id); alert('Complaint marked as resolved.'); }}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--success)', boxShadow: 'none' }}
                    >
                      Resolve Issue
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. Create Coupon Modal */}
      {showAddCouponModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1500,
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
              onClick={() => setShowAddCouponModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '16px' }}>Create New Promo Coupon</h3>

            <form onSubmit={handleSaveCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Coupon Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. FOODIES50" 
                  required 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Discount Value</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50" 
                    required 
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Min Order Value</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 199" 
                    required 
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(e.target.value)}
                    className="input-premium"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Coupon Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Save 50% on first order" 
                  required 
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', fontWeight: '600' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="couponType"
                    checked={couponPercent}
                    onChange={() => setCouponPercent(true)}
                  />
                  Percentage (%)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="couponType"
                    checked={!couponPercent}
                    onChange={() => setCouponPercent(false)}
                  />
                  Flat Discount (₹)
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPortal;
