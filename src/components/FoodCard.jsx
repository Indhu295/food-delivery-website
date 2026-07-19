import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, Star, Clock, Flame, ShieldAlert } from 'lucide-react';

const FoodCard = ({ item, restaurantId, onViewDetails }) => {
  const { addToCart, currentUser, toggleWishlist } = useContext(AppContext);

  const isWishlisted = currentUser?.wishlist?.includes(item.id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please log in to add items to your wishlist!');
      return;
    }
    toggleWishlist(item.id);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(restaurantId, item);
  };

  return (
    <div 
      className="card-premium animate-fade-in"
      onClick={onViewDetails}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Food Image & Badges */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden' }}>
        <img 
          src={item.img} 
          alt={item.name} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart size={16} fill={isWishlisted ? 'var(--primary)' : 'none'} stroke={isWishlisted ? 'var(--primary)' : 'var(--text-main)'} />
        </button>

        {/* Veg/Non-Veg Tag Overlaid */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '4px 6px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
          <span style={{ fontSize: '0.65rem', fontWeight: '800', marginLeft: '4px', color: '#1e293b' }}>
            {item.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Calories tag */}
        {item.cal && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backdropFilter: 'blur(4px)'
          }}>
            <Flame size={12} color="#f59e0b" fill="#f59e0b" />
            {item.cal} Cal
          </div>
        )}
      </div>

      {/* Info Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="flex-between" style={{ marginBottom: '6px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
            {item.name}
          </h3>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
            ₹{item.price}
          </span>
        </div>

        {/* Time and Rating Row */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.rating || 4.5}</span>
            <span>({item.reviews || 20})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} />
            <span>{item.time || 20} mins</span>
          </div>
        </div>

        {/* Description */}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          lineHeight: '1.4',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1
        }}>
          {item.description}
        </p>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button 
            onClick={handleAdd}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '8px 12px',
              fontSize: '0.85rem'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
