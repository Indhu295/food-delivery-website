import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Clock, MapPin, Bike, CheckCircle2, Phone, ShieldCheck, Download } from 'lucide-react';

const OrderTracker = ({ orderId, onClose }) => {
  const { orders } = useContext(AppContext);
  const order = orders.find(o => o.id === orderId);

  if (!order) return null;

  const statuses = ['Placed', 'Preparing', 'Cooking', 'Packed', 'Out for Delivery', 'Delivered'];
  const currentIndex = statuses.indexOf(order.status);

  // Simulated map animation progress
  const [mapProgress, setMapProgress] = useState(0);

  useEffect(() => {
    if (order.status === 'Out for Delivery') {
      const interval = setInterval(() => {
        setMapProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 500);
      return () => clearInterval(interval);
    } else if (order.status === 'Delivered') {
      setMapProgress(100);
    } else {
      setMapProgress(0);
    }
  }, [order.status]);

  const handleDownloadInvoice = () => {
    const invoiceText = `
-----------------------------------------
            FOODIES RECEIPT
-----------------------------------------
Order ID:   ${order.id}
Date:       ${new Date(order.timestamp).toLocaleString()}
Restaurant: ${order.restaurantName}
Customer:   ${order.userName}
Address:    ${order.address}
-----------------------------------------
Items Ordered:
${order.items.map(item => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}
-----------------------------------------
Subtotal:          ₹${order.subtotal}
GST (5%):          ₹${order.gst}
Delivery Fee:      ₹${order.deliveryFee}
Packing Fee:       ₹${order.packingFee}
Discount Applied: -₹${order.discount}
-----------------------------------------
TOTAL PAID:        ₹${order.total}
-----------------------------------------
Thank you for ordering with Foodies!
    `;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
      overflowY: 'auto'
    }} className="animate-fade-in">
      <div className="card-premium glass-premium animate-scale-up" style={{
        width: '100%',
        maxWidth: '750px',
        padding: '30px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Left Side: Order Status and Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Track Order</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {order.id}</span>
            </div>
            <button 
              onClick={onClose} 
              className="btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Close
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From Restaurant</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{order.restaurantName}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Ordered at: {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Vertical Progress Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px' }}>
            {/* Timeline vertical bar */}
            <div style={{
              position: 'absolute',
              left: '7px',
              top: '10px',
              bottom: '10px',
              width: '2px',
              backgroundColor: 'var(--border-color)',
              zIndex: 1
            }}></div>
            
            {/* Timeline status list */}
            {statuses.map((status, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;
              const isFuture = index > currentIndex;

              return (
                <div key={status} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--bg-app)',
                    border: `2px solid ${isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isCompleted && <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%' }}></div>}
                  </div>
                  <div>
                    <h5 style={{
                      fontSize: '0.9rem',
                      color: isActive ? 'var(--primary)' : isFuture ? 'var(--text-muted)' : 'var(--text-main)',
                      fontWeight: isActive || isCompleted ? '700' : '500'
                    }}>
                      {status === 'Placed' && 'Order Placed 🧾'}
                      {status === 'Preparing' && 'Preparing Your Feast 🍗'}
                      {status === 'Cooking' && 'Under Cooking 🔥'}
                      {status === 'Packed' && 'Packed & Ready 🎁'}
                      {status === 'Out for Delivery' && 'Rider on the Way 🚴'}
                      {status === 'Delivered' && 'Delivered! Enjoy 🎉'}
                    </h5>
                    {isActive && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="animate-pulse-slow">
                        {status === 'Preparing' && 'Restaurant is cooking your food...'}
                        {status === 'Out for Delivery' && 'Rider is carrying your delicious meal.'}
                        {status === 'Placed' && 'Awaiting restaurant confirmation...'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details */}
          {order.status !== 'Delivered' && (
            <div className="glass" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Delivery OTP</span>
              </div>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: 'var(--primary)',
                letterSpacing: '2px'
              }}>{order.otp}</span>
            </div>
          )}

          {/* Driver Card */}
          {['Out for Delivery', 'Delivered'].includes(order.status) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700'
                }}>R</div>
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: '700' }}>{order.driverName}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your Delivery Partner</span>
                </div>
              </div>
              <a href={`tel:${order.driverPhone}`} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
                <Phone size={16} />
              </a>
            </div>
          )}

          {/* Receipt Download */}
          <button 
            onClick={handleDownloadInvoice}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
          >
            <Download size={16} /> Download Receipt
          </button>
        </div>

        {/* Right Side: Map Simulation */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          height: '100%',
          minHeight: '300px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-color)'
        }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Live Tracking Map</h4>
          
          {/* Map Graphic Container */}
          <div style={{
            flex: 1,
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Dotted Route Line */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
              <path 
                id="delivery-path"
                d="M 50,150 Q 150,50 250,150 T 350,150" 
                fill="none" 
                stroke="var(--border-color)" 
                strokeWidth="4" 
                strokeDasharray="6 6"
              />
              {/* Active Route Progress */}
              {order.status === 'Out for Delivery' && (
                <path 
                  d="M 50,150 Q 150,50 250,150 T 350,150" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="4" 
                  strokeDasharray="300"
                  strokeDashoffset={300 - (mapProgress * 3)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              )}
            </svg>

            {/* Restaurant Marker */}
            <div style={{
              position: 'absolute',
              left: '35px',
              top: '125px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}>
              <div style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '6px',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-md)'
              }}>🏪</div>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '4px', backgroundColor: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>Paradise</span>
            </div>

            {/* Rider marker (animates along path or stays at position based on progress) */}
            <div style={{
              position: 'absolute',
              // Simple quadratic bezier interpolation for simulation
              left: `${50 + (mapProgress * 3)}px`,
              top: `${135 - Math.sin((mapProgress / 100) * Math.PI) * 60}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 20,
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.5s ease, top 0.5s ease'
            }}>
              <div style={{
                backgroundColor: 'white',
                border: '2px solid var(--primary)',
                padding: '6px',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-lg)'
              }} className={order.status === 'Out for Delivery' ? 'animate-float' : ''}>
                <Bike size={16} color="var(--primary)" />
              </div>
            </div>

            {/* Customer Marker */}
            <div style={{
              position: 'absolute',
              right: '35px',
              top: '125px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}>
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '6px',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-md)'
              }}>🏠</div>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '4px', backgroundColor: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>Home</span>
            </div>

            {/* Status overlay */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              backdropFilter: 'blur(4px)'
            }}>
              {order.status === 'Placed' && 'Waiting for Restaurant...'}
              {order.status === 'Preparing' && 'Kitchen is busy 🍳'}
              {order.status === 'Cooking' && 'Cooking in progress 🥘'}
              {order.status === 'Packed' && 'Food packed & ready 🛍️'}
              {order.status === 'Out for Delivery' && `Rider is ${mapProgress}% close to you`}
              {order.status === 'Delivered' && 'Delivered successfully! 🎉'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
