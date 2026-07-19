import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

export const AppContext = createContext();

// Pre-populated realistic high-quality food image URLs (Unsplash)
const IMAGES = {
  // Soups
  tomatoSoup: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=500&auto=format&fit=crop&q=60',
  vegSoup: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500&auto=format&fit=crop&q=60',
  chickenSoup: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=500&auto=format&fit=crop&q=60',
  // Starters
  paneerTikka: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60',
  crispyCorn: 'https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=500&auto=format&fit=crop&q=60',
  chicken65: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop&q=60',
  chickenTikka: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60',
  // Main Course
  paneerButterMasala: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
  dalTadka: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60',
  chickenDumBiryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
  butterChicken: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60',
  // Thalis
  vegThali: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
  southMeals: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60',
  // Mandis
  chickenMandi: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60',
  // Desserts
  gulabJamun: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60',
  doubleKaMeetha: 'https://images.unsplash.com/photo-1605698822071-a8d0a4755b55?w=500&auto=format&fit=crop&q=60',
  brownie: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
  // Cool Drinks
  mangoJuice: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60',
  coldCoffee: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
  // Salads
  caesarSalad: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60',
  healthyBowl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60'
};

const INITIAL_RESTAURANTS = [
  {
    id: 1,
    name: 'Paradise Biryani',
    logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&auto=format&fit=crop&q=60',
    cover: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60',
    rating: 4.5,
    reviewsCount: 1240,
    deliveryTime: 25,
    distance: 2.4,
    status: 'Open',
    cuisines: ['Biryani', 'Mughlai', 'North Indian'],
    menu: [
      { id: 101, name: 'Chicken Dum Biryani', price: 320, category: 'Main Course', isVeg: false, description: 'World-famous Hyderabadi chicken dum biryani cooked with premium basmati rice and aromatic spices.', rating: 4.8, reviews: 340, time: 20, cal: 750, img: IMAGES.chickenDumBiryani, ingredients: 'Basmati Rice, Chicken, Saffron, Aromatic Spices, Yogurt, Ghee' },
      { id: 102, name: 'Paneer Tikka', price: 240, category: 'Starters', isVeg: true, description: 'Cubes of fresh paneer marinated in yogurt and Indian spices, grilled to perfection in a tandoor.', rating: 4.4, reviews: 120, time: 15, cal: 350, img: IMAGES.paneerTikka, ingredients: 'Paneer, Bell Peppers, Onion, Yogurt, Tandoori Masala' },
      { id: 103, name: 'Chicken Tikka', price: 290, category: 'Starters', isVeg: false, description: 'Boneless chicken chunks marinated in spices and yogurt, grilled on skewers.', rating: 4.6, reviews: 180, time: 15, cal: 400, img: IMAGES.chickenTikka, ingredients: 'Chicken Breast, Yogurt, Ginger, Garlic, Red Chili Powder' },
      { id: 104, name: 'Double Ka Meetha', price: 120, category: 'Desserts', isVeg: true, description: 'Traditional bread pudding dessert of fried bread slices soaked in hot milk with spices, including saffron and cardamom.', rating: 4.7, reviews: 95, time: 10, cal: 480, img: IMAGES.doubleKaMeetha, ingredients: 'Bread, Milk, Sugar, Ghee, Cashews, Cardamom' },
      { id: 105, name: 'Gulab Jamun', price: 90, category: 'Desserts', isVeg: true, description: 'Soft, melt-in-the-mouth fried dumplings soaked in a cardamom flavored sugar syrup.', rating: 4.8, reviews: 190, time: 5, cal: 320, img: IMAGES.gulabJamun, ingredients: 'Milk Solids, Flour, Cardamom, Sugar Syrup, Rose Water' }
    ]
  },
  {
    id: 2,
    name: 'Bawarchi',
    logo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&auto=format&fit=crop&q=60',
    cover: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60',
    rating: 4.3,
    reviewsCount: 980,
    deliveryTime: 30,
    distance: 3.1,
    status: 'Open',
    cuisines: ['Indian', 'Chinese', 'Biryani'],
    menu: [
      { id: 201, name: 'Dal Tadka', price: 180, category: 'Main Course', isVeg: true, description: 'Yellow lentils cooked with onions, tomatoes, and tempered with ghee, cumin, and garlic.', rating: 4.2, reviews: 88, time: 15, cal: 220, img: IMAGES.dalTadka, ingredients: 'Toor Dal, Garlic, Cumin, Tomato, Onion, Ghee' },
      { id: 202, name: 'Chicken 65', price: 260, category: 'Starters', isVeg: false, description: 'Spicy, deep-fried chicken dish originating from Chennai, served with curry leaves and onions.', rating: 4.5, reviews: 210, time: 12, cal: 420, img: IMAGES.chicken65, ingredients: 'Chicken, Corn Flour, Yogurt, Curry Leaves, Red Chili' },
      { id: 203, name: 'Veg Soup', price: 110, category: 'Soups', isVeg: true, description: 'Healthy and comforting clear soup filled with fresh seasonal vegetables.', rating: 4.1, reviews: 40, time: 10, cal: 90, img: IMAGES.vegSoup, ingredients: 'Carrot, Beans, Cabbage, Sweet Corn, Ginger, Garlic' },
      { id: 204, name: 'Tomato Soup', price: 120, category: 'Soups', isVeg: true, description: 'Classic thick tomato soup served with crispy croutons.', rating: 4.3, reviews: 75, time: 10, cal: 110, img: IMAGES.tomatoSoup, ingredients: 'Ripe Tomatoes, Cream, Butter, Garlic, Croutons' },
      { id: 205, name: 'Crispy Corn', price: 190, category: 'Starters', isVeg: true, description: 'Crispy fried sweet corn kernels tossed with spices, onions, and lime juice.', rating: 4.5, reviews: 140, time: 12, cal: 280, img: IMAGES.crispyCorn, ingredients: 'Sweet Corn, Corn Flour, Onion, Spices, Lime' }
    ]
  },
  {
    id: 3,
    name: 'Kritunga',
    logo: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=100&auto=format&fit=crop&q=60',
    cover: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=60',
    rating: 4.2,
    reviewsCount: 750,
    deliveryTime: 35,
    distance: 4.2,
    status: 'Open',
    cuisines: ['Andhra', 'Rayalaseema Specials'],
    menu: [
      { id: 301, name: 'Special Andhra Meals', price: 250, category: 'Thalis', isVeg: true, description: 'Traditional Andhra Thali with Rice, Pappu, Charu, Pachadi, Fry, Curd, and Sweet.', rating: 4.6, reviews: 310, time: 20, cal: 800, img: IMAGES.southMeals, ingredients: 'Rice, Dal, Sambhar, Rasam, Chutney, Curd, Ghee, Papad' },
      { id: 302, name: 'Chicken Mandi', price: 650, category: 'Mandis', isVeg: false, description: 'Traditional Arabian Mandi with spiced rice and slow-cooked tandoori chicken, serving 2 people.', rating: 4.7, reviews: 195, time: 25, cal: 1400, img: IMAGES.chickenMandi, ingredients: 'Mandi Rice, Chicken, Mandi Spices, Almonds, Raisins' }
    ]
  },
  {
    id: 4,
    name: 'Domino\'s Pizza',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&auto=format&fit=crop&q=60',
    cover: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
    rating: 4.4,
    reviewsCount: 2200,
    deliveryTime: 20,
    distance: 1.2,
    status: 'Open',
    cuisines: ['Pizza', 'Fast Food', 'Italian'],
    menu: [
      { id: 401, name: 'Paneer Butter Masala Pizza', price: 399, category: 'Main Course', isVeg: true, description: 'Classic Italian crust topped with creamy paneer butter masala gravy, paneer cubes, and fresh cheese.', rating: 4.5, reviews: 450, time: 15, cal: 850, img: IMAGES.pizza, ingredients: 'Wheat Flour, Paneer, Makhani Sauce, Mozzarella Cheese' }
    ]
  }
];

