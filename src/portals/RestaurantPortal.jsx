import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  TrendingUp, ShoppingBag, Star, ToggleLeft, ToggleRight, 
  Edit, Plus, Trash, Check, X, Eye, FileText, IndianRupee, BellRing 
} from 'lucide-react';

const RestaurantPortal = () => {
  const { 
    restaurants, 
    orders, 
    updateOrderStatus, 
    toggleAvailability, 
    updateMenuItem, 
    reviews,
    sendNotification
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu', 'reviews'
  const [editingItem, setEditingItem] = useState(null); // Menu item being edited or added
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for menu editor
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuCategory, setMenuCategory] = useState('Main Course');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuVeg, setMenuVeg] = useState(true);
  const [menuTime, setMenuTime] = useState(20);
  const [menuCal, setMenuCal] = useState(300);
  const [menuImg, setMenuImg] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60');

  // Paradise Biryani is the active restaurant for demo (id: 1)
  const myRestaurantId = 1;
  const myRestaurant = restaurants.find(r => r.id === myRestaurantId) || restaurants[0];

  // Filters for my restaurant
  const myOrders = orders.filter(o => o.restaurantId === myRestaurantId);
  const myReviews = reviews.filter(r => r.restaurantId === myRestaurantId);

  // Metrics
  const activeOrders = myOrders.filter(o => ['Placed', 'Preparing', 'Cooking', 'Packed', 'Out for Delivery'].includes(o.status));
  const completedOrders = myOrders.filter(o => o.status === 'Delivered');
  const totalRevenue = myOrders.reduce((sum, o) => sum + (o.status !== 'Rejected' ? o.total : 0), 0);
  const monthlyRevenue = Math.round(totalRevenue * 0.85); // simulated split

  const handleStatusChange = (orderId, currentStatus, action) => {
    let nextStatus = currentStatus;
    if (action === 'accept') {
      nextStatus = 'Preparing';
      sendNotification(null, `Paradise Biryani accepted order ${orderId}! Cooking in progress.`, 'user');
    } else if (action === 'reject') {
      nextStatus = 'Rejected';
      sendNotification(null, `Paradise Biryani rejected order ${orderId}. Apologies!`, 'user');
    } else if (action === 'next') {
      if (currentStatus === 'Preparing') nextStatus = 'Cooking';
      else if (currentStatus === 'Cooking') nextStatus = 'Packed';
      else if (currentStatus === 'Packed') nextStatus = 'Out for Delivery';
      else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';
    }

    updateOrderStatus(orderId, nextStatus);
  };

  const handleSaveMenuItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      name: menuName,
      price: Number(menuPrice),
      category: menuCategory,
      description: menuDescription,
      isVeg: menuVeg,
      time: Number(menuTime),
      cal: Number(menuCal),
      img: menuImg,
      available: editingItem ? editingItem.available : true
    };

    updateMenuItem(myRestaurantId, newItem);
    setShowAddModal(false);
    setEditingItem(null);
    clearForm();
    alert('Menu item saved successfully!');
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setMenuName(item.name);
    setMenuPrice(item.price);
    setMenuCategory(item.category);
    setMenuDescription(item.description);
    setMenuVeg(item.isVeg);
    setMenuTime(item.time || 20);
    setMenuCal(item.cal || 300);
    setMenuImg(item.img);
    setShowAddModal(true);
  };

  const clearForm = () => {
    setMenuName('');
    setMenuPrice('');
    setMenuCategory('Main Course');
    setMenuDescription('');
    setMenuVeg(true);
    setMenuTime(20);
    setMenuCal(300);
    setMenuImg('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60');
  };

  return (
    <div className="container-custom" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div className="glass-premium" style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img src={myRestaurant.logo} alt={myRestaurant.name} style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid var(--border-color)' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{myRestaurant.name} Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back, Manage your orders and culinary menu.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => { clearForm(); setEditingItem(null); setShowAddModal(true); }}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>TODAY'S REVENUE</span>
            <span style={{ color: 'var(--success)', padding: '4px', backgroundColor: '#d1fae5', borderRadius: '50%' }}><IndianRupee size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{totalRevenue}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {completedOrders.length} completed orders</span>
        </div>

        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>MONTHLY REVENUE</span>
            <span style={{ color: 'var(--info)', padding: '4px', backgroundColor: '#dbeafe', borderRadius: '50%' }}><TrendingUp size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{monthlyRevenue}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated partner payout</span>
        </div>

        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>ACTIVE ORDERS</span>
            <span style={{ color: 'var(--primary)', padding: '4px', backgroundColor: 'var(--primary-light)', borderRadius: '50%' }}><ShoppingBag size={16} /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{activeOrders.length}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Currently in progress</span>
        </div>

        <div className="card-premium" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>AVERAGE RATING</span>
            <span style={{ color: 'var(--warning)', padding: '4px', backgroundColor: '#fef3c7', borderRadius: '50%' }}><Star size={16} fill="#f59e0b" color="#f59e0b" /></span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{myRestaurant.rating} / 5</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {myRestaurant.reviewsCount} customer reviews</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        {['orders', 'menu', 'reviews'].map(tab => (
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
              transition: 'all 0.2s'
            }}
          >
            {tab === 'orders' && `Incoming Orders (${activeOrders.length})`}
            {tab === 'menu' && 'Menu Manager'}
            {tab === 'reviews' && `Feedback (${myReviews.length})`}
          </button>
        ))}
      </div>

      {/* 1. Orders Manager Tab */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myOrders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No orders received yet.</p>
          ) : (
            myOrders.map(order => (
              <div key={order.id} className="card-premium animate-fade-in" style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr',
                gap: '20px',
                alignItems: 'center'
              }}>
                {/* Items detail */}
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary)' }}>{order.id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {order.userName}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {order.items.map(item => (
                      <span key={item.id} style={{ fontSize: '0.85rem' }}>
                        • {item.name} <strong style={{ color: 'var(--text-muted)' }}>x{item.quantity}</strong>
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                    📍 Delivery Address: {order.address}
                  </p>
                </div>

                {/* Bill Amount */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL AMOUNT</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{order.total}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'block', marginTop: '4px', fontWeight: '600' }}>
                    Paid via {order.paymentMethod}
                  </span>
                </div>

                {/* Status and Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      backgroundColor: order.status === 'Placed' ? 'var(--primary-light)' : order.status === 'Rejected' ? '#fee2e2' : '#d1fae5',
                      color: order.status === 'Placed' ? 'var(--primary)' : order.status === 'Rejected' ? 'var(--danger)' : 'var(--success)'
                    }}>
                      {order.status}
                    </span>
                  </div>

                  {order.status === 'Placed' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleStatusChange(order.id, order.status, 'reject')}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order.id, order.status, 'accept')}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--success)', boxShadow: 'none' }}
                      >
                        Accept
                      </button>
                    </div>
                  )}

                  {!['Placed', 'Rejected', 'Delivered'].includes(order.status) && (
                    <button 
                      onClick={() => handleStatusChange(order.id, order.status, 'next')}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      Mark as {order.status === 'Preparing' ? 'Cooking' : order.status === 'Cooking' ? 'Packed' : order.status === 'Packed' ? 'Out for Delivery' : 'Delivered'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Menu Manager Tab */}
      {activeTab === 'menu' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {myRestaurant.menu.map(item => {
            const isAvail = item.available === undefined ? true : item.available;

            return (
              <div key={item.id} className="card-premium animate-fade-in" style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                alignItems: 'center'
              }}>
                <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', margin: '2px 0' }}>{item.category}</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>₹{item.price}</strong>
                </div>

                {/* Edit and Toggle availability controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <button 
                    onClick={() => toggleAvailability(myRestaurantId, item.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: isAvail ? 'var(--success)' : 'var(--text-muted)' }}
                  >
                    {isAvail ? (
                      <>Available <ToggleRight size={24} color="var(--success)" fill="var(--success)" /></>
                    ) : (
                      <>Unavailable <ToggleLeft size={24} color="var(--text-muted)" /></>
                    )}
                  </button>

                  <button 
                    onClick={() => handleEditClick(item)}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={12} /> Edit Price
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Customer Reviews Tab */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myReviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No reviews posted yet.</p>
          ) : (
            myReviews.map(rev => (
              <div key={rev.id} className="card-premium animate-fade-in" style={{ padding: '20px' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{rev.userName}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Post date: {new Date(rev.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: '12px' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b45309' }}>{rev.rating}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>"{rev.comment}"</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Reviewed Dish: <strong>{myRestaurant.menu.find(m => m.id === rev.foodId)?.name || 'General'}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Add / Edit Menu Item Modal */}
      {showAddModal && (
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
            maxWidth: '500px',
            padding: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => { setShowAddModal(false); setEditingItem(null); }}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '16px' }}>{editingItem ? 'Edit Price & Menu' : 'Add New Menu Item'}</h3>

            <form onSubmit={handleSaveMenuItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paneer Butter Masala" 
                  required 
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 250" 
                    required 
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select 
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                    className="input-premium"
                    style={{ padding: '10px' }}
                  >
                    <option value="Soups">Soups</option>
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Thalis">Thalis</option>
                    <option value="Mandis">Mandis</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Cool Drinks">Cool Drinks</option>
                    <option value="Salads">Salads</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prep Time (mins)</label>
                  <input 
                    type="number" 
                    value={menuTime}
                    onChange={(e) => setMenuTime(e.target.value)}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Calories</label>
                  <input 
                    type="number" 
                    value={menuCal}
                    onChange={(e) => setMenuCal(e.target.value)}
                    className="input-premium"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Food Image URL</label>
                <input 
                  type="text" 
                  value={menuImg}
                  onChange={(e) => setMenuImg(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea 
                  required
                  placeholder="Tell us what this food item is made of..." 
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  className="input-premium"
                  rows={2}
                  style={{ resize: 'none' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={menuVeg} 
                  onChange={(e) => setMenuVeg(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                Is Vegetarian
              </label>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Save Menu Item
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RestaurantPortal;
