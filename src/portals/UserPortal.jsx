import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import FoodCard from '../components/FoodCard';
import { 
  Search, SlidersHorizontal, ArrowRight, ShoppingCart, 
  Tag, Compass, Star, MapPin, X, Plus, Minus, CreditCard, 
  Smile, Mic, Sparkles, Heart, Clock, UtensilsCrossed 
} from 'lucide-react';

const UserPortal = ({ showCart, onCloseCart, onOpenProfile, showProfile, onCloseProfile }) => {
  const { 
    restaurants, 
    coupons, 
    cart, 
    updateCartQuantity, 
    clearCart, 
    placeOrder, 
    currentUser, 
    addAddress,
    toggleWishlist,
    reviews,
    addReview,
    addComplaint,
    orders
  } = useContext(AppContext);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // Modals / Sliding panels
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  
  // Checkout Form states
  const [selectedAddressId, setSelectedAddressId] = useState(currentUser?.addresses?.[0]?.id || '');
  const [newAddressText, setNewAddressText] = useState('');
  const [newAddressTag, setNewAddressTag] = useState('Home');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Complaint form state
  const [complaintCategory, setComplaintCategory] = useState('Late Delivery');
  const [complaintText, setComplaintText] = useState('');
  const [complaintOrderId, setComplaintOrderId] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  // Voice Search / AI Recommendation state mocks
  const [isListening, setIsListening] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  // Menu categories list
  const categories = ['All', 'Soups', 'Starters', 'Main Course', 'Thalis', 'Mandis', 'Desserts', 'Cool Drinks', 'Salads'];

  // Handle Search and Filter logic
  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          r.menu.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const allFoodItems = restaurants.flatMap(r => r.menu.map(item => ({ ...item, restaurantId: r.id, restaurantName: r.name })));
  
  const filteredFoodItems = allFoodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesSearch && matchesCategory && matchesVeg;
  });

  // Cart calculation helpers
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const packingFee = subtotal > 0 ? 15 : 0;
  
  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrder) {
      discount = appliedCoupon.isPercent 
        ? Math.min(Math.round(subtotal * (appliedCoupon.discount / 100)), 100)
        : appliedCoupon.discount;
    }
  }
  const total = subtotal + gst + deliveryFee + packingFee - discount;

  const handleApplyCoupon = (coupon) => {
    if (subtotal < coupon.minOrder) {
      alert(`Minimum order of ₹${coupon.minOrder} required to apply this coupon!`);
      return;
    }
    setAppliedCoupon(coupon);
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!selectedAddressId && !newAddressText) {
      alert('Please select or add a delivery address!');
      return;
    }

    const finalAddress = newAddressText 
      ? newAddressText 
      : currentUser.addresses.find(a => a.id === Number(selectedAddressId))?.address;

    if (newAddressText) {
      addAddress(newAddressTag, newAddressText);
    }

    const orderId = placeOrder({
      subtotal,
      gst,
      deliveryFee,
      packingFee,
      discount,
      total,
      paymentMethod,
      address: finalAddress,
      instructions: deliveryInstructions
    });

    setIsCheckout(false);
    onCloseCart();
    setAppliedCoupon(null);
    setNewAddressText('');
    setDeliveryInstructions('');
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Chicken Dum Biryani');
      setSelectedCategory('All');
    }, 2000);
  };

  const getAIRecommendation = () => {
    // Generate AI recommendations based on user profiles / active season
    const recommendations = [
      { name: 'Chicken Dum Biryani', desc: 'Paradise Biryani’s aromatic basmati rice cooked to perfection with tender chicken.' },
      { name: 'Special Andhra Meals', desc: 'A hearty vegetarian South Indian thali bursting with authentic spicy Andhra flavors.' },
      { name: 'Paneer Tikka', desc: 'Lightly charred tandoori cottage cheese cubes, high protein and low calorie.' }
    ];
    const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
    setAiRecommendation(randomRec);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!selectedFoodItem) return;
    addReview(selectedFoodItem.restaurantId, selectedFoodItem.id, reviewRating, reviewComment);
    setReviewComment('');
    alert('Thank you for your review!');
  };

  const handleAddComplaint = (e) => {
    e.preventDefault();
    if (!complaintOrderId || !complaintText) {
      alert('Please fill out all complaint details.');
      return;
    }
    addComplaint(complaintCategory, complaintText, complaintOrderId);
    setComplaintText('');
    setComplaintOrderId('');
    setShowComplaintForm(false);
    alert('Complaint registered successfully. Admin will review this shortly.');
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* 1. Header Banner and Hero section */}
      <div style={{
        background: 'linear-gradient(135deg, #fff0eb, #ffffff)',
        padding: '50px 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container-custom flex-between" style={{ gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              Satisfy Your Cravings <br/>
              With <span style={{ color: 'var(--primary)' }}>Delicious Meals</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.1rem' }}>
              Order from your favorite nearby restaurants and track delivery in real-time.
            </p>

            {/* Premium Search Container */}
            <div className="glass" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              gap: '12px',
              maxWidth: '550px'
            }}>
              <Search size={20} color="var(--primary)" />
              <input 
                type="text" 
                placeholder="Search food, restaurants, cuisines..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: '1rem',
                  background: 'transparent',
                  color: 'var(--text-main)'
                }}
              />
              <button 
                onClick={handleVoiceSearch}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isListening ? 'var(--primary)' : 'var(--text-muted)'
                }}
                title="Voice Search"
                className={isListening ? 'animate-pulse-slow' : ''}
              >
                <Mic size={18} />
              </button>
              <button onClick={getAIRecommendation} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <Sparkles size={14} /> AI Suggest
              </button>
            </div>

            {/* Voice listening overlay */}
            {isListening && (
              <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }} className="animate-pulse-slow">
                Listening for food names... (Try saying "Biryani")
              </div>
            )}

            {/* AI Recommendation Box */}
            {aiRecommendation && (
              <div className="glass animate-slide-up" style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #f59e0b',
                maxWidth: '550px',
                position: 'relative'
              }}>
                <button 
                  onClick={() => setAiRecommendation(null)}
                  style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
                  <Sparkles size={16} /> AI Food Recommendation for You:
                </div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '2px' }}>{aiRecommendation.name}</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{aiRecommendation.desc}</p>
                <button 
                  onClick={() => setSearchQuery(aiRecommendation.name)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.75rem', marginTop: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Find it now <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Right Banner Banner Graphic */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '320px',
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '20px'
            }} className="animate-float">
              <div className="glass" style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                width: '100%',
                color: 'white',
                background: 'rgba(0,0,0,0.6)'
              }}>
                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '4px' }}>Super Saver Offers!</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Get flat 50% discount using WELCOME50 coupon code</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Menu Category Filters */}
      <div className="container-custom" style={{ marginTop: '40px' }}>
        <div className="flex-between" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Inspiration for your order</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse food categories to find your perfect dish</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={vegOnly} 
                onChange={(e) => setVegOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              Pure Veg Only
            </label>
            <button 
              onClick={() => setShowWishlist(true)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Heart size={16} fill="var(--primary)" color="var(--primary)" /> Wishlist
            </button>
            <button 
              onClick={() => setShowComplaintForm(true)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Raise Complaint
            </button>
          </div>
        </div>

        {/* Category icons slider */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '30px'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {cat === 'All' && '🍽️ All Foods'}
              {cat === 'Soups' && '🍵 Soups'}
              {cat === 'Starters' && '🍢 Starters'}
              {cat === 'Main Course' && '🍛 Main Course'}
              {cat === 'Thalis' && '🍱 Thalis'}
              {cat === 'Mandis' && '🍗 Mandis'}
              {cat === 'Desserts' && '🍰 Desserts'}
              {cat === 'Cool Drinks' && '🥤 Cool Drinks'}
              {cat === 'Salads' && '🥗 Salads'}
            </button>
          ))}
        </div>

        {/* Food list grid */}
        <div style={{ marginBottom: '50px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px' }}>
            {selectedCategory === 'All' ? 'Popular Dishes' : `${selectedCategory}`}
          </h3>
          {filteredFoodItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
              <UtensilsCrossed size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <h4 style={{ marginBottom: '4px' }}>No items found</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try modifying your search query or filters.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {filteredFoodItems.map(item => (
                <FoodCard 
                  key={item.id}
                  item={item}
                  restaurantId={item.restaurantId}
                  onViewDetails={() => setSelectedFoodItem(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Popular Restaurants Section */}
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Top Restaurants near you</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Curated list of premium dining spots</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredRestaurants.map(rest => (
              <div 
                key={rest.id} 
                className="card-premium"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery(rest.name);
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '45%', overflow: 'hidden' }}>
                  <img src={rest.cover} alt={rest.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--success)'
                  }}>
                    {rest.status}
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', gap: '12px', flex: 1 }}>
                  <img src={rest.logo} alt={rest.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2px' }}>{rest.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {rest.cuisines.join(', ')}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700', color: 'var(--text-main)' }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" /> {rest.rating} ({rest.reviewsCount})
                      </span>
                      <span>•</span>
                      <span>{rest.deliveryTime} mins</span>
                      <span>•</span>
                      <span>{rest.distance} km</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Food Details Modal */}
      {selectedFoodItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '20px'
        }} className="animate-fade-in">
          <div className="card-premium glass-premium animate-scale-up" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedFoodItem(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>

            <img src={selectedFoodItem.img} alt={selectedFoodItem.name} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }} />

            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <div>
                <span className={selectedFoodItem.isVeg ? 'badge-veg' : 'badge-nonveg'}></span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>{selectedFoodItem.name}</h3>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>₹{selectedFoodItem.price}</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}><Star size={14} fill="#f59e0b" color="#f59e0b" /> {selectedFoodItem.rating}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {selectedFoodItem.time} mins</span>
              {selectedFoodItem.cal && (
                <>
                  <span>•</span>
                  <span>🔥 {selectedFoodItem.cal} Cal</span>
                </>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>Description</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{selectedFoodItem.description}</p>
            </div>

            {selectedFoodItem.ingredients && (
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>Ingredients</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedFoodItem.ingredients}</p>
              </div>
            )}

            {/* Modal Reviews */}
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px' }}>Customer Reviews</h5>
              
              {/* Review submit form */}
              <form onSubmit={handleAddReview} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                backgroundColor: 'var(--bg-app)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Post a review:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewRating(star)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        <Star size={16} fill={star <= reviewRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Share your feedback about this dish..." 
                  required 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="input-premium"
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: 'auto' }}>
                  Submit
                </button>
              </form>

              {/* Reviews listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {reviews.filter(r => r.foodId === selectedFoodItem.id).length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>No reviews yet. Be the first to review!</p>
                ) : (
                  reviews
                    .filter(r => r.foodId === selectedFoodItem.id)
                    .map(rev => (
                      <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontWeight: '700' }}>{rev.userName}</span>
                          <span style={{ display: 'flex', alignItems: 'center' }}><Star size={10} fill="#f59e0b" color="#f59e0b" /> {rev.rating}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{rev.comment}</p>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  toggleWishlist(selectedFoodItem.id);
                }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Heart size={16} /> Wishlist
              </button>
              <button 
                onClick={() => {
                  updateCartQuantity(selectedFoodItem.id, 1);
                  setSelectedFoodItem(null);
                }}
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center' }}
              >
                <ShoppingCart size={16} /> Add to Cart (₹{selectedFoodItem.price})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Cart Sliding Drawer */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1900,
          display: 'flex',
          justifyContent: 'flex-end'
        }} className="animate-fade-in" onClick={onCloseCart}>
          <div className="glass-premium" style={{
            width: '100%',
            maxWidth: '450px',
            height: '100%',
            backgroundColor: 'var(--bg-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart /> Shopping Cart</h3>
              <button onClick={onCloseCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {cart.items.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <ShoppingCart size={48} style={{ color: 'var(--text-muted)' }} />
                <h4 style={{ color: 'var(--text-muted)' }}>Your cart is empty</h4>
                <button onClick={onCloseCart} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Browse Foods</button>
              </div>
            ) : !isCheckout ? (
              // Cart Summary Page
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {cart.items.map(item => (
                    <div key={item.id} className="flex-between" style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '55%' }}>
                        <img src={item.img} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '2px 6px', backgroundColor: 'var(--bg-card)' }}>
                        <button onClick={() => updateCartQuantity(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={12} /></button>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={12} /></button>
                      </div>

                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)', width: '20%', textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}

                  {/* Coupons Section */}
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={16} /> Available Coupons</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {coupons.map(coupon => (
                        <div key={coupon.code} className="flex-between" style={{
                          border: '1px dashed var(--border-color)',
                          padding: '10px',
                          borderRadius: 'var(--radius-md)'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>{coupon.code}</span>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{coupon.desc}</p>
                          </div>
                          <button 
                            onClick={() => handleApplyCoupon(coupon)}
                            className="btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bill details */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--success)', marginBottom: '6px' }}>
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Delivery Charges</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <span>Packing Charges</span>
                    <span>₹{packingFee}</span>
                  </div>
                  
                  <div className="flex-between" style={{ fontSize: '1.2rem', fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginBottom: '20px' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)' }}>₹{total}</span>
                  </div>

                  <button 
                    onClick={() => setIsCheckout(true)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : (
              // Checkout Portal View
              <form onSubmit={handlePlaceOrderSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>Delivery Address</h4>
                  
                  {/* Address radio list */}
                  {currentUser?.addresses?.map(addr => (
                    <label key={addr.id} style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      border: selectedAddressId === addr.id ? '1px solid var(--primary)' : '1px solid transparent'
                    }}>
                      <input 
                        type="radio" 
                        name="addressId" 
                        value={addr.id}
                        checked={Number(selectedAddressId) === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: '2px' }}
                      />
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{addr.tag}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{addr.address}</p>
                      </div>
                    </label>
                  ))}

                  {/* Add new address */}
                  <div style={{
                    border: '1px dashed var(--border-color)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Add New Address</span>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {['Home', 'Office', 'Other'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewAddressTag(tag)}
                          className={newAddressTag === tag ? 'btn-primary' : 'btn-secondary'}
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Flat/House No, Building, Area, Pincode" 
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      className="input-premium"
                      rows={2}
                      style={{ fontSize: '0.8rem', resize: 'none' }}
                    />
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Delivery Instructions</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Leave at gate, Ring bell" 
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      className="input-premium"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* Payment Method */}
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginTop: '10px' }}>Payment Method</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['UPI', 'Google Pay', 'PhonePe', 'Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                      <label key={method} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px',
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        border: paymentMethod === method ? '1px solid var(--primary)' : '1px solid transparent'
                      }}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                        />
                        {method}
                      </label>
                    ))}
                  </div>

                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div className="flex-between" style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px' }}>
                    <span>Amount to Pay</span>
                    <span style={{ color: 'var(--primary)' }}>₹{total}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsCheckout(false)}
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      style={{ flex: 2, justifyContent: 'center' }}
                    >
                      Place Order (₹{total})
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. Wishlist Drawer */}
      {showWishlist && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1800,
          display: 'flex',
          justifyContent: 'flex-start'
        }} className="animate-fade-in" onClick={() => setShowWishlist(false)}>
          <div className="glass-premium" style={{
            width: '100%',
            maxWidth: '400px',
            height: '100%',
            backgroundColor: 'var(--bg-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Heart fill="var(--primary)" color="var(--primary)" /> Wishlist</h3>
              <button onClick={() => setShowWishlist(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(!currentUser || !currentUser.wishlist || currentUser.wishlist.length === 0) ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <Heart size={48} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Wishlist is empty</p>
                </div>
              ) : (
                allFoodItems
                  .filter(item => currentUser.wishlist.includes(item.id))
                  .map(item => (
                    <div key={item.id} className="flex-between" style={{
                      padding: '12px',
                      backgroundColor: 'var(--bg-app)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '65%' }}>
                        <img src={item.img} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>₹{item.price}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => toggleWishlist(item.id)}
                          className="btn-secondary"
                          style={{ padding: '6px', borderRadius: '50%' }}
                        >
                          <X size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            updateCartQuantity(item.id, 1);
                            setShowWishlist(false);
                          }}
                          className="btn-primary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Complaint Form Modal */}
      {showComplaintForm && (
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
            maxWidth: '500px',
            padding: '24px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowComplaintForm(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '16px' }}>Raise Complaint</h3>

            <form onSubmit={handleAddComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Order</label>
                <select 
                  required
                  value={complaintOrderId}
                  onChange={(e) => setComplaintOrderId(e.target.value)}
                  className="input-premium"
                  style={{ padding: '10px' }}
                >
                  <option value="">-- Choose Order --</option>
                  {orders.filter(o => o.userId === currentUser.email).map(o => (
                    <option key={o.id} value={o.id}>{o.id} - {o.restaurantName} (₹{o.total})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
                <select 
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="input-premium"
                  style={{ padding: '10px' }}
                >
                  <option value="Late Delivery">Late Delivery</option>
                  <option value="Wrong Item">Wrong Item Received</option>
                  <option value="Bad Quality">Bad Quality / Cold Food</option>
                  <option value="Payment Issue">Payment / Billing Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea 
                  required
                  placeholder="Tell us what went wrong..." 
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="input-premium"
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserPortal;