const INITIAL_COUPONS = [
  { code: 'WELCOME50', discount: 50, minOrder: 199, isPercent: true, desc: 'Get 50% OFF up to ₹100 on your first order' },
  { code: 'FOODIES100', discount: 100, minOrder: 399, isPercent: false, desc: 'Flat ₹100 OFF on orders above ₹399' },
  { code: 'FESTIVAL20', discount: 20, minOrder: 299, isPercent: true, desc: 'Save 20% on all orders celebrating the season' }
];

export const AppProvider = ({ children }) => {
  // Load state from localStorage or use defaults
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('foodies_restaurants');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('foodies_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('foodies_users');
    return saved ? JSON.parse(saved) : [
      {
        name: 'Indhu',
        email: 'indhu@foodies.com',
        phone: '9876543210',
        addresses: [
          { id: 1, tag: 'Home', address: 'Flat 403, Paradise Apartments, Banjara Hills, Hyderabad - 500034' },
          { id: 2, tag: 'Office', address: 'Building 12, Mindspace IT Park, Madhapur, Hyderabad - 500081' }
        ],
        wishlist: [101, 301],
        rewards: 250
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('foodies_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('foodies_current_role');
    return saved ? saved : 'user'; // 'user', 'restaurant', 'admin'
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('foodies_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ORD-9824',
        userId: 'indhu@foodies.com',
        userName: 'Indhu',
        restaurantId: 1,
        restaurantName: 'Paradise Biryani',
        items: [
          { id: 101, name: 'Chicken Dum Biryani', price: 320, quantity: 2 },
          { id: 104, name: 'Double Ka Meetha', price: 120, quantity: 1 }
        ],
        subtotal: 760,
        gst: 38,
        deliveryFee: 40,
        packingFee: 12,
        discount: 0,
        total: 850,
        status: 'Delivered',
        paymentMethod: 'UPI',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        address: 'Flat 403, Paradise Apartments, Banjara Hills, Hyderabad - 500034',
        driverName: 'Ramesh Kumar',
        driverPhone: '9885544321',
        otp: '4295'
      }
    ];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('foodies_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Welcome to Foodies! Use WELCOME50 for your first order.', read: false, time: new Date().toISOString(), type: 'user' }
    ];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('foodies_reviews');
    return saved ? JSON.parse(saved) : [
      { id: 1, restaurantId: 1, foodId: 101, userName: 'Indhu', rating: 5, comment: 'Hands down the best Biryani in Hyderabad! Perfectly cooked meat and beautiful aroma.', img: IMAGES.chickenDumBiryani, likes: 14, timestamp: new Date(Date.now() - 3600000 * 24).toISOString() }
    ];
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('foodies_complaints');
    return saved ? JSON.parse(saved) : [
      { id: 1, userName: 'Indhu', orderId: 'ORD-9824', category: 'Late Delivery', text: 'My order took 45 minutes to arrive instead of the promised 25.', status: 'Resolved', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() }
    ];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('foodies_cart');
    return saved ? JSON.parse(saved) : { restaurantId: null, items: [] };
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('foodies_theme');
    return saved ? saved : 'light';
  });

  // Keep track of which order is currently being tracked (live status)
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(() => {
    const saved = localStorage.getItem('foodies_active_tracking_id');
    return saved ? saved : null;
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('foodies_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('foodies_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('foodies_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('foodies_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('foodies_current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('foodies_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foodies_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('foodies_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('foodies_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('foodies_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('foodies_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (activeTrackingOrderId) {
      localStorage.setItem('foodies_active_tracking_id', activeTrackingOrderId);
    } else {
      localStorage.removeItem('foodies_active_tracking_id');
    }
  }, [activeTrackingOrderId]);

  // Sync state with Firebase Firestore database on load
  useEffect(() => {
    const syncWithFirebase = async () => {
      try {
        // 1. Sync Restaurants
        const restSnap = await getDocs(collection(db, "restaurants"));
        if (restSnap.empty) {
          for (const r of INITIAL_RESTAURANTS) {
            await setDoc(doc(db, "restaurants", String(r.id)), r);
          }
        } else {
          const list = [];
          restSnap.forEach(d => list.push(d.data()));
          setRestaurants(list.sort((a,b) => a.id - b.id));
        }

        // 2. Sync Coupons
        const couponSnap = await getDocs(collection(db, "coupons"));
        if (couponSnap.empty) {
          for (const c of INITIAL_COUPONS) {
            await setDoc(doc(db, "coupons", c.code), c);
          }
        } else {
          const list = [];
          couponSnap.forEach(d => list.push(d.data()));
          setCoupons(list);
        }

        // 3. Sync Users
        const userSnap = await getDocs(collection(db, "users"));
        if (!userSnap.empty) {
          const list = [];
          userSnap.forEach(d => list.push(d.data()));
          setUsers(list);
        }

        // 4. Sync Orders
        const orderSnap = await getDocs(collection(db, "orders"));
        if (!orderSnap.empty) {
          const list = [];
          orderSnap.forEach(d => list.push(d.data()));
          setOrders(list.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
        }

        // 5. Sync Reviews
        const reviewSnap = await getDocs(collection(db, "reviews"));
        if (!reviewSnap.empty) {
          const list = [];
          reviewSnap.forEach(d => list.push(d.data()));
          setReviews(list.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
        }

        // 6. Sync Complaints
        const complaintSnap = await getDocs(collection(db, "complaints"));
        if (!complaintSnap.empty) {
          const list = [];
          complaintSnap.forEach(d => list.push(d.data()));
          setComplaints(list.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
        }

        console.log("Firebase Database connected and synced successfully!");
      } catch (error) {
        console.warn("Firebase not fully configured or access denied. Falling back to local storage.", error);
      }
    };

    syncWithFirebase();
  }, []);

  // Sync state changes back to Firebase Firestore
  useEffect(() => {
    if (restaurants.length > 0) {
      restaurants.forEach(async (r) => {
        try { await setDoc(doc(db, "restaurants", String(r.id)), r); } catch (e) {}
      });
    }
  }, [restaurants]);

  useEffect(() => {
    if (coupons.length > 0) {
      coupons.forEach(async (c) => {
        try { await setDoc(doc(db, "coupons", c.code), c); } catch (e) {}
      });
    }
  }, [coupons]);

  useEffect(() => {
    if (users.length > 0) {
      users.forEach(async (u) => {
        try { await setDoc(doc(db, "users", u.email), u); } catch (e) {}
      });
    }
  }, [users]);

  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(async (o) => {
        try { await setDoc(doc(db, "orders", o.id), o); } catch (e) {}
      });
    }
  }, [orders]);

  useEffect(() => {
    if (reviews.length > 0) {
      reviews.forEach(async (rev) => {
        try { await setDoc(doc(db, "reviews", String(rev.id)), rev); } catch (e) {}
      });
    }
  }, [reviews]);

  useEffect(() => {
    if (complaints.length > 0) {
      complaints.forEach(async (c) => {
        try { await setDoc(doc(db, "complaints", String(c.id)), c); } catch (e) {}
      });
    }
  }, [complaints]);

  // Simulated real-time order progression
  useEffect(() => {
    const activeOrders = orders.filter(o => ['Placed', 'Preparing', 'Cooking', 'Packed', 'Out for Delivery'].includes(o.status));
    if (activeOrders.length === 0) return;

    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let updated = false;
        const nextOrders = prevOrders.map(order => {
          if (['Placed', 'Preparing', 'Cooking', 'Packed', 'Out for Delivery'].includes(order.status)) {
            updated = true;
            let nextStatus = order.status;
            if (order.status === 'Placed') nextStatus = 'Preparing';
            else if (order.status === 'Preparing') nextStatus = 'Cooking';
            else if (order.status === 'Cooking') nextStatus = 'Packed';
            else if (order.status === 'Packed') nextStatus = 'Out for Delivery';
            else if (order.status === 'Out for Delivery') nextStatus = 'Delivered';

            // Push notifications on status change
            if (currentUser && order.userId === currentUser.email) {
              let notifText = `Your order ${order.id} from ${order.restaurantName} is now `;
              if (nextStatus === 'Preparing') notifText = `Your order from ${order.restaurantName} is being prepared 🍗`;
              else if (nextStatus === 'Cooking') notifText = `Chef is preparing your meal at ${order.restaurantName}!`;
              else if (nextStatus === 'Packed') notifText = `Your food has been packed and is ready to go!`;
              else if (nextStatus === 'Out for Delivery') notifText = `Your order from ${order.restaurantName} is out for delivery 🚴`;
              else if (nextStatus === 'Delivered') notifText = `Your order from ${order.restaurantName} has been delivered. Enjoy! ❤️`;

              sendNotification(currentUser.name, notifText, 'user');
            }

            return { ...order, status: nextStatus };
          }
          return order;
        });

        if (updated) return nextOrders;
        return prevOrders;
      });
    }, 20000); // Progress status every 20 seconds for demo

    return () => clearInterval(interval);
  }, [orders, currentUser]);

  // Helper functions
  const sendNotification = (userName, text, type) => {
    const greeting = userName ? `Hi ${userName} 👋 ` : '';
    const newNotif = {
      id: Date.now(),
      text: `${greeting}${text}`,
      read: false,
      time: new Date().toISOString(),
      type: type // 'user', 'owner', 'admin'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const loginUser = (email, role) => {
    if (role === 'user') {
      const user = users.find(u => u.email === email) || {
        name: email.split('@')[0],
        email: email,
        phone: '9876543210',
        addresses: [],
        wishlist: [],
        rewards: 100
      };
      // If user is brand new, save them to state
      if (!users.find(u => u.email === email)) {
        setUsers(prev => [...prev, user]);
      }
      setCurrentUser(user);
      setCurrentRole('user');
      sendNotification(user.name, 'Are you feeling hungry? Order your favorite food now 🍕', 'user');
    } else if (role === 'restaurant') {
      setCurrentUser({ name: 'Paradise Owner', email: 'owner@paradise.com', restaurantId: 1 });
      setCurrentRole('restaurant');
    } else if (role === 'admin') {
      setCurrentUser({ name: 'System Admin', email: 'admin@foodies.com' });
      setCurrentRole('admin');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('user');
    setCart({ restaurantId: null, items: [] });
    setActiveTrackingOrderId(null);
  };

  const addToCart = (restaurantId, item) => {
    setCart(prev => {
      // Clear cart if adding from a different restaurant
      const isDifferentRestaurant = prev.restaurantId !== null && prev.restaurantId !== restaurantId;
      const cleanItems = isDifferentRestaurant ? [] : [...prev.items];
      
      const existing = cleanItems.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cleanItems.push({ id: item.id, name: item.name, price: item.price, img: item.img, quantity: 1 });
      }
      
      return {
        restaurantId: restaurantId,
        items: cleanItems
      };
    });
  };

  const updateCartQuantity = (itemId, amount) => {
    setCart(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity + amount };
        }
        return item;
      }).filter(item => item.quantity > 0);

      const nextRestaurantId = updatedItems.length === 0 ? null : prev.restaurantId;
      return {
        restaurantId: nextRestaurantId,
        items: updatedItems
      };
    });
  };

  const clearCart = () => {
    setCart({ restaurantId: null, items: [] });
  };

  const placeOrder = (orderDetails) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      userId: currentUser.email,
      userName: currentUser.name,
      restaurantId: cart.restaurantId,
      restaurantName: restaurants.find(r => r.id === cart.restaurantId).name,
      items: [...cart.items],
      subtotal: orderDetails.subtotal,
      gst: orderDetails.gst,
      deliveryFee: orderDetails.deliveryFee,
      packingFee: orderDetails.packingFee,
      discount: orderDetails.discount,
      total: orderDetails.total,
      status: 'Placed',
      paymentMethod: orderDetails.paymentMethod,
      timestamp: new Date().toISOString(),
      address: orderDetails.address,
      driverName: 'Krishna Chaitanya',
      driverPhone: '9542288331',
      otp: Math.floor(1000 + Math.random() * 9000).toString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrderId(orderId);

    // Notify Restaurant Owner
    const rest = restaurants.find(r => r.id === newOrder.restaurantId);
    sendNotification(null, `New Order Received for ${rest.name}! Customer: ${currentUser.name}, Amount: ₹${newOrder.total}`, 'owner');
    
    // Notify User
    sendNotification(currentUser.name, `Your order is placed successfully! Order ID: ${orderId} 🍗`, 'user');

    return orderId;
  };

  // Toggle restaurant food availability
  const toggleAvailability = (restaurantId, foodId) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        return {
          ...r,
          menu: r.menu.map(item => {
            if (item.id === foodId) {
              return { ...item, available: item.available === undefined ? false : !item.available };
            }
            return item;
          })
        };
      }
      return r;
    }));
  };

  // Add/Edit menu item
  const updateMenuItem = (restaurantId, item) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        const itemExists = r.menu.some(m => m.id === item.id);
        const newMenu = itemExists
          ? r.menu.map(m => m.id === item.id ? { ...m, ...item } : m)
          : [...r.menu, { ...item, id: Date.now(), rating: 5.0, reviews: 1, available: true }];
        return { ...r, menu: newMenu };
      }
      return r;
    }));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Send user status notification
        const orderUser = users.find(u => u.email === o.userId);
        if (orderUser) {
          let text = `Your order ${o.id} is now ${newStatus}`;
          if (newStatus === 'Preparing') text = `Your Chicken Biryani is being prepared 🍗`;
          else if (newStatus === 'Out for Delivery') text = `Your order is out for delivery 🚴`;
          else if (newStatus === 'Delivered') text = `Your order has been delivered. Enjoy your meal ❤️`;
          sendNotification(orderUser.name, text, 'user');
        }
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  const toggleWishlist = (foodId) => {
    if (!currentUser) return;
    const isWishlisted = currentUser.wishlist?.includes(foodId);
    let nextWishlist = [...(currentUser.wishlist || [])];
    if (isWishlisted) {
      nextWishlist = nextWishlist.filter(id => id !== foodId);
    } else {
      nextWishlist.push(foodId);
    }

    const updatedUser = { ...currentUser, wishlist: nextWishlist };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  const addReview = (restaurantId, foodId, rating, comment) => {
    const newReview = {
      id: Date.now(),
      restaurantId,
      foodId,
      userName: currentUser ? currentUser.name : 'Anonymous',
      rating,
      comment,
      likes: 0,
      timestamp: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);

    // Recalculate restaurant/food ratings
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        // Calculate new average
        const rReviews = reviews.filter(rev => rev.restaurantId === restaurantId);
        const newCount = r.reviewsCount + 1;
        const newRating = parseFloat(((r.rating * r.reviewsCount + rating) / newCount).toFixed(1));
        
        return {
          ...r,
          rating: newRating,
          reviewsCount: newCount,
          menu: r.menu.map(item => {
            if (item.id === foodId) {
              const fCount = item.reviews + 1;
              const fRating = parseFloat(((item.rating * item.reviews + rating) / fCount).toFixed(1));
              return { ...item, rating: fRating, reviews: fCount };
            }
            return item;
          })
        };
      }
      return r;
    }));
  };

  const addComplaint = (category, text, orderId) => {
    const newComplaint = {
      id: Date.now(),
      userName: currentUser.name,
      orderId,
      category,
      text,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    setComplaints(prev => [newComplaint, ...prev]);
    sendNotification(null, `New Complaint raised by ${currentUser.name} regarding Order ${orderId}!`, 'admin');
  };

  const resolveComplaint = (complaintId) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, status: 'Resolved' };
      }
      return c;
    }));
  };

  const addCoupon = (coupon) => {
    setCoupons(prev => [...prev, coupon]);
    sendNotification(null, `New Coupon Available: Use ${coupon.code} to save!`, 'user');
  };

  const addAddress = (addressTag, addressText) => {
    if (!currentUser) return;
    const newAddress = { id: Date.now(), tag: addressTag, address: addressText };
    const nextAddresses = [...(currentUser.addresses || []), newAddress];
    const updatedUser = { ...currentUser, addresses: nextAddresses };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      coupons,
      users,
      currentUser,
      currentRole,
      orders,
      notifications,
      reviews,
      complaints,
      cart,
      theme,
      activeTrackingOrderId,
      setTheme,
      setActiveTrackingOrderId,
      loginUser,
      logout,
      addToCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      toggleAvailability,
      updateMenuItem,
      updateOrderStatus,
      toggleWishlist,
      addReview,
      addComplaint,
      resolveComplaint,
      addCoupon,
      addAddress,
      sendNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};
