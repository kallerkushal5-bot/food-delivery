import { useState, useEffect, useRef, useCallback, useMemo, memo, createContext, useContext } from "react";

/* ─── MOBILE BREAKPOINTS (JS mirrors) ────────────────────────── */
const BP = { sm: 480, md: 768, lg: 1024, xl: 1240 };

/* ══════════════════════════════════════════════════════════════
   🌿 TERRA EATS — Premium UI Upgrade
   + Skeleton Loaders (Restaurant List, Menu, Dish Page)
   + Framer Motion Animations (stagger, spring, exit)
   + Micro-interactions (hover ripple, add-to-cart bounce, etc.)
   + Empty & Error States
   + Sticky headers + smooth scroll
   + UI / Logic separation
   ══════════════════════════════════════════════════════════════ */

/* ─── DESIGN TOKENS ──────────────────────────────────────────── */
const T = {
  forest:  "#162E21",
  leaf:    "#24503A",
  sage:    "#3D7254",
  moss:    "#5E9472",
  fern:    "#84B598",
  mist:    "#BDD8C4",
  cream:   "#F5F1EA",
  sand:    "#EAE3D2",
  earth:   "#7A6040",
  sunset:  "#E06A22",
  amber:   "#C99510",
  dusk:    "#B85218",
  bark:    "#52351A",
  snow:    "#FDFBF7",
  shadow:  "rgba(22,46,33,0.12)",
  shadowD: "rgba(22,46,33,0.28)",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const RESTAURANTS = [
  { id:1, name:"Spice Garden",    cuisine:"North Indian",  rating:4.5, time:"25-30", price:"₹₹",   discount:"30% off",      img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=90", badge:"Popular",    tags:["Biryani","Starters","Mains"] },
  { id:2, name:"Burger Republic", cuisine:"American",      rating:4.3, time:"20-25", price:"₹₹",   discount:"₹50 off",      img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=90", badge:"Fast",       tags:["Burger","Wraps"] },
  { id:3, name:"Pasta Palace",    cuisine:"Italian",       rating:4.7, time:"30-35", price:"₹₹₹",  discount:"20% off",      img:"https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&q=90", badge:"Chef's Pick",tags:["Pizza","Noodles","Salads"] },
  { id:4, name:"Dragon Wok",      cuisine:"Chinese",       rating:4.1, time:"25-30", price:"₹",    discount:"₹75 off",      img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=90", badge:null,         tags:["Noodles","Rolls","Seafood"] },
  { id:5, name:"Pizza Volcano",   cuisine:"Italian",       rating:4.6, time:"15-20", price:"₹₹",   discount:"Buy 1 Get 1",  img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=90", badge:"New",        tags:["Pizza"] },
  { id:6, name:"Sushi Bay",       cuisine:"Japanese",      rating:4.8, time:"35-40", price:"₹₹₹₹", discount:"Free Delivery",img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=90", badge:"Top Rated",  tags:["Sushi","Seafood"] },
  { id:7, name:"Dosa Junction",   cuisine:"South Indian",  rating:4.4, time:"15-20", price:"₹",    discount:"Free Delivery",img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=90", badge:null,         tags:["Coffee","Tacos"] },
  { id:8, name:"Sweet Tooth",     cuisine:"Desserts",      rating:4.9, time:"20-25", price:"₹₹",   discount:"15% off",      img:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=90", badge:"Fan Fav",    tags:["Desserts","Coffee"] },
];

const RESTAURANT_MENUS = {
  1: {
    Starters:[
      {id:101,name:"Paneer Tikka",      price:249,veg:true, img:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=90",desc:"Chargrilled cottage cheese with tangy marinade",rating:4.6,badge:"Bestseller"},
      {id:102,name:"Chicken Kebab",     price:299,veg:false,img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=90",desc:"Juicy minced chicken kebabs on skewers",       rating:4.7,badge:"Spicy"},
      {id:103,name:"Samosa (2 pcs)",    price:79, veg:true, img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=90",desc:"Crispy pastry with spiced potato & peas",       rating:4.4,badge:null},
    ],
    Mains:[
      {id:201,name:"Butter Chicken",    price:319,veg:false,img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=90",desc:"Tender chicken in rich tomato-butter sauce",    rating:4.8,badge:"Bestseller"},
      {id:202,name:"Dal Makhani",       price:199,veg:true, img:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=90",desc:"Slow-cooked black lentils with cream & butter",   rating:4.7,badge:null},
      {id:205,name:"Veg Biryani",       price:229,veg:true, img:"https://images.unsplash.com/photo-1563379091339-03246963d96e?w=400&q=90",desc:"Fragrant basmati rice with vegetables",          rating:4.5,badge:null},
      {id:206,name:"Chicken Biryani",   price:299,veg:false,img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=90",desc:"Hyderabadi dum biryani with saffron & raita",   rating:4.8,badge:"Most Ordered"},
    ],
    Drinks:[
      {id:601,name:"Mango Lassi",       price:89, veg:true, img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=90",desc:"Thick chilled yogurt-mango smoothie",              rating:4.7,badge:"Summer Hit"},
      {id:603,name:"Masala Chai",       price:49, veg:true, img:"https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=90",desc:"Ginger-cardamom spiced milk tea",                  rating:4.6,badge:"Classic"},
    ],
  },
  2: {
    Burgers:[
      {id:301,name:"Classic Beef Burger",price:199,veg:false,img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=90",desc:"Juicy beef patty with lettuce, tomato & cheese",rating:4.5,badge:"Bestseller"},
      {id:302,name:"Chicken Crispy",     price:179,veg:false,img:"https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=90",desc:"Crispy fried chicken with spicy mayo",             rating:4.4,badge:null},
      {id:303,name:"Mushroom Swiss",     price:219,veg:true, img:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=90",desc:"Portobello mushroom with swiss cheese & aioli",  rating:4.6,badge:"New"},
    ],
    Wraps:[
      {id:401,name:"Chicken Wrap",       price:199,veg:false,img:"https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=90",desc:"Grilled chicken in a toasted tortilla wrap",     rating:4.3,badge:null},
      {id:402,name:"Falafel Wrap",       price:179,veg:true, img:"https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=400&q=90",desc:"Crispy falafel with hummus and fresh veggies",    rating:4.5,badge:"Veg Fav"},
    ],
    Drinks:[
      {id:602,name:"Cold Coffee",        price:99, veg:true, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=90",desc:"Creamy blended iced coffee with chocolate",       rating:4.5,badge:null},
    ],
  },
  3: {
    Pizza:[
      {id:501,name:"Margherita",         price:299,veg:true, img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=90",desc:"Classic tomato, mozzarella and fresh basil",      rating:4.7,badge:"Classic"},
      {id:502,name:"Pepperoni",          price:349,veg:false,img:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=90",desc:"Generous pepperoni with extra cheese layer",       rating:4.8,badge:"Bestseller"},
    ],
    Pasta:[
      {id:504,name:"Spaghetti Arrabbiata",price:279,veg:true,img:"https://images.unsplash.com/photo-1551183053-bf91798d792b?w=400&q=90",desc:"Spicy tomato pasta with garlic and olive oil",     rating:4.5,badge:null},
      {id:505,name:"Fettuccine Alfredo", price:319,veg:true, img:"https://images.unsplash.com/photo-1612007688814-9b19b4b3c5e3?w=400&q=90",desc:"Rich creamy sauce with parmesan",                  rating:4.6,badge:"Chef's Pick"},
    ],
    Desserts:[
      {id:506,name:"Tiramisu",           price:199,veg:true, img:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=90",desc:"Classic Italian espresso-soaked dessert",          rating:4.9,badge:"Must Try"},
    ],
  },
  4: {
    Noodles:[
      {id:701,name:"Pad Thai",           price:229,veg:false,img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=90",desc:"Stir-fried rice noodles with peanuts & lime",     rating:4.5,badge:"Popular"},
      {id:702,name:"Hakka Noodles",      price:189,veg:true, img:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=90",desc:"Wok-tossed noodles with crispy veggies",           rating:4.3,badge:null},
    ],
    Rolls:[
      {id:801,name:"Egg Roll",           price:99, veg:false,img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=90",desc:"Crispy spring roll filled with egg and veg",         rating:4.2,badge:null},
      {id:802,name:"Chicken Roll",       price:149,veg:false,img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=90",desc:"Juicy chicken wrapped in thin egg crepe",           rating:4.4,badge:"Bestseller"},
    ],
  },
  5: {
    Pizza:[
      {id:901,name:"Margherita Volcano", price:349,veg:true, img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=90",desc:"Extra stretchy cheese pull, volcano-style crust", rating:4.7,badge:"Signature"},
      {id:902,name:"BBQ Overload",       price:399,veg:false,img:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=90",desc:"Double meat, triple cheese BBQ explosion",          rating:4.8,badge:"Bestseller"},
    ],
    Sides:[
      {id:904,name:"Garlic Knots (6)",   price:129,veg:true, img:"https://images.unsplash.com/photo-1573821663912-569905455b1c?w=400&q=90",desc:"Buttery, garlicky knotted bread rolls",             rating:4.6,badge:"Fan Fav"},
    ],
  },
  6: {
    Sushi:[
      {id:1001,name:"Salmon Roll (8 pcs)",price:449,veg:false,img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=90",desc:"Fresh Atlantic salmon with avocado & cucumber",   rating:4.9,badge:"Top Rated"},
      {id:1002,name:"Dragon Roll",        price:499,veg:false,img:"https://images.unsplash.com/photo-1617196034876-91f29e3f79ea?w=400&q=90",desc:"Shrimp tempura topped with avocado slices",        rating:4.8,badge:"Chef's Pick"},
      {id:1003,name:"Veggie Maki",        price:299,veg:true, img:"https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=90",desc:"Cucumber, avocado and pickled radish rolls",        rating:4.5,badge:null},
    ],
    Drinks:[
      {id:1005,name:"Matcha Latte",       price:149,veg:true, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=90",desc:"Ceremonial grade matcha with oat milk",              rating:4.7,badge:"New"},
    ],
  },
  7: {
    Dosas:[
      {id:1101,name:"Masala Dosa",        price:99, veg:true, img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=90",desc:"Crispy crepe with spiced potato filling",            rating:4.7,badge:"Classic"},
      {id:1102,name:"Ghee Roast Dosa",    price:129,veg:true, img:"https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=400&q=90",desc:"Golden crisp dosa roasted in pure ghee",             rating:4.6,badge:"Bestseller"},
    ],
    Snacks:[
      {id:1103,name:"Vada Sambar",        price:79, veg:true, img:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=90",desc:"Crispy lentil donuts in tangy sambar",               rating:4.5,badge:null},
    ],
    Drinks:[
      {id:1105,name:"Filter Coffee",      price:39, veg:true, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=90",desc:"Authentic South Indian decoction coffee",            rating:4.8,badge:"Must Try"},
    ],
  },
  8: {
    Desserts:[
      {id:1201,name:"Gulab Jamun",        price:119,veg:true, img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=90",desc:"Soft dumplings in rose sugar syrup",                 rating:4.9,badge:"Fan Fav"},
      {id:1202,name:"Choc Lava Cake",     price:199,veg:true, img:"https://images.unsplash.com/photo-1617305855058-336d24456869?w=400&q=90",desc:"Warm cake with molten dark chocolate centre",         rating:4.8,badge:"Must Try"},
      {id:1203,name:"Kulfi Falooda",      price:149,veg:true, img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=90",desc:"Pistachio ice cream with basil seeds & rose syrup",    rating:4.7,badge:null},
      {id:1204,name:"Brownie Sundae",     price:169,veg:true, img:"https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=90",desc:"Warm fudge brownie with vanilla ice cream",           rating:4.9,badge:"Bestseller"},
    ],
    Drinks:[
      {id:1205,name:"Cold Coffee Shake",  price:129,veg:true, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=90",desc:"Thick blended coffee milkshake",                     rating:4.6,badge:null},
    ],
  },
};

const CATEGORIES = [
  {label:"Pizza",   emoji:"🍕", img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80"},
  {label:"Burger",  emoji:"🍔", img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80"},
  {label:"Biryani", emoji:"🍛", img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&q=80"},
  {label:"Sushi",   emoji:"🍱", img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80"},
  {label:"Desserts",emoji:"🍰", img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80"},
  {label:"Coffee",  emoji:"☕", img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80"},
  {label:"Salads",  emoji:"🥗", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80"},
  {label:"Noodles", emoji:"🍜", img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80"},
  {label:"Wraps",   emoji:"🌯", img:"https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&q=80"},
  {label:"Rolls",   emoji:"🥡", img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80"},
];

const CATEGORY_RESTAURANTS = {
  Pizza:[3,5], Burger:[2], Biryani:[1], Sushi:[6], Desserts:[8],
  Coffee:[7,8], Salads:[3], Noodles:[4], Wraps:[2,4], Rolls:[4],
};

const DISH_RESTAURANTS = {
  "Butter Chicken":[1],"Dal Makhani":[1],"Paneer Tikka":[1],"Chicken Biryani":[1],
  "Classic Beef Burger":[2],"Chicken Crispy":[2],"Mushroom Swiss":[2],"Chicken Wrap":[2,4],
  "Margherita":[3,5],"Pepperoni":[3,5],"Spaghetti Arrabbiata":[3],"Tiramisu":[3,8],
  "Pad Thai":[4],"Hakka Noodles":[4],"Egg Roll":[4],"Chicken Roll":[4,2],
  "Margherita Volcano":[5],"BBQ Overload":[5],
  "Salmon Roll (8 pcs)":[6],"Dragon Roll":[6],"Veggie Maki":[6],
  "Masala Dosa":[7],"Ghee Roast Dosa":[7],"Filter Coffee":[7],
  "Gulab Jamun":[8],"Choc Lava Cake":[8],"Brownie Sundae":[8],
};

const TRENDING = [
  {id:'t1',name:"Butter Chicken",rest:"Spice Garden",restId:1,rating:4.9,reviews:"2.4k",price:319,img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=90",tag:"🔥 Trending",veg:false},
  {id:'t2',name:"Dragon Sushi Platter",rest:"Sushi Bay",restId:6,rating:4.8,reviews:"1.8k",price:599,img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=90",tag:"⭐ Top Rated",veg:false},
  {id:'t3',name:"Gulab Jamun Sundae",rest:"Sweet Tooth",restId:8,rating:4.9,reviews:"3.1k",price:189,img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=90",tag:"💛 Fan Fav",veg:true},
  {id:'t4',name:"Margherita Volcano",rest:"Pizza Volcano",restId:5,rating:4.7,reviews:"1.2k",price:349,img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=90",tag:"🆕 New",veg:true},
  {id:'t5',name:"Chicken Dum Biryani",rest:"Spice Garden",restId:1,rating:4.8,reviews:"4.7k",price:299,img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=90",tag:"🔥 Trending",veg:false},
  {id:'t6',name:"Mango Lassi",rest:"Dosa Junction",restId:7,rating:4.7,reviews:"3.1k",price:89,img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=90",tag:"☀️ Summer Hit",veg:true},
];

const FAQS = [
  {q:"How long does delivery take?",a:"Standard delivery takes 25–45 minutes depending on your location and restaurant. You can track your order live from the moment it's placed."},
  {q:"What is the minimum order amount?",a:"There's no platform-wide minimum. Individual restaurants may set their own — usually between ₹99–₹199."},
  {q:"Can I cancel or modify my order?",a:"Orders can be cancelled within 2 minutes of placing. After that, please contact our support."},
  {q:"Are there vegetarian-only restaurants?",a:"Yes! Use the 'Pure Veg' filter in Explore. Many restaurants on Terra Eats are certified vegetarian."},
  {q:"Do you deliver at night?",a:"Most restaurants deliver until 11 PM. Some partner restaurants offer late-night delivery until 1 AM."},
  {q:"How are refunds processed?",a:"Refunds are credited to your original payment method within 5–7 business days, or instantly to your Terra wallet."},
];

/* ═══════════════════════════════════════════════════════════════
   CSS — Mobile-First Responsive Design System
   Strategy: Base styles target 320–480px phones.
   Progressive enhancement via min-width media queries.
   ═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&display=swap');

/* ─── RESET & BASE ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: ${T.cream}; color: ${T.forest};
  -webkit-font-smoothing: antialiased;
  /* Prevent horizontal scroll on mobile */
  overflow-x: hidden;
  /* Improve touch scrolling */
  -webkit-overflow-scrolling: touch;
}
button { font-family: inherit; touch-action: manipulation; }
img { max-width: 100%; display: block; }

/* ─── TOUCH-ACTION: prevent 300ms click delay ─── */
a, button, [role="button"] { touch-action: manipulation; }

/* ─── CSS CUSTOM PROPERTIES for theming ─── */
:root {
  --nav-h: 60px;
  --mob-nav-h: 64px;
  --container-px: 16px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 6px rgba(22,46,33,0.06), 0 4px 16px rgba(22,46,33,0.06);
  --shadow-md: 0 4px 16px rgba(22,46,33,0.10), 0 12px 32px rgba(22,46,33,0.08);
  --shadow-lg: 0 8px 32px rgba(22,46,33,0.14), 0 24px 56px rgba(22,46,33,0.10);
  --shadow-card: 0 2px 8px rgba(22,46,33,0.05), 0 8px 24px rgba(22,46,33,0.07);
  --touch-min: 44px;
  --section-py: 52px;
}
@media (min-width: 768px) {
  :root {
    --nav-h: 68px;
    --mob-nav-h: 0px;
    --container-px: 28px;
    --section-py: 80px;
  }
}

/* ─── PERFORMANCE: GPU-composited layers & layout containment ─── */
.rest-card, .trending-card, .cat-item {
  will-change: transform;
  contain: layout style;
  transform: translateZ(0); /* promote to own compositor layer */
}
/* Avoid will-change on too many static elements — only on interactive cards */
.rest-card:hover, .trending-card:hover { will-change: transform, box-shadow; }

/* ─── SMOOTH SCROLLING CONTAINERS: promote to own layer ─────── */
.trending-scroll, .cat-carousel-wrap, .banner-slides {
  will-change: transform;
  -webkit-overflow-scrolling: touch;
}

/* ─── SKELETON LOADER ─── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skel {
  background: linear-gradient(90deg, #e6e0d6 25%, #ede8e0 50%, #e6e0d6 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 8px;
}
.skel-card { background: white; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid rgba(61,114,84,0.08); box-shadow: var(--shadow-card); }
.skel-img  { width: 100%; height: 180px; border-radius: 0; }
@media (min-width: 768px) { .skel-img { height: 200px; } }
.skel-body { padding: 14px 16px 18px; display: flex; flex-direction: column; gap: 10px; }
.skel-line-lg  { height: 16px; width: 70%; border-radius: 5px; }
.skel-line-md  { height: 12px; width: 50%; border-radius: 5px; }
.skel-line-sm  { height: 12px; width: 35%; border-radius: 5px; }
.skel-badge    { height: 22px; width: 80px; border-radius: 11px; }
.skel-btn      { height: 40px; width: 100%; border-radius: 10px; margin-top: 4px; }
.skel-menu-card { background: white; border-radius: var(--radius-md); overflow: hidden; display: flex; border: 1px solid rgba(107,158,122,0.1); }
.skel-menu-img  { width: 110px; min-width: 110px; height: 120px; flex-shrink: 0; }
@media (min-width: 480px) { .skel-menu-img { width: 130px; min-width: 130px; height: 130px; } }
.skel-menu-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }

/* ─── ANIMATIONS (reduced-motion safe) ─── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
@keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes scaleIn  { from { opacity:0; transform:scale(0.94) } to { opacity:1; transform:scale(1) } }
@keyframes bounceIn { 0% { transform:scale(0.6);opacity:0 } 60% { transform:scale(1.08);opacity:1 } 80% { transform:scale(0.97) } 100% { transform:scale(1) } }
@keyframes pulse    { 0%,100% { transform:scale(1) } 50% { transform:scale(1.05) } }
@keyframes ripple   { 0% { transform:scale(0);opacity:0.5 } 100% { transform:scale(4);opacity:0 } }
@keyframes toastIn  { from { opacity:0;transform:translateX(-50%) translateY(16px) } to { opacity:1;transform:translateX(-50%) translateY(0) } }
@keyframes pageFadeIn { from { opacity:0;transform:translateY(10px) } to { opacity:1;transform:none } }
@keyframes trackPulse { 0%,100% { box-shadow:0 0 0 3px rgba(232,116,42,0.15) } 50% { box-shadow:0 0 0 8px rgba(232,116,42,0.05) } }
@keyframes footerFloat { 0% { transform:translateY(0) rotate(0deg);opacity:0.06 } 50% { opacity:0.10 } 100% { transform:translateY(-80px) rotate(20deg);opacity:0 } }
@keyframes kenBurns { from { transform:scale(1) } to { transform:scale(1.06) } }
@keyframes spin { to { transform:rotate(360deg) } }
@keyframes bannerZoom { from { transform:scale(1.06) } to { transform:scale(1) } }
@keyframes slideUp { from { opacity:0;transform:translateY(100%) } to { opacity:1;transform:translateY(0) } }

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

.animate-fade-up     { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
.animate-fade-in     { animation: fadeIn 0.35s ease both; }
.animate-scale-in    { animation: scaleIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }
.page-enter          { animation: pageFadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }

/* ─── RIPPLE BUTTON ─── */
.btn-ripple { position:relative; overflow:hidden; }
.btn-ripple::after { content:''; position:absolute; width:20px; height:20px; background:rgba(255,255,255,0.4); border-radius:50%; top:var(--ry,50%); left:var(--rx,50%); transform:scale(0); pointer-events:none; }
.btn-ripple:active::after { animation:ripple 0.5s ease-out; }

/* ─── CONTAINER / SECTION ─── */
.container { max-width: ${BP.xl}px; margin: 0 auto; padding: 0 var(--container-px); }
.section    { padding: var(--section-py) 0; }

/* ─── NAVBAR — mobile-first ─── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 800;
  transition: background 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s, transform 0.3s;
  background: transparent;
  border-bottom: 1px solid transparent;
  height: var(--nav-h);
}
/* Light mode: always have background for visibility */
:not(.dark-mode) .navbar {
  background: rgba(253,250,245,0.95);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border-bottom-color: rgba(107,158,122,0.14);
  box-shadow: 0 2px 20px rgba(26,58,42,0.08);
}
/* Solid non-home navbar: always fully opaque in light mode */
.navbar.solid {
  background: rgba(253,250,245,0.99);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border-bottom-color: rgba(107,158,122,0.18);
  box-shadow: 0 2px 16px rgba(26,58,42,0.10);
}
/* Scrolled home navbar */
.navbar.scrolled {
  background: rgba(253,250,245,0.97);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border-bottom-color: rgba(107,158,122,0.14);
  box-shadow: 0 2px 20px rgba(26,58,42,0.08);
}
/* Dark mode: keep existing dark navbar appearance */
.dark-mode .navbar {
  background: rgba(20,40,30,0.95);
  border-bottom-color: rgba(107,158,122,0.18);
  box-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.dark-mode .navbar.solid,
.dark-mode .navbar.scrolled {
  background: rgba(20,40,30,0.97);
  border-bottom-color: rgba(107,158,122,0.18);
  box-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.nav-hidden  { transform: translateY(-100%); }
.nav-visible { transform: translateY(0); }

.nav-inner {
  display: flex; align-items: center; gap: 10px;
  padding: 0 var(--container-px); height: var(--nav-h);
  max-width: ${BP.xl}px; margin: 0 auto;
}

/* Logo */
.nav-logo {
  font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700;
  color: white; background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 9px;
  transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
  padding: 8px 6px; border-radius: 10px;
  min-height: var(--touch-min);
  flex-shrink: 0; letter-spacing: -0.01em;
}
@media (min-width: 768px) { .nav-logo { font-size: 21px; } }
:not(.dark-mode) .nav-logo { color: ${T.forest}; }
.dark-mode .nav-logo { color: white; }
.navbar.scrolled .nav-logo, .navbar.solid .nav-logo { color: ${T.forest}; }
.dark-mode .navbar.scrolled .nav-logo, .dark-mode .navbar.solid .nav-logo { color: white; }
.nav-logo:hover { opacity: 0.85; transform: scale(1.01); }
.logo-leaf {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, ${T.sage}, ${T.leaf});
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
  font-size: 15px; box-shadow: 0 3px 12px rgba(36,80,58,0.35);
  border: 1.5px solid rgba(132,181,152,0.25);
  transition: transform 0.25s cubic-bezier(0.22,1,0.36,1); flex-shrink: 0;
}
.nav-logo:hover .logo-leaf { transform: rotate(-8deg) scale(1.1); }

/* Desktop nav links — hidden on mobile */
.nav-links { display: none; gap: 2px; flex: 1; justify-content: center; }
@media (min-width: ${BP.lg}px) { .nav-links { display: flex; } }

.nav-link {
  background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 8px;
  transition: all 0.2s; position: relative;
  min-height: var(--touch-min); display: flex; align-items: center;
}
:not(.dark-mode) .nav-link { color: ${T.forest}; }
.navbar.scrolled .nav-link, .navbar.solid .nav-link { color: ${T.forest}; }
.nav-link:hover { background: rgba(74,124,89,0.12); }
.navbar.scrolled .nav-link:hover, .navbar.solid .nav-link:hover { color: ${T.forest}; }
.nav-link.active { font-weight: 700; }
.navbar.solid .nav-link.active, .navbar.scrolled .nav-link.active { color: ${T.forest}; background: rgba(74,124,89,0.1); }
.nav-link.active::after { content:''; position:absolute; bottom:4px; left:50%; transform:translateX(-50%); width:16px; height:2px; background:${T.sage}; border-radius:2px; }
/* Dark mode nav links */
.dark-mode .nav-link { color: rgba(200,223,197,0.9); }
.dark-mode .navbar.solid .nav-link,
.dark-mode .navbar.scrolled .nav-link { color: rgba(200,223,197,0.9); }
.dark-mode .navbar.solid .nav-link.active,
.dark-mode .navbar.scrolled .nav-link.active { color: white; }

.nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }

/* Dark toggle — always visible */
.dark-toggle-wrap { display: flex; align-items: center; gap: 5px; }
.dark-toggle-label { font-size: 14px; display: none; }
@media (min-width: 480px) { .dark-toggle-label { display: block; } }
.dark-toggle { position:relative; width:40px; height:22px; background:rgba(107,158,122,0.25); border-radius:11px; border:1px solid rgba(107,158,122,0.3); cursor:pointer; transition:background 0.3s; min-width:40px; }
.dark-toggle.on { background:${T.leaf}; }
.dark-toggle-ball { position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:white; transition:transform 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow:0 1px 4px rgba(0,0,0,0.2); }
.dark-toggle.on .dark-toggle-ball { transform:translateX(18px); }

/* Login button */
.nav-btn-sm {
  background: rgba(255,255,255,0.15); color: white;
  border: 1.5px solid rgba(255,255,255,0.35);
  cursor: pointer; padding: 0 14px; border-radius: 8px;
  font-size: 13px; font-weight: 700;
  transition: all 0.2s; backdrop-filter: blur(8px);
  height: 36px; display: flex; align-items: center;
  /* Hide text on tiny phones, show icon */
}
:not(.dark-mode) .nav-btn-sm {
  background: ${T.forest}; color: white; border-color: transparent;
}
.dark-mode .nav-btn-sm {
  background: rgba(255,255,255,0.15); color: white;
  border: 1.5px solid rgba(255,255,255,0.35);
}
.navbar.scrolled .nav-btn-sm, .navbar.solid .nav-btn-sm {
  background: ${T.forest}; color: white; border-color: transparent;
}
.dark-mode .navbar.scrolled .nav-btn-sm, .dark-mode .navbar.solid .nav-btn-sm {
  background: ${T.sage}; color: white; border-color: transparent;
}
.nav-btn-sm:hover { filter: brightness(1.12); transform: translateY(-1px); }
.nav-btn-sm:active { transform: scale(0.97); }

/* Icon buttons */
.nav-btn-icon {
  background: none; border: none; color: inherit; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  padding: 8px; border-radius: 8px; transition: all 0.2s;
  min-height: var(--touch-min);
}
.nav-btn-icon:hover { background: rgba(74,124,89,0.12); }

/* Cart button — compact on mobile */
.nav-cart {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.15); color: white;
  border: 1.5px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(8px); cursor: pointer;
  padding: 0 12px; border-radius: 10px;
  font-size: 13px; font-weight: 700;
  transition: all 0.2s; position: relative;
  height: 38px; white-space: nowrap;
}
/* On mobile, hide "Cart" text, show only icon */
.nav-cart-text { display: none; }
@media (min-width: 480px) { .nav-cart-text { display: inline; } }
:not(.dark-mode) .nav-cart {
  background: ${T.forest}; color: white; border-color: transparent;
  box-shadow: 0 2px 10px rgba(26,58,42,0.2);
}
.dark-mode .nav-cart {
  background: rgba(255,255,255,0.15); color: white;
  border: 1.5px solid rgba(255,255,255,0.3);
}
.navbar.scrolled .nav-cart, .navbar.solid .nav-cart {
  background: ${T.forest}; color: white; border-color: transparent;
  box-shadow: 0 2px 10px rgba(26,58,42,0.2);
}
.dark-mode .navbar.scrolled .nav-cart, .dark-mode .navbar.solid .nav-cart {
  background: ${T.sage}; color: white;
}
.nav-cart:hover { transform: scale(1.04); box-shadow: 0 4px 16px rgba(26,58,42,0.25); }
.cart-badge {
  position: absolute; top: -6px; right: -6px;
  background: ${T.sunset}; color: white;
  font-size: 10px; font-weight: 800; width: 18px; height: 18px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  border: 2px solid white; animation: bounceIn 0.3s cubic-bezier(0.22,1,0.36,1);
}

/* ─── MOBILE BOTTOM NAV ─── */
.mob-nav {
  display: flex;
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 800;
  background: rgba(253,251,247,0.98);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-top: 1px solid rgba(61,114,84,0.10);
  box-shadow: 0 -4px 24px rgba(22,46,33,0.08);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  height: calc(var(--mob-nav-h) + env(safe-area-inset-bottom, 0px));
}
@media (min-width: ${BP.lg}px) { .mob-nav { display: none; } }

.mob-btn {
  flex: 1; background: none; border: none; cursor: pointer;
  padding: 8px 4px 10px;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  font-size: 9px; font-weight: 600;
  color: ${T.moss}; text-transform: uppercase; letter-spacing: 0.06em;
  transition: all 0.18s cubic-bezier(0.22,1,0.36,1); position: relative;
  min-width: var(--touch-min);
}
.mob-btn.active { color: ${T.forest}; }
.mob-btn.active::before {
  content: ''; position: absolute; top: 0; left: 25%; right: 25%;
  height: 2px; background: ${T.sage}; border-radius: 0 0 3px 3px;
}
.mob-btn:active { transform: scale(0.88); }
.mob-btn-icon { font-size: 20px; position: relative; line-height: 1; }
.mob-btn-label { font-size: 9px; line-height: 1; }

/* ─── HERO ─── */
.video-hero {
  position: relative; min-height: 100svh;
  display: flex; align-items: center; overflow: hidden;
  background: ${T.forest};
}
@media (min-width: ${BP.md}px) { .video-hero { min-height: 95vh; } }
.video-overlay { position:absolute; inset:0; background:linear-gradient(160deg,rgba(10,30,20,0.72) 0%,rgba(26,58,42,0.5) 50%,rgba(10,30,20,0.65) 100%); z-index:1; }
.video-fallback { position:absolute; inset:0; background:linear-gradient(135deg,${T.forest} 0%,${T.leaf} 60%,${T.sage} 100%); }
.video-hero-content {
  position: relative; z-index: 2;
  padding: 80px var(--container-px) 80px;
  width: 100%; max-width: ${BP.xl}px; margin: 0 auto;
}
@media (min-width: ${BP.md}px) { .video-hero-content { padding: 100px 28px 80px; } }

.hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(38px, 8vw, 88px); font-weight: 900;
  color: white; line-height: 1.0; margin-bottom: 18px;
  text-shadow: 0 4px 28px rgba(0,0,0,0.3);
  letter-spacing: -0.01em;
}
.hero-sub {
  font-size: clamp(14px, 2vw, 18px); color: rgba(220,235,220,0.9);
  font-weight: 300; margin-bottom: 30px; line-height: 1.7; max-width: 480px;
}
.hero-search {
  display: flex; align-items: center; background: rgba(255,255,255,0.97);
  border-radius: 14px; overflow: hidden; max-width: 540px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.6); transition: box-shadow 0.3s;
}
.hero-search:focus-within { box-shadow: 0 20px 56px rgba(0,0,0,0.26), 0 0 0 3px rgba(61,114,84,0.28); }
.hero-search input {
  flex: 1; border: none; outline: none;
  padding: 16px 12px; font-size: 15px;
  color: ${T.forest}; background: transparent; font-family: inherit;
  min-width: 0;
}
@media (min-width: ${BP.md}px) { .hero-search input { padding: 18px 14px; } }
.hero-search-btn {
  background: linear-gradient(135deg, ${T.sage}, ${T.leaf}); color: white;
  border: none; cursor: pointer; padding: 16px 24px; font-size: 13px;
  font-weight: 700; letter-spacing: 0.04em; transition: all 0.2s;
  white-space: nowrap; flex-shrink: 0;
}
@media (min-width: ${BP.md}px) { .hero-search-btn { padding: 17px 30px; } }
.hero-search-btn:hover { filter: brightness(1.1); }
.hero-pills { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 20px; }
.hero-pill {
  background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.20);
  color: rgba(255,255,255,0.88); border-radius: 20px;
  padding: 7px 15px; font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
  min-height: 36px; display: inline-flex; align-items: center;
}
.hero-pill:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.38); }
.hero-stat-bar { display: flex; gap: 28px; margin-top: 40px; flex-wrap: wrap; }
@media (min-width: ${BP.md}px) { .hero-stat-bar { gap: 44px; margin-top: 52px; } }
.hero-stat { display: flex; flex-direction: column; gap: 3px; }
.hero-stat-n { font-family: 'Playfair Display',serif; font-size: clamp(22px,4vw,30px); font-weight: 700; color: white; line-height: 1; }
.hero-stat-l { font-size: 10px; color: rgba(189,216,196,0.8); text-transform: uppercase; letter-spacing: 0.12em; font-weight: 500; }

/* ─── SECTION HEADINGS ─── */
.section-head { margin-bottom: 32px; }
@media (min-width: ${BP.md}px) { .section-head { margin-bottom: 48px; } }
.section-label { font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.sage}; display: inline-block; margin-bottom: 10px; }
.section-title { font-family: 'Playfair Display', serif; font-size: clamp(26px, 4vw, 46px); font-weight: 700; color: ${T.forest}; line-height: 1.08; margin-bottom: 10px; }
.section-sub { font-size: 14px; color: ${T.moss}; font-weight: 400; line-height: 1.65; max-width: 480px; opacity: 0.85; }
@media (min-width: ${BP.md}px) { .section-sub { font-size: 15px; } }

/* ─── CATEGORY CAROUSEL ─── */
.cat-carousel-wrap { overflow: hidden; cursor: grab; padding: 12px 0; -webkit-overflow-scrolling: touch; }
.cat-carousel-wrap:active { cursor: grabbing; }
.cat-carousel-track { display: flex; gap: 12px; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); will-change: transform; padding: 4px 0; }
@media (min-width: ${BP.md}px) { .cat-carousel-track { gap: 16px; } }
.cat-carousel-track.dragging { transition: none; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; flex-shrink: 0; width: 84px; transition: transform 0.22s cubic-bezier(0.22,1,0.36,1); }
@media (min-width: ${BP.md}px) { .cat-item { width: 100px; gap: 8px; } }
.cat-item:active { transform: scale(0.94); }
@media (hover: hover) { .cat-item:hover { transform: translateY(-4px) scale(1.04); } }
.cat-item.active .cat-img-ring { border-color: ${T.sage}; box-shadow: 0 0 0 3px rgba(74,124,89,0.2), 0 6px 20px rgba(74,124,89,0.25); }
.cat-img-ring { width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 2.5px solid rgba(107,158,122,0.2); transition: all 0.3s; }
@media (min-width: ${BP.md}px) { .cat-img-ring { width: 80px; height: 80px; } }
.cat-img-ring img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
@media (hover: hover) { .cat-item:hover .cat-img-ring img { transform: scale(1.1); } }
.cat-label { font-size: 10px; font-weight: 600; color: ${T.forest}; text-align: center; white-space: nowrap; }
@media (min-width: ${BP.md}px) { .cat-label { font-size: 11px; } }
.cat-carousel-btn {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
  width: 34px; height: 34px; border-radius: 50%; background: white;
  border: 1px solid rgba(107,158,122,0.2); color: ${T.sage}; font-size: 18px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 12px rgba(26,58,42,0.12); transition: all 0.2s;
}
@media (hover: hover) { .cat-carousel-btn:hover { background: ${T.forest}; color: white; transform: translateY(-50%) scale(1.08); } }
.cat-carousel-btn.prev { left: -4px; }
.cat-carousel-btn.next { right: -4px; }

/* ─── BANNER CAROUSEL ─── */
.banner-carousel { position: relative; overflow: hidden; touch-action: pan-y; }
.banner-slides { display: flex; transition: transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94); will-change: transform; }
.banner-slide { min-width: 100%; position: relative; height: 260px; overflow: hidden; }
@media (min-width: ${BP.md}px) { .banner-slide { height: 380px; } }
@media (min-width: ${BP.lg}px) { .banner-slide { height: 480px; } }
.banner-slide img { width: 100%; height: 100%; object-fit: cover; }
.banner-slide.active img { animation: kenBurns 7s ease forwards; }
.banner-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(10,30,20,0.85) 0%, rgba(26,58,42,0.45) 60%, transparent 100%);
  display: flex; align-items: center; padding: 0 20px;
}
@media (min-width: ${BP.md}px) { .banner-overlay { padding: 0 48px; } }
.banner-content { color: white; max-width: 380px; }
@media (min-width: ${BP.md}px) { .banner-content { max-width: 460px; } }
.banner-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.banner-dot { width: 6px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.4); border: none; cursor: pointer; transition: all 0.3s; padding: 0; min-width: 6px; }
@media (min-width: ${BP.md}px) { .banner-dot { width: 8px; height: 8px; border-radius: 4px; } }
.banner-dot.active { background: white; width: 22px; }
@media (min-width: ${BP.md}px) { .banner-dot.active { width: 28px; } }
/* Arrows: hidden on small mobile (rely on swipe), visible on tablet+ */
.banner-arrow {
  display: none;
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 42px; height: 42px; border-radius: 50%;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3); color: white;
  font-size: 20px; cursor: pointer;
  align-items: center; justify-content: center; transition: all 0.2s; z-index: 10;
}
@media (min-width: ${BP.md}px) { .banner-arrow { display: flex; } }
.banner-arrow:hover { background: rgba(255,255,255,0.3); transform: translateY(-50%) scale(1.08); }
.banner-arrow.prev { left: 16px; }
.banner-arrow.next { right: 16px; }

/* ─── RESTAURANT CARDS — 2-col on mobile ─── */
.rest-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (min-width: ${BP.md}px) { .rest-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
@media (min-width: 1100px) { .rest-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

.rest-card {
  background: white; border-radius: var(--radius-lg); overflow: hidden;
  box-shadow: var(--shadow-card); cursor: pointer;
  transition: transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s;
  border: 1px solid rgba(61,114,84,0.08);
  -webkit-tap-highlight-color: transparent;
}
@media (hover: hover) { .rest-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: rgba(132,181,152,0.4); } }
.rest-card:active { transform: scale(0.985); }

.rest-img { position: relative; height: 140px; overflow: hidden; }
@media (min-width: ${BP.md}px) { .rest-img { height: 180px; } }
@media (min-width: ${BP.lg}px) { .rest-img { height: 200px; } }
.rest-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
@media (hover: hover) { .rest-card:hover .rest-img img { transform: scale(1.08); } }
.rest-badge { position:absolute; top:10px; left:10px; background:rgba(22,46,33,0.88); backdrop-filter:blur(10px); color:white; font-size:8px; font-weight:700; padding:4px 9px; border-radius:6px; letter-spacing:0.07em; text-transform:uppercase; border:1px solid rgba(255,255,255,0.12); }
.rest-discount { position:absolute; top:10px; right:10px; background:linear-gradient(135deg,${T.sunset},${T.dusk}); color:white; font-size:8px; font-weight:700; padding:4px 9px; border-radius:6px; letter-spacing:0.04em; }
.rest-body { padding: 14px 14px 16px; }
@media (min-width: ${BP.md}px) { .rest-body { padding: 16px 18px 20px; } }
.rest-name { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:${T.forest}; margin-bottom:3px; line-height:1.25; }
@media (min-width: ${BP.md}px) { .rest-name { font-size: 17px; } }
.rest-cuisine { font-size:11px; color:${T.moss}; margin-bottom:10px; font-weight:400; letter-spacing:0.01em; }
.rest-meta { display:flex; align-items:center; gap:8px; font-size:11px; flex-wrap:wrap; }
.star { color:${T.amber}; font-size:11px; }
.rating { font-weight:700; color:${T.forest}; }
.rest-time { color:${T.moss}; }
.rest-price { color:${T.earth}; font-weight:600; margin-left:auto; }

/* ─── TRENDING — horizontal scroll on mobile ─── */
.trending-scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  /* hide scrollbar */
  scrollbar-width: none;
}
.trending-scroll::-webkit-scrollbar { display: none; }
@media (min-width: ${BP.md}px) {
  .trending-scroll {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    overflow-x: visible;
    scroll-snap-type: none;
    gap: 20px;
  }
}
@media (min-width: ${BP.lg}px) { .trending-scroll { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

.trending-card {
  background: white; border-radius: var(--radius-lg); overflow: hidden;
  box-shadow: var(--shadow-card); border: 1px solid rgba(61,114,84,0.08);
  cursor: pointer; transition: transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s;
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 240px;
  -webkit-tap-highlight-color: transparent;
}
@media (min-width: ${BP.md}px) { .trending-card { width: auto; } }
@media (hover: hover) { .trending-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(132,181,152,0.35); } }
.trending-card:active { transform: scale(0.985); }
.trending-img { position:relative; height:180px; overflow:hidden; }
@media (min-width: ${BP.md}px) { .trending-img { height: 200px; } }
@media (min-width: ${BP.lg}px) { .trending-img { height: 220px; } }
.trending-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.55s cubic-bezier(0.4,0,0.2,1); }
@media (hover: hover) { .trending-card:hover .trending-img img { transform:scale(1.07); } }
.trending-tag { position:absolute; top:10px; left:10px; background:rgba(22,46,33,0.88); backdrop-filter:blur(10px); color:white; font-size:10px; font-weight:600; padding:4px 10px; border-radius:20px; letter-spacing:0.04em; border:1px solid rgba(255,255,255,0.12); }
.trending-veg { position:absolute; top:10px; right:10px; width:20px; height:20px; border-radius:3px; border:2px solid; display:flex; align-items:center; justify-content:center; font-size:8px; font-weight:900; background:white; }
.trending-body { padding: 14px 16px 10px; }
.trending-name { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:${T.forest}; margin-bottom:3px; line-height:1.25; }
.trending-rest { font-size:10px; color:${T.moss}; margin-bottom:10px; cursor:pointer; transition:color 0.2s; font-weight:500; letter-spacing:0.01em; }
@media (hover: hover) { .trending-rest:hover { color:${T.sage}; text-decoration:underline; } }
.trending-meta { display:flex; align-items:center; justify-content:space-between; }
.trending-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:${T.leaf}; }
.trending-rating { display:flex; align-items:center; gap:4px; font-size:11px; color:${T.moss}; }
.trending-add-btn {
  width: calc(100% - 24px); margin: 0 12px 14px;
  background: linear-gradient(135deg,${T.sage},${T.leaf}); color:white;
  border:none; cursor:pointer; padding:12px 12px; font-size:13px;
  font-weight:600; letter-spacing:0.03em; border-radius:10px;
  transition:all 0.22s; display:block;
  min-height: var(--touch-min);
  box-shadow: 0 3px 12px rgba(36,80,58,0.22);
}
@media (hover: hover) { .trending-add-btn:hover { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 6px 20px rgba(36,80,58,0.32); } }
.trending-add-btn:active { transform:scale(0.97); }

/* ─── MENU PAGE ─── */
.menu-hero { background:linear-gradient(150deg,${T.forest} 0%,${T.leaf} 100%); padding:48px 0 0; position:relative; overflow:hidden; }
@media (min-width: ${BP.md}px) { .menu-hero { padding: 60px 0 0; } }
.menu-sticky-cats { position:sticky; top:var(--nav-h); z-index:100; background:rgba(22,46,33,0.97); backdrop-filter:blur(16px); border-bottom:1px solid rgba(189,216,196,0.1); }
.menu-cat-tabs { display:flex; gap:6px; overflow-x:auto; padding:10px 16px; scrollbar-width:none; -webkit-overflow-scrolling:touch; scroll-snap-type:x proximity; }
@media (min-width: ${BP.md}px) { .menu-cat-tabs { padding: 12px 28px; } }
.menu-cat-tabs::-webkit-scrollbar { display:none; }
.menu-cat-tab {
  background:rgba(255,255,255,0.07); border:1px solid rgba(189,216,196,0.14);
  color:rgba(189,216,196,0.72); border-radius:20px; padding:8px 18px;
  font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s; white-space:nowrap;
  min-height: 36px; display:inline-flex; align-items:center; scroll-snap-align:start;
  flex-shrink:0; letter-spacing:0.02em;
}
.menu-cat-tab.active { background:white; color:${T.forest}; border-color:white; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
@media (hover: hover) { .menu-cat-tab:hover:not(.active) { background:rgba(255,255,255,0.16); color:white; } }
.menu-items-grid { display:grid; grid-template-columns:1fr; gap:12px; }
@media (min-width: ${BP.md}px) { .menu-items-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
@media (min-width: ${BP.xl}px) { .menu-items-grid { gap: 18px; } }

.menu-item-card {
  background:white; border-radius:var(--radius-md); overflow:hidden;
  box-shadow:var(--shadow-card); border:1px solid rgba(61,114,84,0.07);
  transition:transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, border-color 0.25s;
  display:flex; -webkit-tap-highlight-color:transparent;
}
@media (hover: hover) { .menu-item-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:rgba(132,181,152,0.3); } }
.menu-item-card:active { transform:scale(0.99); }
.menu-item-img { width:110px; min-width:110px; height:120px; overflow:hidden; position:relative; flex-shrink:0; }
@media (min-width: ${BP.md}px) { .menu-item-img { width:130px; min-width:130px; height:130px; } }
.menu-item-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s cubic-bezier(0.4,0,0.2,1); }
@media (hover: hover) { .menu-item-card:hover .menu-item-img img { transform:scale(1.06); } }
.menu-item-body { padding:13px 15px; flex:1; display:flex; flex-direction:column; justify-content:space-between; min-width:0; }
.menu-item-name { font-weight:700; font-size:14px; color:${T.forest}; margin-bottom:4px; line-height:1.3; }
@media (min-width: ${BP.md}px) { .menu-item-name { font-size:15px; } }
.menu-item-desc { font-size:11px; color:${T.moss}; font-weight:400; line-height:1.55; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; opacity:0.85; }
.menu-item-bottom { display:flex; align-items:center; justify-content:space-between; gap:6px; flex-wrap:wrap; }
.menu-item-price { font-family:'Playfair Display',serif; font-size:17px; font-weight:700; color:${T.leaf}; }
@media (min-width: ${BP.md}px) { .menu-item-price { font-size:19px; } }
.menu-item-badge { font-size:8px; font-weight:700; padding:3px 8px; border-radius:5px; background:${T.forest}; color:white; letter-spacing:0.05em; white-space:nowrap; }

/* Touch-friendly add/qty buttons */
.menu-add-btn {
  background:${T.forest}; color:white; border:none; cursor:pointer;
  border-radius:8px; padding:9px 14px; font-size:12px; font-weight:700;
  transition:all 0.18s; white-space:nowrap; position:relative; overflow:hidden;
  min-height: 36px;
}
@media (hover: hover) { .menu-add-btn:hover { background:${T.leaf}; transform:scale(1.04); } }
.menu-add-btn:active { transform:scale(0.94); }
.menu-qty-ctrl { display:flex; align-items:center; gap:2px; }
.menu-qty-btn {
  width: 32px; height: 32px; border-radius:7px; border:1.5px solid ${T.fern};
  background:none; color:${T.forest}; font-size:15px; font-weight:700; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:all 0.15s;
}
@media (min-width: ${BP.md}px) { .menu-qty-btn { width:28px; height:28px; } }
@media (hover: hover) { .menu-qty-btn:hover { background:${T.forest}; color:white; border-color:${T.forest}; } }
.menu-qty-btn:active { transform:scale(0.88); }
.menu-qty-num { font-weight:700; font-size:14px; min-width:24px; text-align:center; color:${T.forest}; }

/* ─── CART NUDGE ─── */
.cart-nudge {
  background: linear-gradient(135deg,${T.forest},${T.leaf}); border-radius:14px;
  padding:16px 20px; display:flex; align-items:center; justify-content:space-between;
  box-shadow:var(--shadow-lg); transition:transform 0.3s; animation:scaleIn 0.4s cubic-bezier(0.22,1,0.36,1);
  gap:12px;
}
@media (hover: hover) { .cart-nudge:hover { transform:scale(1.01); } }

/* ─── CART PAGE ─── */
.cart-layout { display:grid; grid-template-columns:1fr; gap:20px; }
@media (min-width: ${BP.md}px) { .cart-layout { grid-template-columns:1fr 360px; gap:28px; } }
@media (min-width: ${BP.lg}px) { .cart-layout { grid-template-columns:1fr 380px; gap:32px; } }
.cart-item {
  display:flex; align-items:center; gap:12px; background:white;
  border-radius:var(--radius-md); padding:12px 14px; margin-bottom:10px;
  box-shadow:var(--shadow-card); border:1px solid rgba(61,114,84,0.07);
  transition:box-shadow 0.2s; animation:fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
}
@media (min-width: ${BP.md}px) { .cart-item { padding:14px 16px; gap:16px; } }
@media (hover: hover) { .cart-item:hover { box-shadow:var(--shadow-md); } }
.cart-item-img { width:72px; height:72px; border-radius:var(--radius-sm); overflow:hidden; flex-shrink:0; }
@media (min-width: ${BP.md}px) { .cart-item-img { width:80px; height:80px; } }
.cart-item-img img { width:100%; height:100%; object-fit:cover; }
.qty-ctrl { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.qty-btn {
  width: 34px; height: 34px; border-radius:8px; border:1.5px solid rgba(61,114,84,0.3);
  background:none; color:${T.forest}; font-size:16px; font-weight:700; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:all 0.15s;
}
@media (hover: hover) { .qty-btn:hover { background:${T.forest}; color:white; border-color:${T.forest}; } }
.qty-btn:active { transform:scale(0.88); }
.cart-summary {
  background:white; border-radius:var(--radius-lg); padding:22px;
  box-shadow:var(--shadow-card); border:1px solid rgba(61,114,84,0.07);
}
@media (min-width: ${BP.md}px) { .cart-summary { padding:26px; position:sticky; top:88px; } }

/* ─── BUTTONS — touch-friendly (min 44px height) ─── */
.btn-primary {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  background:${T.forest}; color:white; border:none; cursor:pointer;
  padding:13px 26px; border-radius:11px; font-size:14px; font-weight:600;
  transition:all 0.22s; box-shadow:0 2px 8px rgba(22,46,33,0.18);
  min-height: var(--touch-min); letter-spacing:0.01em;
}
@media (min-width: ${BP.md}px) { .btn-primary { padding: 14px 32px; } }
@media (hover: hover) { .btn-primary:hover { background:${T.leaf}; transform:translateY(-2px); box-shadow:0 6px 20px rgba(22,46,33,0.24); } }
.btn-primary:active { transform:scale(0.97); }

.btn-nature {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  background:linear-gradient(135deg,${T.sage} 0%,${T.leaf} 100%); color:white;
  border:none; cursor:pointer; padding:13px 26px; border-radius:11px;
  font-size:14px; font-weight:600; transition:all 0.22s; letter-spacing:0.01em;
  box-shadow:0 3px 14px rgba(36,80,58,0.28);
  min-height: var(--touch-min);
}
@media (min-width: ${BP.md}px) { .btn-nature { padding: 14px 32px; } }
@media (hover: hover) { .btn-nature:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(36,80,58,0.36); filter:brightness(1.06); } }
.btn-nature:active { transform:scale(0.97); }

.btn-outline {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  background:transparent; color:${T.sage}; cursor:pointer;
  padding:12px 22px; border-radius:11px; font-size:14px; font-weight:600;
  border:1.5px solid rgba(61,114,84,0.35); transition:all 0.22s; letter-spacing:0.01em;
  min-height: var(--touch-min);
}
@media (hover: hover) { .btn-outline:hover { border-color:${T.sage}; background:rgba(61,114,84,0.07); color:${T.forest}; } }
.btn-outline:active { transform:scale(0.97); }

/* ─── FORM FIELDS — touch-friendly ─── */
.field {
  width:100%; background:#F8F5EE; border:1.5px solid rgba(61,114,84,0.18);
  color:${T.forest}; padding:13px 16px; font-size:16px;
  outline:none; transition:border-color 0.22s, box-shadow 0.22s, background 0.22s;
  border-radius:11px; font-family:inherit; -webkit-appearance:none;
  min-height: var(--touch-min);
}
.field:focus { border-color:${T.sage}; box-shadow:0 0 0 3px rgba(61,114,84,0.10); background:white; }
.field::placeholder { color:${T.moss}; opacity:0.65; font-size:14px; }

/* ─── CHIPS ─── */
.chip {
  background:white; border:1.5px solid rgba(61,114,84,0.18); color:${T.sage};
  border-radius:20px; padding:8px 18px; font-size:12px; font-weight:500;
  cursor:pointer; transition:all 0.18s; white-space:nowrap;
  min-height:36px; display:inline-flex; align-items:center; letter-spacing:0.01em;
  box-shadow: 0 1px 4px rgba(22,46,33,0.05);
}
.chip:hover, .chip.active { border-color:${T.sage}; background:rgba(61,114,84,0.08); color:${T.forest}; }
.chip.active { background:${T.forest}; color:white; border-color:${T.forest}; box-shadow:0 2px 8px rgba(22,46,33,0.2); }
.chip:active { transform:scale(0.96); }

/* ─── TOAST — above mobile nav ─── */
.toast {
  position:fixed; bottom:calc(var(--mob-nav-h) + 16px); left:50%; transform:translateX(-50%);
  background:${T.forest}; color:white; padding:12px 24px; border-radius:100px;
  font-size:13px; font-weight:600; z-index:9999; box-shadow:0 8px 32px rgba(22,46,33,0.28);
  animation:toastIn 0.3s cubic-bezier(0.4,0,0.2,1) both; white-space:nowrap;
  max-width: calc(100vw - 32px); text-align:center; letter-spacing:0.01em;
  border: 1px solid rgba(255,255,255,0.1);
}
@media (min-width: ${BP.lg}px) { .toast { bottom: 28px; } }

/* ─── EMPTY / ERROR STATES ─── */
.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:64px 20px; text-align:center; }
@media (min-width: ${BP.md}px) { .empty-state { padding: 88px 24px; } }
.empty-state-icon { font-size:58px; margin-bottom:18px; animation:pulse 2.5s ease-in-out infinite; }
@media (min-width: ${BP.md}px) { .empty-state-icon { font-size:68px; } }
.empty-state h3 { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:${T.forest}; margin-bottom:8px; }
.empty-state p { color:${T.moss}; font-size:14px; font-weight:400; margin-bottom:24px; max-width:300px; line-height:1.65; }
.error-state { background:linear-gradient(135deg,rgba(224,106,34,0.05),rgba(184,82,24,0.03)); border:1px solid rgba(224,106,34,0.18); border-radius:var(--radius-lg); padding:28px 20px; text-align:center; }
.error-state-icon { font-size:40px; margin-bottom:14px; }

/* ─── NATURE DIVIDER ─── */
.nature-divider { background:linear-gradient(180deg,${T.cream} 0%,${T.sand} 100%); padding:48px 0; border-top:1px solid rgba(107,158,122,0.15); border-bottom:1px solid rgba(107,158,122,0.15); position:relative; overflow:hidden; }
@media (min-width: ${BP.md}px) { .nature-divider { padding: 60px 0; } }
.nd-pattern { position:absolute; inset:0; opacity:0.04; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 5 C30 25 20 45 50 65 C80 45 70 25 50 5Z' fill='%231A3A2A'/%3E%3C/svg%3E"); background-size:50px 50px; }

/* ─── FAQ ACCORDION ─── */
.faq-item { background:white; border-radius:12px; overflow:hidden; border:1.5px solid rgba(61,114,84,0.1); margin-bottom:8px; transition:border-color 0.28s, box-shadow 0.28s, transform 0.22s; box-shadow:var(--shadow-card); }
@media (hover: hover) { .faq-item:hover, .faq-item:focus-within { border-color:rgba(61,114,84,0.28); box-shadow:var(--shadow-md); transform:translateX(2px); } }
.faq-item.faq-open { border-color:rgba(61,114,84,0.32); box-shadow:var(--shadow-md); }
.faq-q { width:100%; background:none; border:none; cursor:pointer; padding:18px 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; text-align:left; transition:background 0.2s; min-height:var(--touch-min); }
.faq-item.faq-open .faq-q, .faq-item:hover .faq-q { background:rgba(61,114,84,0.03); }
.faq-q-text { font-size:14px; font-weight:600; color:${T.forest}; line-height:1.4; transition:color 0.2s; }
.faq-item.faq-open .faq-q-text, .faq-item:hover .faq-q-text { color:${T.leaf}; }
.faq-icon { width:24px; height:24px; border-radius:50%; background:rgba(61,114,84,0.08); border:1.5px solid rgba(61,114,84,0.18); display:flex; align-items:center; justify-content:center; color:${T.moss}; font-size:16px; flex-shrink:0; transition:transform 0.32s cubic-bezier(0.22,1,0.36,1), background 0.22s, border-color 0.22s, color 0.22s; }
.faq-item.faq-open .faq-icon, .faq-item:hover .faq-icon { transform:rotate(45deg); background:${T.sage}; border-color:${T.sage}; color:white; }
.faq-ans { display:grid; grid-template-rows:0fr; transition:grid-template-rows 0.38s cubic-bezier(0.4,0,0.2,1); }
.faq-ans.open { grid-template-rows:1fr; }
.faq-ans-inner { overflow:hidden; opacity:0; transform:translateY(-4px); transition:opacity 0.28s 0.04s ease, transform 0.32s 0.04s cubic-bezier(0.22,1,0.36,1); }
.faq-ans.open .faq-ans-inner { opacity:1; transform:translateY(0); }
.faq-ans-inner p { margin:0 18px 16px; font-size:13px; color:${T.earth}; font-weight:400; line-height:1.75; padding:12px 14px; background:rgba(61,114,84,0.03); border-left:3px solid rgba(61,114,84,0.22); border-radius:0 8px 8px 0; }

/* ─── PAGE HERO BANNERS ─── */
.page-banner { position:relative; min-height:260px; display:flex; align-items:center; overflow:hidden; }
@media (min-width: ${BP.md}px) { .page-banner { min-height:340px; } }
@media (min-width: ${BP.lg}px) { .page-banner { min-height:380px; } }
.page-banner-img { position:absolute; inset:0; z-index:0; width:100%; height:100%; object-fit:cover; object-position:center 40%; animation:bannerZoom 10s ease forwards; }
.page-banner-overlay { position:absolute; inset:0; z-index:1; }
.page-banner-content { position:relative; z-index:2; width:100%; padding:90px 0 60px; animation:fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
@media (min-width: ${BP.md}px) { .page-banner-content { padding:110px 0 78px; } }
.page-banner-eyebrow { font-size:10px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:${T.fern}; display:inline-flex; align-items:center; gap:8px; margin-bottom:12px; }
.page-banner-eyebrow::before { content:''; display:inline-block; width:20px; height:1.5px; background:${T.fern}; border-radius:2px; }
.page-banner-h1 { font-family:'Playfair Display',serif; font-size:clamp(30px,5.5vw,68px); font-weight:900; color:white; line-height:1.0; margin-bottom:12px; text-shadow:0 4px 28px rgba(0,0,0,0.28); letter-spacing:-0.01em; }
.page-banner-sub { font-size:clamp(13px,1.8vw,16px); color:rgba(210,232,215,0.9); font-weight:400; line-height:1.65; max-width:480px; }

/* ─── TRACK PAGE ─── */
.track-steps { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; position:relative; gap:2px; }
.track-steps::before { content:''; position:absolute; top:18px; left:20px; right:20px; height:2px; background:rgba(107,158,122,0.15); z-index:0; }
.track-step { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; position:relative; z-index:1; }
.track-icon { width:38px; height:38px; border-radius:50%; background:white; border:2px solid rgba(107,158,122,0.2); display:flex; align-items:center; justify-content:center; font-size:16px; transition:all 0.4s; box-shadow:var(--shadow-sm); }
@media (min-width: ${BP.md}px) { .track-icon { width:44px; height:44px; font-size:18px; } }
.track-step.done .track-icon { background:${T.sage}; border-color:${T.sage}; box-shadow:0 3px 12px rgba(74,124,89,0.3); }
.track-step.current .track-icon { border-color:${T.sunset}; animation:trackPulse 1.5s ease-in-out infinite; }
.track-label { font-size:9px; font-weight:600; color:${T.moss}; text-align:center; text-transform:uppercase; letter-spacing:0.05em; }
@media (min-width: ${BP.md}px) { .track-label { font-size:10px; } }
.track-step.done .track-label { color:${T.forest}; }

/* ─── DARK MODE TOGGLE ─── */
.dark-toggle { position:relative; width:40px; height:22px; background:rgba(107,158,122,0.25); border-radius:11px; border:1px solid rgba(107,158,122,0.3); cursor:pointer; transition:background 0.3s; min-height:auto; }
.dark-toggle.on { background:${T.leaf}; }
.dark-toggle-ball { position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:white; transition:transform 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow:0 1px 4px rgba(0,0,0,0.2); }
.dark-toggle.on .dark-toggle-ball { transform:translateX(18px); }

/* ─── DARK MODE ─── */
body.dark-mode { background:#0d1c13 !important; color:#e4ede5 !important; }
body.dark-mode .navbar.scrolled,
body.dark-mode .navbar.solid { background:rgba(8,18,11,0.97) !important; border-bottom-color:rgba(132,181,152,0.14) !important; }
body.dark-mode .nav-logo { color:#e4f0e4 !important; }
body.dark-mode .navbar.scrolled .nav-logo, body.dark-mode .navbar.solid .nav-logo { color:#c4e0c4 !important; }
body.dark-mode .nav-link { color:rgba(189,216,196,0.85) !important; }
body.dark-mode .navbar.solid .nav-link, body.dark-mode .navbar.scrolled .nav-link { color:rgba(189,216,196,0.85) !important; }
body.dark-mode .nav-link:hover, body.dark-mode .nav-link.active { color:#e4f0e4 !important; background:rgba(132,181,152,0.1) !important; }
body.dark-mode .navbar.scrolled .nav-btn-sm, body.dark-mode .navbar.solid .nav-btn-sm { background:${T.sage} !important; }
body.dark-mode .navbar.scrolled .nav-cart, body.dark-mode .navbar.solid .nav-cart { background:${T.sage} !important; }
body.dark-mode .rest-card, body.dark-mode .trending-card, body.dark-mode .menu-item-card,
body.dark-mode .cart-item, body.dark-mode .faq-item, body.dark-mode .skel-card, body.dark-mode .skel-menu-card { background:#152418 !important; border-color:rgba(132,181,152,0.10) !important; }
body.dark-mode .faq-item.faq-open { background:#1b3022 !important; border-color:${T.sage} !important; }
body.dark-mode .faq-q-text { color:#c8e4c8 !important; }
body.dark-mode .faq-item.faq-open .faq-q-text { color:${T.fern} !important; }
body.dark-mode .faq-ans-inner p { color:#84b598 !important; background:rgba(61,114,84,0.06) !important; }
body.dark-mode .rest-name, body.dark-mode .trending-name, body.dark-mode .menu-item-name,
body.dark-mode .section-title, body.dark-mode h1, body.dark-mode h2, body.dark-mode h3 { color:#c8e0c8 !important; }
body.dark-mode .rest-cuisine, body.dark-mode .section-sub, body.dark-mode .menu-item-desc { color:#6ea880 !important; }
body.dark-mode .field { background:#1b3022 !important; color:#e4ede5 !important; border-color:rgba(132,181,152,0.12) !important; }
body.dark-mode .chip { background:#152418 !important; color:#84b598 !important; border-color:rgba(132,181,152,0.12) !important; }
body.dark-mode .cart-summary { background:#152418 !important; }
body.dark-mode .mob-nav { background:rgba(8,18,11,0.97) !important; border-color:rgba(132,181,152,0.12) !important; }
body.dark-mode .mob-btn { color:#6ea880 !important; }
body.dark-mode .mob-btn.active { color:#c4e0c4 !important; }
body.dark-mode .footer { background:#060e09 !important; }
body.dark-mode .skel { background:linear-gradient(90deg,#152418 25%,#1d3526 50%,#152418 75%) !important; background-size:800px 100% !important; }
body.dark-mode .offer-card { background:#152418 !important; }
body.dark-mode .checkout-section { background:#152418 !important; border-color:rgba(132,181,152,0.10) !important; }
body.dark-mode .btn-outline { border-color:rgba(132,181,152,0.32) !important; color:${T.fern} !important; }
body.dark-mode .btn-outline:hover { background:rgba(132,181,152,0.08) !important; color:#c8e0c8 !important; }

/* ─── FOOTER ─── */
.footer { background:${T.forest}; color:rgba(189,216,196,0.78); padding:44px 0 0; position:relative; overflow:hidden; }
@media (min-width: ${BP.md}px) { .footer { padding: 60px 0 0; } }
.footer-leaves { position:absolute; inset:0; pointer-events:none; overflow:hidden; opacity:0.04; }
.footer-leaf { position:absolute; animation:footerFloat linear infinite; }
.footer-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; padding-bottom:36px; align-items:start; }
@media (min-width: ${BP.md}px) { .footer-grid { grid-template-columns:1.7fr 1fr 1fr 1fr; gap:44px; padding-bottom:44px; } }
.footer-brand { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:white; margin-bottom:9px; display:flex; align-items:center; gap:8px; letter-spacing:-0.01em; }
.footer-title { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:${T.fern}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(189,216,196,0.1); }
.footer-link { display:block; font-size:12px; font-weight:400; margin-bottom:8px; cursor:pointer; transition:color 0.2s; color:rgba(189,216,196,0.68); background:none; border:none; text-align:left; font-family:inherit; padding:2px 0; min-height:28px; }
@media (hover: hover) { .footer-link:hover { color:white; } }
.footer-bar { border-top:1px solid rgba(189,216,196,0.1); padding:16px 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }

.offers-grid { display:grid; grid-template-columns:1fr; gap:12px; }
@media (min-width: ${BP.md}px) { .offers-grid { grid-template-columns:repeat(2,1fr); gap:18px; } }
.offer-card { background:white; border-radius:var(--radius-lg); padding:22px; box-shadow:var(--shadow-card); border:1px solid rgba(61,114,84,0.08); transition:all 0.28s; }
@media (min-width: ${BP.md}px) { .offer-card { padding: 28px; } }
@media (hover: hover) { .offer-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-lg); } }
.offer-code { display:inline-block; background:${T.sand}; border:1.5px dashed rgba(61,114,84,0.35); border-radius:8px; padding:5px 13px; font-size:12px; font-weight:700; letter-spacing:0.1em; color:${T.forest}; margin-bottom:12px; }

/* ─── CHECKOUT ─── */
.checkout-layout { display:grid; grid-template-columns:1fr; gap:20px; }
@media (min-width: ${BP.md}px) { .checkout-layout { grid-template-columns:1fr 360px; gap:28px; } }
@media (min-width: ${BP.lg}px) { .checkout-layout { grid-template-columns:1fr 380px; gap:32px; } }
.checkout-section { background:white; border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-card); border:1px solid rgba(61,114,84,0.07); margin-bottom:14px; }
@media (min-width: ${BP.md}px) { .checkout-section { padding: 28px; margin-bottom:18px; } }
.checkout-section h3 { font-family:'Playfair Display',serif; font-size:19px; font-weight:700; color:${T.forest}; margin-bottom:18px; display:flex; align-items:center; gap:10px; }
@media (min-width: ${BP.md}px) { .checkout-section h3 { font-size:21px; } }
.form-row { display:grid; grid-template-columns:1fr; gap:14px; }
@media (min-width: ${BP.sm}px) { .form-row { grid-template-columns:1fr 1fr; gap:16px; } }
.form-group { margin-bottom:14px; }
.form-group label { display:block; font-size:11px; font-weight:700; color:${T.moss}; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:6px; }

/* ─── LOADING SPINNER ─── */
.spinner { width:32px; height:32px; border:3px solid rgba(107,158,122,0.2); border-top-color:${T.sage}; border-radius:50%; animation:spin 0.7s linear infinite; }

/* ─── COUPON ─── */
.coupon-input-row { display:flex; gap:8px; }
.coupon-msg-success { color:#4CAF50; font-size:12px; font-weight:600; margin-top:7px; display:flex; align-items:center; gap:5px; }
.coupon-msg-error   { color:#E53E3E; font-size:12px; font-weight:600; margin-top:7px; display:flex; align-items:center; gap:5px; }

/* ─── MAP ─── */
.realistic-map { border-radius:var(--radius-lg); overflow:hidden; border:1px solid rgba(107,158,122,0.15); margin-bottom:20px; position:relative; box-shadow:var(--shadow-md); height:280px; }
@media (min-width: ${BP.md}px) { .realistic-map { height:360px; } }
.map-eta-chip { position:absolute; top:12px; right:12px; background:${T.forest}; color:white; border-radius:20px; padding:7px 14px; font-size:12px; font-weight:700; z-index:12; box-shadow:0 3px 12px rgba(0,0,0,0.25); }

/* ─── ADDRESS MODAL ─── */
.addr-modal-bg { position:fixed; inset:0; background:rgba(26,58,42,0.55); backdrop-filter:blur(6px); z-index:900; display:flex; align-items:flex-end; justify-content:center; padding:0; animation:fadeIn 0.22s ease both; }
@media (min-width: ${BP.md}px) { .addr-modal-bg { align-items:center; padding:20px; } }
.addr-modal {
  background:white; width:100%; max-width:480px;
  box-shadow:0 -8px 40px rgba(26,58,42,0.2);
  animation:slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both;
  border-radius:20px 20px 0 0; padding:24px 20px;
  /* Safe area for iPhone */
  padding-bottom:calc(24px + env(safe-area-inset-bottom,0px));
}
@media (min-width: ${BP.md}px) {
  .addr-modal { border-radius:20px; padding:32px; animation:fadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both; }
}

/* ─── LOGIN ─── */
.login-page { display:grid; grid-template-columns:1fr; min-height:100vh; }
@media (min-width: ${BP.md}px) { .login-page { grid-template-columns:1fr 1fr; } }
.login-art { background:linear-gradient(160deg,${T.forest} 0%,${T.leaf} 60%,${T.sage} 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px; position:relative; overflow:hidden; display:none; }
@media (min-width: ${BP.md}px) { .login-art { display:flex; } }
.login-form-side { display:flex; align-items:center; justify-content:center; padding:32px 20px; background:${T.snow}; min-height:100vh; }
@media (min-width: ${BP.md}px) { .login-form-side { padding:40px 28px; } }
.login-form { width:100%; max-width:400px; }

/* ─── GLOBAL ─── */
img { image-rendering: -webkit-optimize-contrast; }
button:focus-visible { outline:2px solid ${T.sage}; outline-offset:3px; }
.page {
  min-height: 100vh;
  padding-top: var(--nav-h);
  padding-bottom: calc(var(--mob-nav-h) + env(safe-area-inset-bottom, 0px));
}
@media (min-width: ${BP.lg}px) { .page { padding-bottom: 0; } }

/* Stagger delays */
.d0{animation-delay:0ms}.d1{animation-delay:60ms}.d2{animation-delay:120ms}
.d3{animation-delay:180ms}.d4{animation-delay:240ms}.d5{animation-delay:300ms}
.d6{animation-delay:360ms}.d7{animation-delay:420ms}

/* ─── CONTACT PAGE ─────────────────────────────────────────────── */
@keyframes contactFadeUp {
  from { opacity:0; transform:translateY(28px); }
  to   { opacity:1; transform:none; }
}
@keyframes contactLeafDrift {
  0%   { transform: translateY(0px) rotate(0deg); opacity:0.12; }
  50%  { transform: translateY(-18px) rotate(8deg); opacity:0.22; }
  100% { transform: translateY(0px) rotate(0deg); opacity:0.12; }
}
@keyframes spinnerRing {
  to { transform: rotate(360deg); }
}
@keyframes successPop {
  0%   { transform: scale(0.4); opacity:0; }
  60%  { transform: scale(1.1); opacity:1; }
  80%  { transform: scale(0.96); }
  100% { transform: scale(1); opacity:1; }
}
@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}
@keyframes shimmerBtn {
  0%   { left: -80%; }
  100% { left: 120%; }
}
@keyframes contactGlow {
  0%,100% { box-shadow: 0 0 0 0 rgba(61,114,84,0); }
  50%      { box-shadow: 0 0 18px 2px rgba(61,114,84,0.18); }
}

/* Page wrapper */
.contact-page {
  min-height: 100vh;
  padding-top: var(--nav-h);
  padding-bottom: calc(var(--mob-nav-h) + env(safe-area-inset-bottom, 0px) + 32px);
  background: ${T.cream};
  position: relative;
  overflow: hidden;
}
@media (min-width: ${BP.lg}px) { .contact-page { padding-bottom: 64px; } }

/* Subtle botanical bg pattern */
.contact-bg-pattern {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    radial-gradient(circle at 8% 12%, rgba(94,148,114,0.10) 0%, transparent 38%),
    radial-gradient(circle at 92% 80%, rgba(36,80,58,0.08) 0%, transparent 42%),
    radial-gradient(circle at 50% 50%, rgba(189,216,196,0.15) 0%, transparent 60%);
}

/* Floating leaf decorations */
.contact-leaf {
  position: absolute; pointer-events: none; z-index: 0; font-size: 64px; line-height: 1;
  animation: contactLeafDrift 8s ease-in-out infinite;
}
.contact-leaf-1 { top: 8%; left: 3%; font-size: 80px; animation-duration: 9s; }
.contact-leaf-2 { top: 22%; right: 2%; font-size: 56px; animation-duration: 11s; animation-delay: 2s; }
.contact-leaf-3 { bottom: 28%; left: 1%; font-size: 48px; animation-duration: 13s; animation-delay: 4s; }
.contact-leaf-4 { bottom: 12%; right: 4%; font-size: 70px; animation-duration: 10s; animation-delay: 1.5s; }

/* Inner wrapper */
.contact-inner {
  position: relative; z-index: 1;
  max-width: 860px; margin: 0 auto;
  padding: 52px var(--container-px) 0;
}
@media (min-width: ${BP.md}px) { .contact-inner { padding-top: 68px; } }

/* Hero header */
.contact-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
  color: ${T.sage}; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
.contact-eyebrow::before {
  content: ''; display: inline-block; width: 24px; height: 2px;
  background: ${T.sage}; border-radius: 2px;
}
.contact-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(34px, 5.5vw, 60px); font-weight: 900;
  color: ${T.forest}; line-height: 1.05; margin-bottom: 14px;
  letter-spacing: -0.02em;
}
.contact-title em {
  font-style: italic; color: ${T.sage};
}
.contact-subtitle {
  font-size: clamp(14px, 1.5vw, 16px); color: ${T.earth};
  font-weight: 300; line-height: 1.8; max-width: 480px; margin-bottom: 52px;
}

/* Centered form card */
.contact-form-card {
  background: white;
  border: 1px solid rgba(107,158,122,0.15);
  border-radius: 28px; padding: 36px 28px;
  box-shadow: 0 8px 48px ${T.shadow}, 0 2px 12px rgba(22,46,33,0.05);
  animation: contactFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both 0.08s;
  max-width: 700px; margin: 0 auto;
}
@media (min-width: ${BP.md}px) { .contact-form-card { padding: 52px 56px; } }

/* Decorative top bar on card */
.contact-form-card::before {
  content: ''; display: block; height: 4px; border-radius: 4px 4px 0 0;
  background: linear-gradient(90deg, ${T.forest}, ${T.sage}, ${T.moss});
  margin: -36px -28px 32px;
  border-radius: 28px 28px 0 0;
}
@media (min-width: ${BP.md}px) {
  .contact-form-card::before { margin: -52px -56px 36px; }
}

.contact-form-title {
  font-family: 'Playfair Display', serif; font-size: clamp(22px, 2.8vw, 28px); font-weight: 700;
  color: ${T.forest}; margin-bottom: 6px;
}
.contact-form-sub {
  font-size: 14px; color: ${T.moss}; font-weight: 400; margin-bottom: 36px; line-height: 1.6;
}

/* Info chips below title */
.contact-chips {
  display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px;
}
.contact-chip {
  display: flex; align-items: center; gap: 7px;
  background: ${T.sand}; border: 1px solid rgba(107,158,122,0.18);
  border-radius: 100px; padding: 7px 14px;
  font-size: 12px; font-weight: 600; color: ${T.leaf};
  letter-spacing: 0.02em;
}

/* Form fields */
.contact-field-row {
  display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px;
}
@media (min-width: ${BP.md}px) {
  .contact-field-row.two-col { grid-template-columns: 1fr 1fr; }
}

.contact-field-wrap { display: flex; flex-direction: column; gap: 8px; }

.contact-field-label {
  font-size: 12px; font-weight: 700; color: ${T.moss};
  letter-spacing: 0.09em; text-transform: uppercase;
  display: flex; align-items: center; gap: 6px;
}
.contact-field-label .lbl-icon { font-size: 14px; }
.contact-field-label .lbl-req { color: ${T.sunset}; font-size: 14px; font-weight: 700; line-height: 1; }

.contact-field {
  background: ${T.snow};
  border: 1.5px solid rgba(107,158,122,0.22);
  border-radius: 14px; padding: 13px 16px;
  font-size: 15px; color: ${T.forest}; font-family: inherit;
  transition: all 0.26s cubic-bezier(0.22,1,0.36,1);
  outline: none; width: 100%; box-sizing: border-box;
  -webkit-appearance: none;
}
.contact-field::placeholder { color: rgba(90,110,95,0.38); }
.contact-field:hover {
  border-color: rgba(61,114,84,0.38);
}
.contact-field:focus {
  border-color: ${T.sage};
  background: white;
  box-shadow: 0 0 0 3px rgba(61,114,84,0.10);
  animation: contactGlow 2s ease infinite;
}
.contact-field.error-field {
  border-color: rgba(224,106,34,0.6); background: rgba(224,106,34,0.04);
}
.contact-field.error-field:focus {
  box-shadow: 0 0 0 3px rgba(224,106,34,0.12);
}
.contact-field-error {
  font-size: 11px; color: ${T.sunset}; display: flex; align-items: center; gap: 4px; font-weight: 600;
}

textarea.contact-field {
  resize: vertical; min-height: 128px; line-height: 1.65;
}

/* Submit button */
.contact-submit-btn {
  width: 100%; padding: 17px 32px; border: none; border-radius: 16px;
  font-size: 16px; font-weight: 700; letter-spacing: 0.04em; cursor: pointer;
  font-family: inherit; position: relative; overflow: hidden;
  background: linear-gradient(135deg, ${T.forest} 0%, ${T.leaf} 50%, ${T.sage} 100%);
  color: white;
  box-shadow: 0 6px 28px rgba(22,46,33,0.28), 0 2px 8px rgba(22,46,33,0.14);
  transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s, filter 0.22s;
  min-height: 56px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-top: 8px;
}
.contact-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 12px 40px rgba(22,46,33,0.36), 0 4px 12px rgba(22,46,33,0.18);
  filter: brightness(1.06);
}
.contact-submit-btn:active:not(:disabled) { transform: scale(0.98); }
.contact-submit-btn:disabled { opacity: 0.58; cursor: not-allowed; }

.contact-submit-btn::before {
  content: ''; position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
  transform: skewX(-20deg); pointer-events: none;
}
.contact-submit-btn:hover:not(:disabled)::before { animation: shimmerBtn 0.72s ease; }

/* Spinner */
.contact-spinner {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.28);
  border-top-color: white;
  animation: spinnerRing 0.75s linear infinite;
  flex-shrink: 0;
}

/* Success overlay */
.contact-success-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(15,28,18,0.82); backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.3s ease both;
}
.contact-success-card {
  background: white;
  border: 1px solid rgba(94,148,114,0.22);
  border-radius: 28px; padding: 48px 40px; text-align: center; max-width: 380px; width: 90%;
  animation: successPop 0.55s cubic-bezier(0.22,1,0.36,1) both;
  box-shadow: 0 24px 80px rgba(22,46,33,0.4), 0 0 60px rgba(37,211,102,0.06);
}
.contact-success-icon {
  width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 24px;
  background: linear-gradient(135deg, rgba(37,211,102,0.15), rgba(36,80,58,0.12));
  border: 2px solid rgba(37,211,102,0.3);
  display: flex; align-items: center; justify-content: center;
}
.contact-success-icon svg { overflow: visible; }
.contact-success-title {
  font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700;
  color: ${T.forest}; margin-bottom: 10px;
}
.contact-success-sub {
  font-size: 14px; color: ${T.moss}; line-height: 1.7; margin-bottom: 28px;
}
.contact-success-close {
  background: linear-gradient(135deg, ${T.forest}, ${T.sage}); color: white;
  border: none; border-radius: 14px; padding: 14px 36px;
  font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: all 0.22s; box-shadow: 0 6px 24px rgba(22,46,33,0.24);
}
.contact-success-close:hover { filter: brightness(1.1); transform: translateY(-2px); }

/* Toast */
.contact-toast {
  position: fixed; bottom: calc(var(--mob-nav-h) + 24px); left: 50%; z-index: 8000;
  transform: translateX(-50%);
  background: ${T.forest}; backdrop-filter: blur(20px);
  border: 1px solid rgba(94,148,114,0.3); border-radius: 14px;
  padding: 14px 22px; color: white; font-size: 14px; font-weight: 500;
  box-shadow: 0 8px 32px rgba(22,46,33,0.3);
  animation: toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
  white-space: nowrap;
}
@media (min-width: ${BP.lg}px) { .contact-toast { bottom: 28px; } }
`;


/* ═══════════════════════════════════════════════════════════════
   AUTH CONTEXT
   ═══════════════════════════════════════════════════════════════ */
const AuthContext = createContext(null);
function useAuth() { return useContext(AuthContext); }

/* ═══════════════════════════════════════════════════════════════
   ── HOOKS ─────────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */

/** Simulates async data loading — returns { loading, data, error } */
function useAsyncLoad(delay = 1000) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      if (!mounted.current) return;
      if (Math.random() < 0.04) setError("Couldn't load. Check your connection.");
      setLoading(false);
    }, delay);
    return () => { mounted.current = false; clearTimeout(t); };
  }, [delay]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    const t = setTimeout(() => { if (mounted.current) setLoading(false); }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  return { loading, error, retry };
}

/** Persist dark mode preference in localStorage */
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('terra-dark') === '1'; } catch { return false; }
  });
  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
    try { localStorage.setItem('terra-dark', dark ? '1' : '0'); } catch {}
  }, [dark]);
  return [dark, setDark];
}

/**
 * useDebounce — delays a value update until the user stops typing.
 * Prevents firing a filter/search on every keystroke.
 * @param {any} value - The reactive value to debounce
 * @param {number} delay - Milliseconds to wait (default 280ms)
 */
function useDebounce(value, delay = 280) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Debounced window size — avoid re-render on every resize pixel */
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : true
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

/* ═══════════════════════════════════════════════════════════════
   ── UI PRIMITIVES ─────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */

/** Fade-up reveal wrapper with stagger delay */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef();
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:   vis ? 1 : 0,
        transform: vis ? 'none' : 'translateY(24px)',
        transition: `opacity 0.5s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.5s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      {children}
    </div>
  );
}

function Stars({ r }) {
  return (
    <span style={{ display:'flex', alignItems:'center', gap:4 }}>
      <span className="star">★</span>
      <span className="rating">{r}</span>
    </span>
  );
}

/* ─── SKELETON COMPONENTS ─── */
function SkeletonRestCard() {
  return (
    <div className="skel-card">
      <div className="skel skel-img" />
      <div className="skel-body">
        <div className="skel skel-line-lg" />
        <div className="skel skel-line-md" />
        <div style={{ display:'flex', gap:8, marginTop:4 }}>
          <div className="skel skel-badge" />
          <div className="skel skel-badge" style={{ width:60 }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonMenuCard() {
  return (
    <div className="skel-menu-card">
      <div className="skel skel-menu-img" />
      <div className="skel-menu-body">
        <div className="skel skel-line-lg" />
        <div className="skel skel-line-md" />
        <div className="skel skel-line-sm" />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'auto', paddingTop:8 }}>
          <div className="skel skel-badge" style={{ width:60 }} />
          <div className="skel skel-badge" style={{ width:70 }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonRestaurantList({ count = 8 }) {
  return (
    <div className="rest-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 60}ms` }}>
          <SkeletonRestCard />
        </div>
      ))}
    </div>
  );
}

function SkeletonMenuList({ count = 6 }) {
  return (
    <div className="menu-items-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMenuCard key={i} />
      ))}
    </div>
  );
}

function SkeletonDishList({ count = 4 }) {
  return (
    <div className="rest-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRestCard key={i} />
      ))}
    </div>
  );
}

/* ─── EMPTY STATES ─── */
function EmptyCart({ go }) {
  return (
    <div className="page empty-state">
      <div className="empty-state-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Add something delicious to get started. Hundreds of restaurants are waiting!</p>
      <button className="btn-nature" onClick={() => go('explore')}>Explore Restaurants</button>
    </div>
  );
}

function EmptySearch({ query, onClear }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3>No results for "{query}"</h3>
      <p>Try a different cuisine, restaurant name, or clear your search filters.</p>
      <button className="btn-outline" onClick={onClear}>Clear Search</button>
    </div>
  );
}

function EmptyDish({ dishName, go }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🍽️</div>
      <h3>Dish not found</h3>
      <p>We couldn't find "{dishName}" at any restaurant right now. Try exploring all restaurants.</p>
      <button className="btn-nature" onClick={() => go('explore')}>Explore All Restaurants</button>
    </div>
  );
}

/* ─── ERROR STATE ─── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state-icon">⚠️</div>
      <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, color:T.forest, marginBottom:8 }}>
        Something went wrong
      </h3>
      <p style={{ color:T.moss, fontSize:13, marginBottom:20 }}>{message}</p>
      <button className="btn-primary" onClick={onRetry}>Try Again</button>
    </div>
  );
}

/* ─── ADDRESS MODAL ─── */
function AddressModal({ onSave, onClose }) {
  const [addr, setAddr] = useState({ line1:'', city:'', pincode:'' });
  const [err, setErr]   = useState('');

  const submit = () => {
    if (!addr.line1.trim() || !addr.city.trim() || !addr.pincode.trim()) { setErr('Please fill all fields'); return; }
    if (!/^\d{6}$/.test(addr.pincode.trim())) { setErr('Enter valid 6-digit pincode'); return; }
    onSave(addr);
  };

  return (
    <div className="addr-modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="addr-modal">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, color:T.forest }}>📍 Add Delivery Address</h2>
            <p style={{ color:T.moss, fontSize:13, marginTop:4 }}>We need your address to deliver your order</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:T.moss }}>×</button>
        </div>
        {[['Street / Flat / Building','line1','123 MG Road, Apt 4B'],['City / Town','city','Bengaluru'],['Pincode','pincode','560001']].map(([label, key, ph]) => (
          <div key={key} style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>{label}</label>
            <input className="field" placeholder={ph} value={addr[key]}
              onChange={e => { setAddr(x => ({...x, [key]: e.target.value})); setErr(''); }} />
          </div>
        ))}
        {err && <p style={{ color:'#E53E3E', fontSize:12, marginBottom:12 }}>{err}</p>}
        <button className="btn-nature" style={{ width:'100%', marginTop:4 }} onClick={submit}>Save & Continue →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── NAVBAR ────────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function Navbar({ page, go, cnt, user }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [hidden,    setHidden]    = useState(false);
  const lastScrollY = useRef(0);
  const [dark, setDark] = useDarkMode();

  // On non-home pages the navbar is always "solid" for readability
  const isHome = page === 'home';

  useEffect(() => {
    let rafId = null;
    const fn = () => {
      // Cancel any pending frame — only process the latest scroll position
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 30);
        setHidden(y > lastScrollY.current && y > 120);
        lastScrollY.current = y;
        rafId = null;
      });
    };
    setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => { window.removeEventListener('scroll', fn); if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  const links = [
    {id:'home',label:'Home'},{id:'restaurants',label:'Restaurants'},{id:'explore',label:'Explore'},
    {id:'offers',label:'Offers'},{id:'track',label:'Track'},{id:'help',label:'Help'},{id:'about',label:'About'},{id:'contact',label:'Contact'},
  ];

  // Class logic: transparent → scrolled (on home), always solid on other pages
  const navClass = [
    'navbar',
    !isHome || scrolled ? (isHome ? 'scrolled' : 'solid') : '',
    hidden ? 'nav-hidden' : 'nav-visible',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass} role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        {/* Logo */}
        <button className="nav-logo" onClick={() => go('home')} aria-label="Terra Eats — go home">
          <div className="logo-leaf" aria-hidden="true">🌿</div>
          <span>Terra<em style={{ fontStyle:'italic', fontWeight:400 }}> Eats</em></span>
        </button>

        {/* Desktop links */}
        <nav className="nav-links" aria-label="Site pages">
          {links.map(l => (
            <button
              key={l.id}
              className={`nav-link${page === l.id ? ' active' : ''}`}
              onClick={() => go(l.id)}
              aria-current={page === l.id ? 'page' : undefined}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Dark mode toggle */}
          <div className="dark-toggle-wrap">
            <button
              className={`dark-toggle${dark ? ' on' : ''}`}
              onClick={() => setDark(d => !d)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={dark}
            >
              <div className="dark-toggle-ball" />
            </button>
            <span className="dark-toggle-label" aria-hidden="true">{dark ? '🌙' : '☀️'}</span>
          </div>

          {/* User avatar or login */}
          {user ? (
            <button
              style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${T.sage},${T.leaf})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', transition:'transform 0.2s', border:'2px solid rgba(255,255,255,0.3)' }}
              title={user.name} onClick={() => go('cart')}
              aria-label={`${user.name}'s account`}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform=''}
            >
              {user.name[0].toUpperCase()}
            </button>
          ) : (
            <button className="nav-btn-sm btn-ripple" onClick={() => go('login')} aria-label="Login to your account">
              Login
            </button>
          )}

          {/* Cart */}
          <button className="nav-cart btn-ripple" onClick={() => go('cart')} aria-label={`Cart, ${cnt} items`}>
            🛒 <span className="nav-cart-text">Cart</span>
            {cnt > 0 && <span className="cart-badge" aria-hidden="true">{cnt}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

const MobNav = memo(function MobNav({ page, go, cnt }) {
  const tabs = [
    { id:'home',        label:'Home',    icon:'🏠' },
    { id:'restaurants', label:'Eats',    icon:'🏪' },
    { id:'explore',     label:'Explore', icon:'🔍' },
    { id:'offers',      label:'Offers',  icon:'🏷️' },
    { id:'contact',     label:'Contact', icon:'💬' },
    { id:'cart',        label:'Cart',    icon:'🛒', badge: cnt },
  ];
  return (
    <nav className="mob-nav" aria-label="Mobile navigation">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`mob-btn${page === t.id ? ' active' : ''}`}
          onClick={() => go(t.id)}
          aria-current={page === t.id ? 'page' : undefined}
          aria-label={t.badge > 0 ? `${t.label}, ${t.badge} items` : t.label}
        >
          <span className="mob-btn-icon">
            {t.icon}
            {t.badge > 0 && (
              <span className="cart-badge" style={{ top:-4, right:-4 }} aria-hidden="true">{t.badge}</span>
            )}
          </span>
          <span className="mob-btn-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
});

/* ═══════════════════════════════════════════════════════════════
   ── REUSABLE PAGE BANNER ──────────────────────────────────────
   Full-width hero with background image, gradient overlay,
   animated entrance, and responsive layout.
   ═══════════════════════════════════════════════════════════════ */
function PageBanner({ eyebrow, title, subtitle, imgUrl, overlay, children }) {
  // overlay defaults to a dark forest gradient
  const grad = overlay || 'linear-gradient(135deg, rgba(10,35,20,0.88) 0%, rgba(26,58,42,0.65) 55%, rgba(10,35,20,0.55) 100%)';
  return (
    <div className="page-banner">
      {imgUrl && (
        <img
          src={imgUrl}
          alt=""
          aria-hidden="true"
          className="page-banner-img"
          loading="eager"
        />
      )}
      <div className="page-banner-overlay" style={{ background: imgUrl ? grad : `linear-gradient(135deg, ${T.forest} 0%, ${T.leaf} 100%)` }} />
      <div className="page-banner-content">
        <div className="container">
          <Reveal>
            {eyebrow && <div className="page-banner-eyebrow">{eyebrow}</div>}
            <h1 className="page-banner-h1">{title}</h1>
            {subtitle && <p className="page-banner-sub">{subtitle}</p>}
            {children}
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ ITEM — hover-expand accordion ─────────────────────── */
/**
 * Expands on hover (mouseenter) and on keyboard focus,
 * collapses on mouseleave (unless keyboard-focused).
 * Click also toggles for mobile users.
 */
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef(null);
  const itemRef    = useRef(null);

  const expand  = useCallback(() => { clearTimeout(hoverTimer.current); setOpen(true); }, []);
  const collapse = useCallback(() => {
    // Delay collapse slightly so fast mouse passes don't flicker
    hoverTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  // Keyboard: open on focus, close when focus leaves the item entirely
  const onFocus  = useCallback(() => expand(), [expand]);
  const onBlur   = useCallback((e) => {
    if (!itemRef.current?.contains(e.relatedTarget)) collapse();
  }, [collapse]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  return (
    <Reveal delay={index * 0.04}>
      <div
        ref={itemRef}
        className={`faq-item${open ? ' faq-open' : ''}`}
        onMouseEnter={expand}
        onMouseLeave={collapse}
      >
        <button
          className="faq-q"
          aria-expanded={open}
          aria-controls={`faq-ans-${index}`}
          id={`faq-btn-${index}`}
          onClick={() => setOpen(o => !o)}   /* mobile: tap to toggle */
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span className="faq-q-text">{faq.q}</span>
          <span className="faq-icon" aria-hidden="true">+</span>
        </button>
        <div
          className={`faq-ans${open ? ' open' : ''}`}
          id={`faq-ans-${index}`}
          role="region"
          aria-labelledby={`faq-btn-${index}`}
        >
          <div className="faq-ans-inner">
            <p>{faq.a}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── CONTACT / ORDER QUERY PAGE ────────────────────────────────
   Ultra-premium dark glassmorphism contact page with WhatsApp
   integration, neon glow inputs, animated orbs, toast + success.
   ═══════════════════════════════════════════════════════════════ */
const WA_NUMBER = "917349579312"; // ← your WhatsApp number (no + or spaces)

function ContactPage({ go }) {
  const [form, setForm] = useState({ name:'', email:'', mobile:'', query:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = 'Mobile must be exactly 10 digits';
    if (!form.query.trim()) e.query = 'Please describe your query';
    return e;
  };

  // Live validation state to drive button disabled
  const isValid = useMemo(() => {
    return (
      form.name.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      /^\d{10}$/.test(form.mobile.trim()) &&
      form.query.trim()
    );
  }, [form]);

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('⚠️ Please fill all required fields correctly');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const message =
`Hello Terra Eats! 🌿

I have a new enquiry:

👤 Name: ${form.name}
📧 Email: ${form.email}
📱 Mobile: ${form.mobile}
💬 Query: ${form.query}`;
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
      setSuccess(true);
    }, 1200);
  };

  const closeSuccess = () => {
    setSuccess(false);
    setForm({ name:'', email:'', mobile:'', query:'' });
    setErrors({});
  };

  const FIELDS = [
    { key:'name',   label:'Full Name',      icon:'👤', type:'text',  ph:'e.g. Priya Sharma',      autoC:'name',  half:true },
    { key:'email',  label:'Email Address',  icon:'📧', type:'email', ph:'you@example.com',         autoC:'email', half:true },
    { key:'mobile', label:'Mobile Number',  icon:'📱', type:'tel',   ph:'10-digit number',         autoC:'tel',   half:false },
    { key:'query',  label:'Your Query',     icon:'💬', type:'textarea',ph:"Describe your order or question…", autoC:'off', half:false },
  ];

  return (
    <div className="contact-page">
      {/* Botanical background */}
      <div className="contact-bg-pattern" />
      <div className="contact-leaf contact-leaf-1" aria-hidden="true">🍃</div>
      <div className="contact-leaf contact-leaf-2" aria-hidden="true">🌿</div>
      <div className="contact-leaf contact-leaf-3" aria-hidden="true">🍂</div>
      <div className="contact-leaf contact-leaf-4" aria-hidden="true">🌱</div>

      <div className="contact-inner">
        {/* Header */}
        <Reveal>
          <div style={{ textAlign:'center', maxWidth:600, margin:'0 auto' }}>
            <div className="contact-eyebrow">Get In Touch</div>
            <h1 className="contact-title">
              We'd love to<br/><em>hear from you</em>
            </h1>
            <p className="contact-subtitle">
              Have a question, special order, or feedback? Fill the form below and we'll respond on WhatsApp within minutes.
            </p>
          </div>
        </Reveal>

        {/* Info chips */}
        <Reveal delay={0.06}>
          <div className="contact-chips" style={{ justifyContent:'center' }}>
            {[
              { icon:'📍', text:'Mangaluru, Karnataka' },
              { icon:'⏰', text:'10 AM – 11 PM, Daily' },
              { icon:'⚡', text:'Avg reply: 5 minutes' },
              { icon:'⭐', text:'4.9 rated service' },
            ].map(c => (
              <div key={c.text} className="contact-chip">
                <span>{c.icon}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Form Card */}
        <Reveal delay={0.1}>
          <div className="contact-form-card">
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div className="contact-form-title">Send us a Message</div>
              <div className="contact-form-sub">
                All fields are required. Fill in the details and we'll open WhatsApp with your message pre-filled.
              </div>
            </div>

            {/* Name + Email row */}
            <div className="contact-field-row two-col" style={{ marginBottom:20 }}>
              {FIELDS.filter(f => f.half).map(f => (
                <div className="contact-field-wrap" key={f.key}>
                  <label className="contact-field-label">
                    <span className="lbl-icon">{f.icon}</span>
                    {f.label}
                    <span className="lbl-req">*</span>
                  </label>
                  <input
                    className={`contact-field${errors[f.key] ? ' error-field' : ''}`}
                    type={f.type}
                    placeholder={f.ph}
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                    autoComplete={f.autoC}
                  />
                  {errors[f.key] && (
                    <span className="contact-field-error">⚠ {errors[f.key]}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="contact-field-row" style={{ marginBottom:20 }}>
              <div className="contact-field-wrap">
                <label className="contact-field-label">
                  <span className="lbl-icon">📱</span>
                  Mobile Number
                  <span className="lbl-req">*</span>
                </label>
                <input
                  className={`contact-field${errors.mobile ? ' error-field' : ''}`}
                  type="tel"
                  placeholder="10-digit number (e.g. 9876543210)"
                  value={form.mobile}
                  onChange={handleChange('mobile')}
                  autoComplete="tel"
                  maxLength={10}
                  inputMode="numeric"
                />
                {errors.mobile && <span className="contact-field-error">⚠ {errors.mobile}</span>}
              </div>
            </div>

            {/* Query */}
            <div className="contact-field-row" style={{ marginBottom:28 }}>
              <div className="contact-field-wrap">
                <label className="contact-field-label">
                  <span className="lbl-icon">💬</span>
                  Your Query
                  <span className="lbl-req">*</span>
                </label>
                <textarea
                  className={`contact-field${errors.query ? ' error-field' : ''}`}
                  placeholder="Describe your order or question in detail — e.g. 'I'd like to order 2× Butter Chicken + Garlic Naan for delivery to MG Road…'"
                  value={form.query}
                  onChange={handleChange('query')}
                  rows={5}
                />
                {errors.query && <span className="contact-field-error">⚠ {errors.query}</span>}
              </div>
            </div>

            {/* Submit */}
            <button
              className="contact-submit-btn"
              onClick={handleSubmit}
              disabled={loading || !isValid}
            >
              {loading ? (
                <>
                  <span className="contact-spinner" />
                  <span>Preparing your message…</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize:20 }}>💬</span>
                  <span>Send via WhatsApp</span>
                  <span style={{ fontSize:16 }}>→</span>
                </>
              )}
            </button>

            <p style={{ textAlign:'center', fontSize:12, color:T.moss, marginTop:14, lineHeight:1.6, opacity:0.7 }}>
              🔒 Your details are used only to pre-fill the WhatsApp message.
            </p>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:14, margin:'28px 0 22px', color:T.mist }}>
              <div style={{ flex:1, height:1, background:`rgba(107,158,122,0.18)` }} />
              <span style={{ fontSize:12, fontWeight:600, letterSpacing:'0.08em', color:T.moss }}>OR REACH US DIRECTLY</span>
              <div style={{ flex:1, height:1, background:`rgba(107,158,122,0.18)` }} />
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                padding:'14px 24px', borderRadius:14, textDecoration:'none',
                background:`linear-gradient(135deg, rgba(37,211,102,0.12), rgba(18,140,126,0.10))`,
                border:'1.5px solid rgba(37,211,102,0.28)',
                color:T.leaf, fontWeight:700, fontSize:14, letterSpacing:'0.03em',
                transition:'all 0.22s', cursor:'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(37,211,102,0.2),rgba(18,140,126,0.16))'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(37,211,102,0.12),rgba(18,140,126,0.10))'; e.currentTarget.style.transform=''; }}
            >
              <span style={{ fontSize:20 }}>💬</span>
              <span>Chat directly on WhatsApp</span>
            </a>
          </div>
        </Reveal>

        <div style={{ height:64 }} />
      </div>

      {/* Success Modal */}
      {success && (
        <div className="contact-success-overlay" onClick={closeSuccess}>
          <div className="contact-success-card" onClick={e => e.stopPropagation()}>
            <div className="contact-success-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="rgba(37,211,102,0.5)" strokeWidth="1.5"/>
                <polyline
                  points="12,21 18,27 29,14"
                  stroke="#25d366" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="30" strokeDashoffset="30"
                  style={{ animation:'checkDraw 0.5s ease 0.3s forwards' }}
                />
              </svg>
            </div>
            <div style={{ fontSize:36, marginBottom:10 }}>🌿</div>
            <div className="contact-success-title">Message Sent!</div>
            <p className="contact-success-sub">
              WhatsApp has been opened with your message pre-filled. Our team will reply shortly!
            </p>
            <button className="contact-success-close" onClick={closeSuccess}>
              ✓ Done
            </button>
          </div>
        </div>
      )}

      {toast && <div className="contact-toast">{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── FOOTER ────────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function Footer({ go }) {
  const leaves = ['🍃','🌿','🍀','🌱','🍂'];
  return (
    <footer className="footer">
      <div className="footer-leaves">
        {leaves.map((l, i) => (
          <div key={i} className="footer-leaf" style={{ left:`${10 + i*18}%`, bottom: 0, fontSize: 28+i*4, animationDuration:`${6+i*2}s`, animationDelay:`${i*1.2}s` }}>{l}</div>
        ))}
      </div>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🌿 Terra Eats</div>
            <p style={{ fontSize:13, fontWeight:300, lineHeight:1.7, marginBottom:16, maxWidth:280 }}>
              Farm-to-table delivery from handpicked partner restaurants. Seasonal. Sustainable. Delicious.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {['𝕏','in','📸','📘'].map(s => (
                <button key={s} style={{ width:36, height:36, borderRadius:9, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(200,223,197,0.12)', color:'rgba(200,223,197,0.7)', cursor:'pointer', fontSize:14, transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; }}
                >{s}</button>
              ))}
            </div>
          </div>
          {[
            { title:'Explore', links:[['Home','home'],['Restaurants','restaurants'],['Explore','explore'],['Offers','offers'],['Contact Us','contact']] },
            { title:'Company', links:[['About Us','about'],['Our Chefs','about'],['Sustainability','about'],['Help','help']] },
            { title:'Account', links:[['Sign In','login'],['Track Order','track'],['My Cart','cart'],['Support','help']] },
          ].map(col => (
            <div key={col.title}>
              <div className="footer-title">{col.title}</div>
              {col.links.map(([l, id]) => (
                <button key={l} className="footer-link" onClick={() => go(id)}>{l}</button>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bar">
          <span style={{ fontSize:12 }}>© 2025 Terra Eats. All rights reserved.</span>
          <span style={{ fontSize:12, opacity:0.6 }}>🌱 1 tree planted per 10 orders</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── BANNER CAROUSEL ───────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
const BANNER_SLIDES = [
  { img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&q=95", title:"Authentic Indian Flavours", sub:"Biryani, Butter Chicken & More", cta:"Order Indian →", color:"#E8742A" },
  { img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=95", title:"Burgers Worth the Wait", sub:"Crafted with premium beef & fresh buns", cta:"Explore Burgers →", color:"#D4A017" },
  { img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=95", title:"Sushi Night, Done Right", sub:"Premium rolls from Sushi Bay", cta:"Order Sushi →", color:"#8FBA99" },
  { img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=95", title:"Pizza Like Never Before", sub:"Wood-fired, fresh, delivered hot", cta:"Get Pizza →", color:"#C45B1A" },
];

function BannerCarousel({ go }) {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);
  const total  = BANNER_SLIDES.length;

  const goNext = useCallback(() => setCur(c => (c + 1) % total), [total]);
  const goPrev = ()  => { setCur(c => (c - 1 + total) % total); resetTimer(); };
  const resetTimer = () => { clearInterval(timer.current); timer.current = setInterval(goNext, 4500); };
  useEffect(() => { timer.current = setInterval(goNext, 4500); return () => clearInterval(timer.current); }, [goNext]);

  const touchX = useRef(null);

  return (
    <div className="banner-carousel"
      onTouchStart={e => touchX.current = e.touches[0].clientX}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? goNext() : goPrev(); resetTimer(); }
        touchX.current = null;
      }}
    >
      <div className="banner-slides" style={{ transform:`translateX(-${cur * 100}%)` }}>
        {BANNER_SLIDES.map((s, i) => (
          <div key={i} className={`banner-slide${cur === i ? ' active' : ''}`}>
            <img src={s.img} alt={s.title} loading={i === 0 ? 'eager' : 'lazy'} decoding={i === 0 ? 'sync' : 'async'} fetchPriority={i === 0 ? 'high' : 'low'} />
            <div className="banner-overlay">
              <div className="banner-content">
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:s.color, marginBottom:10 }}>🍃 Terra Eats Special</div>
                <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3.5vw,52px)', fontWeight:700, lineHeight:1.05, marginBottom:12, color:'white', textShadow:'0 2px 16px rgba(0,0,0,0.4)' }}>{s.title}</h2>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.80)', fontWeight:300, marginBottom:24, lineHeight:1.6 }}>{s.sub}</p>
                <button onClick={() => go('explore')} className="btn-ripple"
                  style={{ background:s.color, color:'white', border:'none', borderRadius:12, padding:'13px 28px', fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.12)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter=''; e.currentTarget.style.transform=''; }}
                >{s.cta}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="banner-arrow prev" onClick={() => { goPrev(); }}>‹</button>
      <button className="banner-arrow next" onClick={() => { goNext(); resetTimer(); }}>›</button>
      <div className="banner-dots">
        {BANNER_SLIDES.map((_, i) => (
          <button key={i} className={`banner-dot${cur === i ? ' active' : ''}`} onClick={() => { setCur(i); resetTimer(); }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── CATEGORY CAROUSEL ─────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function CategoryCarousel({ activeCat, onCatClick }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const animRef   = useRef(null);
  const ITEM_W    = 116;

  const maxOff = Math.max(0, CATEGORIES.length * ITEM_W - (typeof window !== 'undefined' ? window.innerWidth - 56 : 800));

  // Smooth animated scroll to target offset
  const smoothScrollTo = useCallback((target) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const clampedTarget = Math.max(0, Math.min(maxOff, target));
    const step = () => {
      setOffset(prev => {
        const diff = clampedTarget - prev;
        if (Math.abs(diff) < 1) return clampedTarget;
        animRef.current = requestAnimationFrame(step);
        return prev + diff * 0.18;
      });
    };
    animRef.current = requestAnimationFrame(step);
  }, [maxOff]);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  const slide = dir => smoothScrollTo(offset + dir * ITEM_W * 3);

  const onMouseDown = e => { if (animRef.current) cancelAnimationFrame(animRef.current); setDragging(true); dragStart.current = { x: e.clientX, offset }; };

  const onMouseMove = e => { if (!dragging || !dragStart.current) return; setOffset(Math.max(0, Math.min(maxOff, dragStart.current.offset + dragStart.current.x - e.clientX))); };
  const onMouseUp   = ()  => { setDragging(false); };
  const onTouchStart = e => { if (animRef.current) cancelAnimationFrame(animRef.current); dragStart.current = { x: e.touches[0].clientX, offset }; };
  const onTouchMove  = e => { if (!dragStart.current) return; setOffset(Math.max(0, Math.min(maxOff, dragStart.current.offset + dragStart.current.x - e.touches[0].clientX))); };
  const onTouchEnd   = ()  => { dragStart.current = null; };

  return (
    <div style={{ position:'relative' }}>
      <button className="cat-carousel-btn prev" onClick={() => slide(-1)}>‹</button>
      <div className="cat-carousel-wrap"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        <div className={`cat-carousel-track${dragging ? ' dragging' : ''}`} style={{ transform:`translateX(-${offset}px)` }}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} className={`cat-item${activeCat === cat.label ? ' active' : ''}`} onClick={() => onCatClick(cat.label)}>
              <div className="cat-img-ring">
                <img src={cat.img} alt={cat.label} loading="lazy" decoding="async" />
              </div>
              <span className="cat-label">{cat.emoji} {cat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="cat-carousel-btn next" onClick={() => slide(1)}>›</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── VIDEO HERO ────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function VideoHero({ go }) {
  const videoRef = useRef();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Skip video on slow connections or reduced-motion preference
    const conn = navigator.connection;
    const slowConn = conn && (conn.saveData || ['slow-2g','2g'].includes(conn.effectiveType));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slowConn || reducedMotion) return;

    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
      setVideoLoaded(true);
    }
  }, []);

  return (
    <div className="video-hero">
      <div className="video-fallback" />
      {/* Video: only rendered when not slow connection */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          preload="none"
          style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', minWidth:'100%', minHeight:'100%', objectFit:'cover', pointerEvents:'none' }}
        >
          <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="video-overlay" />
      <div className="video-hero-content">
        <div style={{ maxWidth:620 }} className="animate-fade-up">
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', borderRadius:20, padding:'6px 16px 6px 8px', marginBottom:20, backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ background:'linear-gradient(135deg,rgba(232,116,42,0.95),rgba(196,91,26,0.95))', borderRadius:14, padding:'2px 12px', fontSize:10, fontWeight:700, color:'white', letterSpacing:'0.08em', textTransform:'uppercase' }}>NEW</span>
            <span style={{ fontSize:12, color:'rgba(200,223,197,0.95)', fontWeight:400 }}>Farm-to-table delivery is here 🌱</span>
          </div>
          <h1 className="hero-h1">From nature's<br/>kitchen <em style={{ fontStyle:'italic', opacity:0.9 }}>to yours</em></h1>
          <p className="hero-sub">Handpicked restaurants. Seasonal ingredients.<br/>Delivered with care in 30 minutes or less.</p>
          <div className="hero-search">
            <span style={{ paddingLeft:16, fontSize:18, opacity:0.5, flexShrink:0 }}>🔍</span>
            <input
              placeholder="Search biryani, sushi, burgers…"
              style={{ border:'none', outline:'none', flex:1, padding:'14px 12px', fontSize:15, color:T.forest, background:'transparent', fontFamily:'inherit', minWidth:0 }}
              onFocus={e => e.currentTarget.placeholder = ''}
              onBlur={e => e.currentTarget.placeholder = 'Search biryani, sushi, burgers…'}
            />
            <button className="hero-search-btn btn-ripple" onClick={() => go('explore')}>Search</button>
          </div>
          <div className="hero-pills">
            {['🍕 Pizza','🍔 Burger','🍛 Biryani','🍜 Noodles','🍣 Sushi','🍰 Desserts'].map(p => (
              <button key={p} className="hero-pill btn-ripple" onClick={() => go('explore')}>{p}</button>
            ))}
          </div>
          <div className="hero-stat-bar">
            {[['500+','Restaurants'],['30 min','Avg Delivery'],['4.8 ★','Rating'],['50k+','Happy Eaters']].map(([n, l]) => (
              <div key={l} className="hero-stat">
                <div className="hero-stat-n">{n}</div>
                <div className="hero-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── HOME PAGE ─────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function HomePage({ go, addToCart, goRestaurant, goDish }) {
  const [activeCat, setActiveCat] = useState(null);
  // useMemo so the filter only re-runs when activeCat changes
  const catRests = useMemo(
    () => activeCat ? RESTAURANTS.filter(r => (CATEGORY_RESTAURANTS[activeCat] || []).includes(r.id)) : [],
    [activeCat]
  );
  const handleCatClick = useCallback(c => setActiveCat(prev => c === prev ? null : c), []);

  return (
    <div style={{ paddingTop:'var(--nav-h)', minHeight:'100vh' }}>
      <VideoHero go={go} />
      <BannerCarousel go={go} />

      {/* Categories */}
      <section className="section" style={{ background:T.snow, paddingBottom:60 }}>
        <div className="container">
          <Reveal>
            <div className="section-head" style={{ marginBottom:36 }}>
              <span className="section-label">Browse by Category</span>
              <h2 className="section-title">What's your craving?</h2>
              <p className="section-sub">Drag, swipe or click — discover every cuisine</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <CategoryCarousel activeCat={activeCat} onCatClick={handleCatClick} />
          </Reveal>

          {activeCat && catRests.length > 0 && (
            <div style={{ marginTop:40 }} className="animate-fade-up">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, color:T.forest }}>Restaurants offering {activeCat}</h3>
                <button className="btn-outline" style={{ padding:'9px 20px', fontSize:12 }} onClick={() => go('restaurants')}>See all →</button>
              </div>
              <div className="rest-grid">
                {catRests.map((r, i) => (
                  <Reveal key={r.id} delay={i * 0.07}>
                    <RestCard r={r} onClick={() => goRestaurant(r.id)} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
          {activeCat && catRests.length === 0 && <EmptySearch query={activeCat} onClear={() => setActiveCat(null)} />}
        </div>
      </section>

      {/* Trending */}
      <TrendingSection addToCart={addToCart} goRestaurant={goRestaurant} goDish={goDish} />

      {/* Featured Restaurants */}
      <div className="nature-divider">
        <div className="nd-pattern" />
        <div className="container">
          <Reveal>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28, flexWrap:'wrap', gap:12 }}>
              <div className="section-head" style={{ marginBottom:0 }}>
                <span className="section-label">Handpicked for you</span>
                <h2 className="section-title">Featured Restaurants</h2>
                <p className="section-sub">Tap any to explore their full menu</p>
              </div>
              <button className="btn-outline" style={{ flexShrink:0 }} onClick={() => go('restaurants')}>View all →</button>
            </div>
          </Reveal>
          <div className="rest-grid">
            {RESTAURANTS.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04}>
                <RestCard r={r} onClick={() => goRestaurant(r.id)} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section style={{ position:'relative', overflow:'hidden', minHeight:360, display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=90" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(10,35,20,0.88) 0%, rgba(26,58,42,0.72) 50%, rgba(10,35,20,0.65) 100%)' }} />
        </div>
        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1, padding:'72px var(--container-px)' }}>
          <Reveal>
            <div style={{ fontSize:44, marginBottom:14 }}>🌱</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4.5vw,64px)', fontWeight:700, color:'white', marginBottom:14, lineHeight:1.1 }}>
              Order today,<br/><em style={{ fontStyle:'italic', color:T.fern }}>save the planet tomorrow</em>
            </h2>
            <p style={{ color:'rgba(220,240,220,0.92)', fontSize:'clamp(13px,1.6vw,17px)', fontWeight:300, marginBottom:32, maxWidth:480, margin:'0 auto 32px', lineHeight:1.7 }}>
              We plant one tree for every 10 orders. Join 50,000+ eco-conscious food lovers.
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-nature btn-ripple" onClick={() => go('explore')}>Start Ordering 🍃</button>
              <button className="btn-ripple" onClick={() => go('about')}
                style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(10px)', border:'1.5px solid rgba(255,255,255,0.3)', color:'white', borderRadius:12, padding:'12px 24px', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.25s', position:'relative', overflow:'hidden', minHeight:'var(--touch-min)' }}
              >Our Pledge →</button>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── REUSABLE RESTAURANT CARD — memoized ──────────────────────
   ═══════════════════════════════════════════════════════════════ */
const RestCard = memo(function RestCard({ r, onClick }) {
  return (
    <div className="rest-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="rest-img">
        <LazyImg src={r.img} alt={r.name} style={{ width:'100%', height:'100%' }} />
        {r.badge    && <span className="rest-badge">{r.badge}</span>}
        {r.discount && <span className="rest-discount">{r.discount}</span>}
      </div>
      <div className="rest-body">
        <div className="rest-name">{r.name}</div>
        <div className="rest-cuisine">{r.cuisine}</div>
        <div className="rest-meta">
          <Stars r={r.rating} />
          <span className="rest-time">⏱ {r.time}</span>
          <span className="rest-price">{r.price}</span>
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════
   ── TRENDING SECTION — memoized, horizontal-scroll on mobile ─
   ═══════════════════════════════════════════════════════════════ */
const TrendingSection = memo(function TrendingSection({ addToCart, goRestaurant, goDish }) {
  const [added, setAdded] = useState({});

  const handleAdd = useCallback((item) => {
    addToCart(item);
    setAdded(p => ({ ...p, [item.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [item.id]: false })), 1200);
  }, [addToCart]);

  return (
    <section className="section" style={{ paddingBottom:40, overflow:'hidden' }}>
      <div className="container">
        <Reveal>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
            <div className="section-head" style={{ marginBottom:0 }}>
              <span className="section-label">🔥 Hot right now</span>
              <h2 className="section-title">Trending Now</h2>
              <p className="section-sub">Tap a dish to find where to order it</p>
            </div>
          </div>
        </Reveal>
        {/* negative margin trick so horizontal scroll bleeds to screen edge on mobile */}
        <div className="trending-scroll">
          {TRENDING.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <div className="trending-card">
                <div className="trending-img" onClick={() => goDish && goDish(item.name)}>
                  <LazyImg src={item.img} alt={item.name} style={{ width:'100%', height:'100%' }} />
                  <span className="trending-tag">{item.tag}</span>
                  <div className="trending-veg" style={{ borderColor: item.veg ? '#2D7A22' : '#E53E3E', color: item.veg ? '#2D7A22' : '#E53E3E' }}>●</div>
                </div>
                <div className="trending-body">
                  <div className="trending-name" onClick={() => goDish && goDish(item.name)} style={{ cursor:'pointer' }}>{item.name}</div>
                  <div className="trending-rest" onClick={() => goRestaurant(item.restId)}>🏪 {item.rest}</div>
                  <div className="trending-meta">
                    <div className="trending-price">₹{item.price}</div>
                    <div className="trending-rating">
                      <span style={{ color:T.amber }}>★</span>
                      <span style={{ fontWeight:700, color:T.forest }}>{item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                  </div>
                </div>
                <button
                  className="trending-add-btn btn-ripple"
                  onClick={() => handleAdd(item)}
                  style={added[item.id] ? { background:'#4CAF50' } : {}}
                >
                  {added[item.id] ? '✓ Added!' : `+ Add — ₹${item.price}`}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ═══════════════════════════════════════════════════════════════
   ── RESTAURANTS PAGE ──────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function RestaurantsPage({ go, goRestaurant }) {
  const { loading, error, retry } = useAsyncLoad(900);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 280);   // ← only filter after 280ms idle

  const list = RESTAURANTS.filter(r =>
    r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="page">
      <PageBanner
        eyebrow="All Restaurants"
        title={`${RESTAURANTS.length} Restaurants Near You`}
        subtitle="Every cuisine, every craving — handpicked partners who care about quality."
        imgUrl="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90"
        overlay="linear-gradient(135deg, rgba(10,35,20,0.90) 0%, rgba(26,58,42,0.70) 55%, rgba(10,35,20,0.55) 100%)"
      >
        {/* Search bar inside banner */}
        <div style={{ marginTop:28, position:'relative', maxWidth:520 }}>
          <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontSize:18, zIndex:1 }}>🔍</span>
          <input
            className="field"
            placeholder="Search by name or cuisine…"
            style={{ paddingLeft:48, background:'rgba(255,255,255,0.95)', color:T.forest, backdropFilter:'blur(8px)', border:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search restaurants"
          />
        </div>
      </PageBanner>
      <section className="section" style={{ paddingTop:48 }}>
        <div className="container">
          {loading ? (
            <SkeletonRestaurantList count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : list.length === 0 ? (
            <EmptySearch query={search} onClear={() => setSearch('')} />
          ) : (
            <div className="rest-grid">
              {list.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.05}>
                  <RestCard r={r} onClick={() => goRestaurant(r.id)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── EXPLORE PAGE ──────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function ExplorePage({ go, goRestaurant, initCat }) {
  const [filter, setFilter] = useState(initCat || 'All');
  const [sort,   setSort]   = useState('rating');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 280);   // ← only filter after 280ms idle
  const { loading, error, retry } = useAsyncLoad(800);
  const filters = ['All','North Indian','American','Italian','Chinese','Japanese','South Indian','Desserts'];

  const list = RESTAURANTS
    .filter(r => {
      const mF = filter === 'All' || r.cuisine.toLowerCase().includes(filter.toLowerCase());
      const mS = r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || r.cuisine.toLowerCase().includes(debouncedSearch.toLowerCase());
      return mF && mS;
    })
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : a.time.localeCompare(b.time));

  return (
    <div className="page">
      <div style={{ position:'relative', overflow:'hidden', minHeight:360, display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=90" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 40%' }} loading="eager" />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(10,35,20,0.88) 0%, rgba(26,58,42,0.72) 50%, rgba(10,35,20,0.60) 100%)' }} />
        </div>
        <div style={{ padding:'80px 0 88px', position:'relative', zIndex:1, width:'100%' }}>
          <div className="container">
            <Reveal>
              <span className="section-label" style={{ color:T.fern }}>Discover</span>
              <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,5vw,60px)', fontWeight:700, color:'white', lineHeight:1.1, marginBottom:10, textShadow:'0 3px 20px rgba(0,0,0,0.4)' }}>
                Explore Restaurants
              </h1>
              <p style={{ color:T.mist, fontSize:15, fontWeight:300, marginBottom:32 }}>{RESTAURANTS.length} handpicked restaurants near you</p>
            </Reveal>
            <Reveal delay={0.06}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12, maxWidth:700 }}>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontSize:18 }}>🔍</span>
                  <input className="field" placeholder="Search restaurants or cuisines…"
                    style={{ paddingLeft:48, background:'rgba(255,255,255,0.92)', color:T.forest }}
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {['rating','time'].map(s => (
                    <button key={s} onClick={() => setSort(s)}
                      style={{ background: sort === s ? 'white' : 'rgba(255,255,255,0.12)', border: sort === s ? 'none' : '1px solid rgba(255,255,255,0.25)', color: sort === s ? T.forest : 'white', borderRadius:10, padding:'10px 18px', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.2s', textTransform:'capitalize', whiteSpace:'nowrap' }}
                    >{sort === s ? '↓ ' : ''}{s === 'rating' ? 'Top Rated' : 'Fastest'}</button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <section className="section" style={{ background:T.snow, padding:'24px 0 16px' }}>
        <div className="container">
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {filters.map(f => (
              <button key={f} className={`chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop:40 }}>
        <div className="container">
          {loading ? (
            <SkeletonRestaurantList count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : list.length === 0 ? (
            <EmptySearch query={search || filter} onClear={() => { setSearch(''); setFilter('All'); }} />
          ) : (
            <div className="rest-grid">
              {list.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.05}>
                  <RestCard r={r} onClick={() => goRestaurant(r.id)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── RESTAURANT MENU PAGE ──────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function RestaurantMenuPage({ restaurant, cart, addToCart, go }) {
  const menu = RESTAURANT_MENUS[restaurant.id] || {};
  const categories = Object.keys(menu);
  const [activeTab, setActiveTab] = useState(categories[0] || '');
  const { loading, error, retry } = useAsyncLoad(700);

  const increment = (item) => addToCart({ ...item, restId: restaurant.id });
  const decrement = (item) => addToCart({ ...item, _remove: true });
  const getQty    = (id)   => (cart.find(c => c.id === id) || {}).qty || 0;

  return (
    <div style={{ paddingTop:68, minHeight:'100vh' }}>
      {/* Hero */}
      <div className="menu-hero" style={{ paddingBottom:0 }}>
        <div className="container" style={{ paddingBottom:0 }}>
          <button style={{ background:'none', border:'1px solid rgba(200,223,197,0.3)', color:T.mist, borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, marginBottom:20, transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='none'}
            onClick={() => go('restaurants')}
          >← Back</button>
          <div style={{ display:'flex', alignItems:'flex-start', gap:24 }}>
            <div style={{ width:100, height:100, borderRadius:16, overflow:'hidden', border:'3px solid rgba(200,223,197,0.3)', flexShrink:0 }}>
              <img src={restaurant.img} alt={restaurant.name} loading="lazy" decoding="async" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,4vw,42px)', fontWeight:700, color:'white', marginBottom:8, textShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>{restaurant.name}</h1>
              <div style={{ color:T.mist, fontSize:13, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <Stars r={restaurant.rating} />
                <span>⏱ {restaurant.time} min</span>
                <span>{restaurant.price}</span>
                {restaurant.badge && <span style={{ background:'rgba(255,255,255,0.15)', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:700 }}>{restaurant.badge}</span>}
              </div>
            </div>
          </div>
        </div>
        {/* Sticky category tabs */}
        <div className="menu-sticky-cats" style={{ marginTop:24 }}>
          <div className="menu-cat-tabs">
            {categories.map(cat => (
              <button key={cat} className={`menu-cat-tab${activeTab === cat ? ' active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop:40 }}>
        <div className="container">
          {loading ? (
            <SkeletonMenuList count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : (
            <div className="menu-items-grid">
              {(menu[activeTab] || []).map((item, i) => {
                const qty = getQty(item.id);
                return (
                  <Reveal key={item.id} delay={i * 0.05}>
                    <div className="menu-item-card">
                      <div className="menu-item-img">
                        <LazyImg src={item.img} alt={item.name} style={{ width:'100%', height:'100%' }} />
                        {item.badge && (
                          <div style={{ position:'absolute', top:8, left:8 }}>
                            <span className="menu-item-badge">{item.badge}</span>
                          </div>
                        )}
                        <div style={{ position:'absolute', top:8, right:8, width:18, height:18, borderRadius:3, border:`2px solid ${item.veg ? '#2D7A22' : '#E53E3E'}`, background:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background: item.veg ? '#2D7A22' : '#E53E3E' }} />
                        </div>
                      </div>
                      <div className="menu-item-body">
                        <div>
                          <div className="menu-item-name">{item.name}</div>
                          <div className="menu-item-desc">{item.desc}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:T.moss, marginBottom:4 }}>
                            <span style={{ color:T.amber }}>★</span><span style={{ fontWeight:700 }}>{item.rating}</span>
                          </div>
                        </div>
                        <div className="menu-item-bottom">
                          <div className="menu-item-price">₹{item.price}</div>
                          {qty === 0 ? (
                            <button className="menu-add-btn btn-ripple" onClick={() => increment(item)}>+ Add</button>
                          ) : (
                            <div className="menu-qty-ctrl">
                              <button className="menu-qty-btn" onClick={() => decrement(item)}>−</button>
                              <span className="menu-qty-num">{qty}</span>
                              <button className="menu-qty-btn" onClick={() => increment(item)}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Cart nudge */}
          {cart.length > 0 && (
            <div className="cart-nudge" style={{ marginTop:40 }}>
              <div style={{ color:'white' }}>
                <div style={{ fontSize:14, fontWeight:600 }}>🛒 {cart.reduce((s, c) => s + c.qty, 0)} items in cart</div>
                <div style={{ fontSize:12, color:T.mist, marginTop:2 }}>₹{cart.reduce((s, c) => s + c.price * c.qty, 0)} total</div>
              </div>
              <button className="btn-nature btn-ripple" style={{ padding:'10px 24px', fontSize:13 }} onClick={() => go('cart')}>View Cart →</button>
            </div>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── DISH RECOMMENDATIONS PAGE ─────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function DishRecommendationsPage({ dishName, go, goRestaurant, addToCart }) {
  const { loading, error, retry } = useAsyncLoad(800);
  const [added, setAdded] = useState({});

  const restIds = DISH_RESTAURANTS[dishName] || [];
  const restaurants = RESTAURANTS.filter(r => restIds.includes(r.id));

  const dishItems = restaurants.flatMap(rest => {
    const menu = RESTAURANT_MENUS[rest.id] || {};
    return Object.values(menu).flat().filter(i => i.name.toLowerCase().includes(dishName.toLowerCase()))
      .map(i => ({ ...i, restName: rest.name, restId: rest.id }));
  });

  const handleAdd = (item) => {
    addToCart(item);
    setAdded(p => ({ ...p, [item.id]: true }));
    setTimeout(() => setAdded(p => ({ ...p, [item.id]: false })), 1200);
  };

  return (
    <div className="page">
      <div style={{ position:'relative', overflow:'hidden', minHeight:340, display:'flex', alignItems:'center', background:`linear-gradient(135deg, ${T.forest} 0%, ${T.leaf} 100%)` }}>
        <div className="container" style={{ padding:'80px 28px 60px', position:'relative', zIndex:1 }}>
          <Reveal>
            <button style={{ background:'none', border:'1px solid rgba(200,223,197,0.3)', color:T.mist, borderRadius:8, padding:'7px 16px', fontSize:12, fontWeight:600, cursor:'pointer', marginBottom:20, transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='none'}
              onClick={() => go('explore')}
            >← Back to Explore</button>
            <span className="section-label" style={{ color:T.fern }}>Dish Search</span>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(32px,4.5vw,56px)', fontWeight:700, color:'white', lineHeight:1.1, marginBottom:10 }}>{dishName}</h1>
            <p style={{ color:T.mist, fontSize:14, fontWeight:300 }}>Found at {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} near you</p>
          </Reveal>
        </div>
      </div>

      <section className="section" style={{ paddingTop:48 }}>
        <div className="container">
          {loading ? (
            <SkeletonDishList count={4} />
          ) : error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : dishItems.length === 0 ? (
            <EmptyDish dishName={dishName} go={go} />
          ) : (
            <>
              <Reveal>
                <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:T.forest, marginBottom:24 }}>Available at {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''}</h2>
              </Reveal>
              <div className="rest-grid">
                {dishItems.map((item, i) => (
                  <Reveal key={`${item.id}-${item.restId}`} delay={i * 0.07}>
                    <div className="rest-card" style={{ cursor:'default' }}>
                      <div className="rest-img" style={{ cursor:'pointer' }} onClick={() => goRestaurant(item.restId)}>
                        <LazyImg src={item.img} alt={item.name} style={{ width:'100%', height:'100%' }} />
                        {item.badge && <span className="rest-badge">{item.badge}</span>}
                      </div>
                      <div className="rest-body">
                        <div className="rest-name">{item.name}</div>
                        <div className="rest-cuisine" style={{ cursor:'pointer', color:T.sage }} onClick={() => goRestaurant(item.restId)}>🏪 {item.restName}</div>
                        <div style={{ fontSize:12, color:T.moss, marginBottom:12 }}>{item.desc}</div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:T.leaf }}>₹{item.price}</div>
                          <button
                            className="btn-ripple"
                            style={{ background: added[item.id] ? '#4CAF50' : T.forest, color:'white', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                            onClick={() => handleAdd(item)}
                          >{added[item.id] ? '✓ Added' : '+ Add'}</button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── CART PAGE ─────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function CartPage({ cart, setCart, go }) {
  const { user, setUser } = useAuth();
  const [promo, setPromo]       = useState('');
  const [applied, setApplied]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [showAddrModal, setShowAddrModal] = useState(false);

  const CODES = {TERRA30:'percent30',FIRST100:'flat100',FREEDEL:'delivery',NIGHT20:'percent20',FLAT50:'flat50',FIRSTORDER:'percent15'};
  const chQ = (id, d) => setCart(p => p.map(c => c.id === id ? { ...c, qty: c.qty + d } : c).filter(c => c.qty > 0));
  const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const del = sub > 299 ? 0 : 29;
  const tax = Math.round(sub * 0.05);
  const getDiscount = () => {
    if (!applied || !CODES[promo.toUpperCase()]) return 0;
    const type = CODES[promo.toUpperCase()];
    if (type === 'percent30') return Math.round(sub * 0.30);
    if (type === 'flat100')   return 100;
    if (type === 'delivery')  return del;
    if (type === 'percent20') return Math.round(sub * 0.20);
    if (type === 'flat50')    return 50;
    if (type === 'percent15') return Math.round(sub * 0.15);
    return 0;
  };
  const disc  = getDiscount();
  const total = Math.max(0, sub + (applied && CODES[promo.toUpperCase()] === 'delivery' ? 0 : del) + tax - disc);

  const applyP = () => {
    const code = promo.toUpperCase();
    if (CODES[code]) {
      setApplied(true);
      const msgs = {percent30:'✅ 30% discount applied!',flat100:'✅ ₹100 off applied!',delivery:'✅ Free delivery unlocked!',percent20:'✅ 20% night owl discount!',flat50:'✅ ₹50 flat discount!',percent15:'✅ 15% first order discount!'};
      setMsg(msgs[CODES[code]]);
    } else {
      setMsg('❌ Invalid code. Try TERRA30, FLAT50, or FIRSTORDER');
      setApplied(false);
    }
  };

  const placeO = () => {
    if (!user) { go('login'); return; }
    if (!user.address) { setShowAddrModal(true); return; }
    go('checkout');
  };

  if (cart.length === 0) return <EmptyCart go={go} />;

  return (
    <>
      {showAddrModal && (
        <AddressModal
          onSave={addr => { setUser(u => ({ ...u, address: addr })); setShowAddrModal(false); go('checkout'); }}
          onClose={() => setShowAddrModal(false)}
        />
      )}
      <div className="page">
        {/* Cart Hero */}
        <div style={{ position:'relative', overflow:'hidden', minHeight:260, display:'flex', alignItems:'center' }}>
          <div style={{ position:'absolute', inset:0, zIndex:0 }}>
            <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1600&q=90" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 55%' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(10,35,20,0.85) 0%, rgba(26,58,42,0.70) 50%, rgba(10,35,20,0.58) 100%)' }} />
          </div>
          <div style={{ padding:'64px 0 72px', position:'relative', zIndex:1, width:'100%' }}>
            <div className="container">
              <span className="section-label" style={{ color:T.fern }}>Checkout</span>
              <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(30px,4vw,52px)', fontWeight:700, color:'white', lineHeight:1.1, textShadow:'0 3px 20px rgba(0,0,0,0.4)' }}>Your Cart</h1>
              <p style={{ color:T.mist, fontSize:14, marginTop:8 }}>{cart.reduce((s, c) => s + c.qty, 0)} items ready to order</p>
            </div>
          </div>
        </div>

        <section className="section" style={{ paddingTop:40 }}>
          <div className="container">
            <div className="cart-layout">
              <div>
                {del === 0 && (
                  <div style={{ background:'rgba(45,90,61,0.08)', border:'1px solid rgba(45,90,61,0.2)', borderRadius:12, padding:'12px 18px', marginBottom:18, fontSize:13, color:T.leaf, fontWeight:600 }}>
                    🎉 Free delivery unlocked!
                  </div>
                )}
                {cart.map((item, i) => (
                  <div key={item.id} className="cart-item" style={{ animationDelay:`${i * 50}ms` }}>
                    <div className="cart-item-img"><img src={item.img} alt={item.name} /></div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:T.forest, marginBottom:2 }}>{item.name}</div>
                      <div style={{ fontSize:12, color:T.moss }}>₹{item.price} each</div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => chQ(item.id, -1)}>−</button>
                      <span style={{ fontWeight:700, fontSize:15, minWidth:24, textAlign:'center' }}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => chQ(item.id, 1)}>+</button>
                    </div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:T.leaf, minWidth:60, textAlign:'right' }}>₹{item.price * item.qty}</div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:T.forest, marginBottom:20 }}>Order Summary</h3>
                <div style={{ marginBottom:20 }}>
                  <div className="coupon-input-row">
                    <input className="field" placeholder="Promo code (try TERRA30)" value={promo}
                      onChange={e => { setPromo(e.target.value); setMsg(''); setApplied(false); }}
                      onKeyDown={e => e.key === 'Enter' && applyP()}
                      style={{ fontSize:13 }}
                    />
                    <button className="btn-primary btn-ripple" style={{ padding:'12px 18px', fontSize:13, flexShrink:0 }} onClick={applyP}>Apply</button>
                  </div>
                  {msg && <p className={msg.startsWith('✅') ? 'coupon-msg-success' : 'coupon-msg-error'}>{msg}</p>}
                </div>
                {[['Subtotal', `₹${sub}`],['Delivery', del === 0 ? 'Free 🎉' : `₹${del}`],['Tax (5%)', `₹${tax}`],disc > 0 ? ['Discount', `-₹${disc}`] : null].filter(Boolean).map(([l, v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color: l === 'Discount' ? '#4CAF50' : T.moss }}>
                    <span>{l}</span><span style={{ fontWeight: l === 'Discount' ? 700 : 400 }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop:`1px solid rgba(107,158,122,0.15)`, paddingTop:16, marginTop:6, display:'flex', justifyContent:'space-between', fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:700, color:T.forest }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
                <button className="btn-nature btn-ripple" style={{ width:'100%', marginTop:20, fontSize:15, padding:'16px' }} onClick={placeO}>
                  Place Order →
                </button>
                <p style={{ fontSize:11, color:T.moss, textAlign:'center', marginTop:10 }}>🔒 Secure checkout · 100% safe</p>
              </div>
            </div>
          </div>
        </section>
        <Footer go={go} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── OFFERS PAGE ───────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
const OFFERS_DATA = [
  {code:"TERRA30",title:"Weekend Feast",desc:"30% off on orders above ₹500",saving:"Save up to ₹180",expires:"Valid this weekend",color:T.sage},
  {code:"FIRST100",title:"Welcome Gift",desc:"₹100 off on your very first order",saving:"Save ₹100",expires:"New users only",color:T.earth},
  {code:"FREEDEL",title:"Free Delivery",desc:"Zero delivery charges on any order",saving:"Save ₹29",expires:"This week",color:T.moss},
  {code:"NIGHT20",title:"Night Owl",desc:"20% off on orders after 9 PM",saving:"Save up to ₹120",expires:"Daily 9PM–1AM",color:T.dusk},
  {code:"FLAT50",title:"Midweek Special",desc:"Flat ₹50 off on all orders",saving:"Save ₹50",expires:"Mon–Wed only",color:T.bark},
  {code:"FIRSTORDER",title:"First Order",desc:"15% off on your first order",saving:"Save up to ₹90",expires:"One-time use",color:T.amber},
];

function OffersPage({ go }) {
  const [copied, setCopied] = useState({});
  const copy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(p => ({ ...p, [code]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [code]: false })), 1500);
  };

  return (
    <div className="page">
      <PageBanner
        eyebrow="Save Big"
        title={<>Offers &amp; Discounts</>}
        subtitle="Hand-picked deals that put more food on your table for less. Grab them before they expire."
        imgUrl="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=1600&q=90"
        overlay="linear-gradient(135deg, rgba(10,35,20,0.88) 0%, rgba(26,58,42,0.68) 55%, rgba(10,35,20,0.50) 100%)"
      />
      <section className="section" style={{ paddingTop:48 }}>
        <div className="container">
          <div className="offers-grid">
            {OFFERS_DATA.map((offer, i) => (
              <Reveal key={offer.code} delay={i * 0.06}>
                <div className="offer-card">
                  <div style={{ width:48, height:48, borderRadius:12, background:`${offer.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16 }}>💚</div>
                  <div className="offer-code">{offer.code}</div>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:T.forest, marginBottom:8 }}>{offer.title}</h3>
                  <p style={{ fontSize:13, color:T.moss, marginBottom:8, fontWeight:300 }}>{offer.desc}</p>
                  <div style={{ fontSize:12, fontWeight:700, color:offer.color, marginBottom:4 }}>{offer.saving}</div>
                  <div style={{ fontSize:11, color:T.moss, marginBottom:16 }}>⏱ {offer.expires}</div>
                  <button
                    style={{ display:'block', width:'100%', background: copied[offer.code] ? '#4CAF50' : T.forest, color:'white', border:'none', borderRadius:8, padding:'10px 18px', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.25s', letterSpacing:'0.04em' }}
                    onClick={() => copy(offer.code)}
                  >{copied[offer.code] ? '✓ Copied!' : 'Copy Code'}</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── TRACK PAGE ────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
const TRACK_STEPS = [
  {label:"Order Placed",icon:"📋",desc:"Confirmed & being processed"},
  {label:"Preparing",icon:"👨‍🍳",desc:"Chef is crafting your meal"},
  {label:"Out for Delivery",icon:"🛵",desc:"Rider heading your way"},
  {label:"Delivered",icon:"🎉",desc:"Enjoy your meal!"},
];

function TrackPage({ go }) {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    if (step >= TRACK_STEPS.length - 1) { setAuto(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 3500);
    return () => clearTimeout(t);
  }, [step, auto]);

  const etaMin = step >= 3 ? 0 : 18 - step * 5;

  return (
    <div className="page">
      <PageBanner
        eyebrow="Live Tracking"
        title="Track Your Order"
        subtitle={`Order #TER-2025-8847 · ${step >= 3 ? 'Delivered! 🎉' : `ETA: ${etaMin} minutes`}`}
        imgUrl="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=90"
        overlay="linear-gradient(135deg, rgba(10,35,20,0.92) 0%, rgba(26,58,42,0.75) 60%, rgba(10,35,20,0.55) 100%)"
      />
      <section className="section" style={{ paddingTop:48 }}>
        <div className="container" style={{ maxWidth:720 }}>
          <div style={{ background:'white', borderRadius:20, padding:32, boxShadow:`0 4px 20px ${T.shadow}`, border:`1px solid rgba(107,158,122,0.1)`, marginBottom:24 }}>
            <div className="track-steps">
              {TRACK_STEPS.map((s, i) => (
                <div key={s.label} className={`track-step${i <= step ? ' done' : ''}${i === step ? ' current' : ''}`}>
                  <div className="track-icon">{i <= step ? (i < step ? '✓' : s.icon) : s.icon}</div>
                  <div className="track-label">{s.label}</div>
                  <div style={{ fontSize:10, color:T.moss, textAlign:'center', marginTop:2 }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background:`linear-gradient(135deg, rgba(74,124,89,0.06), rgba(45,90,61,0.04))`, borderRadius:14, padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg, ${T.sage}, ${T.leaf})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                {TRACK_STEPS[step].icon}
              </div>
              <div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:T.forest }}>{TRACK_STEPS[step].label}</div>
                <div style={{ fontSize:13, color:T.moss, fontWeight:300 }}>{TRACK_STEPS[step].desc}</div>
              </div>
              {step < 3 && (
                <div style={{ marginLeft:'auto', background:T.forest, color:'white', borderRadius:10, padding:'8px 16px', fontSize:13, fontWeight:700 }}>
                  🛵 {etaMin} min
                </div>
              )}
            </div>
            {step < 3 && (
              <button className="btn-outline" style={{ marginTop:20, width:'100%' }} onClick={() => { setAuto(false); setStep(s => Math.min(s + 1, 3)); }}>
                Advance Step (Demo) →
              </button>
            )}
            {step === 3 && (
              <div style={{ marginTop:20, textAlign:'center' }}>
                <div style={{ fontSize:48, marginBottom:8, animation:'bounceIn 0.5s ease' }}>🎉</div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:700, color:T.forest, marginBottom:6 }}>Enjoy your meal!</div>
                <button className="btn-nature btn-ripple" onClick={() => go('home')}>Order Again →</button>
              </div>
            )}
          </div>

          <div style={{ background:'white', borderRadius:20, padding:32, boxShadow:`0 4px 20px ${T.shadow}`, border:`1px solid rgba(107,158,122,0.1)` }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:T.forest, marginBottom:16 }}>🗺️ Live Map</h3>
            <div className="realistic-map">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15626.14!2d76.6488!3d12.3053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf6b4e6b5d5555%3A0x1!2sMG+Road%2C+Mysuru!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border:'none', display:'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Delivery map"
              />
              <div className="map-eta-chip">{step >= 3 ? '✅ Delivered!' : `🛵 ETA: ${etaMin} min`}</div>
            </div>
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── HELP PAGE ─────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function HelpPage({ go }) {
  return (
    <div className="page">
      <PageBanner
        eyebrow="Support Centre"
        title="Help & FAQ"
        subtitle="Hover or tap any question to reveal the answer. Our team is always here if you need more."
        imgUrl="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=90"
        overlay="linear-gradient(135deg, rgba(10,35,20,0.90) 0%, rgba(26,58,42,0.72) 55%, rgba(10,35,20,0.55) 100%)"
      />

      <section className="section" style={{ paddingTop:52 }}>
        <div className="container" style={{ maxWidth:740 }}>

          {/* Subtle intro line */}
          <Reveal>
            <p style={{ fontSize:13, color:T.moss, fontWeight:400, marginBottom:32, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ display:'inline-block', width:20, height:1.5, background:T.fern, borderRadius:2 }} />
              {FAQS.length} frequently asked questions
            </p>
          </Reveal>

          {/* Hover-expand FAQ accordion */}
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}

          {/* CTA card */}
          <Reveal delay={0.32}>
            <div style={{
              background: `linear-gradient(135deg, ${T.forest}, ${T.leaf})`,
              borderRadius: 20, padding: '36px 40px',
              textAlign: 'center', marginTop: 44, color: 'white',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* decorative circle */}
              <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
              <div style={{ fontSize:40, marginBottom:14 }}>💬</div>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, marginBottom:10, lineHeight:1.2 }}>
                Still need help?
              </h3>
              <p style={{ fontSize:14, color:T.mist, marginBottom:24, fontWeight:300, lineHeight:1.65, maxWidth:360, margin:'0 auto 24px' }}>
                Our support team is available 24 / 7. Average response time is under 3 minutes.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button
                  className="btn-ripple"
                  style={{ background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.35)', color:'white', borderRadius:12, padding:'13px 30px', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; e.currentTarget.style.transform=''; }}
                >
                  💬 Chat with Support
                </button>
                <button
                  className="btn-ripple"
                  style={{ background:'transparent', border:'1.5px solid rgba(255,255,255,0.25)', color:'rgba(255,255,255,0.85)', borderRadius:12, padding:'13px 24px', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.color='white'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; e.currentTarget.style.color='rgba(255,255,255,0.85)'; }}
                  onClick={() => go('home')}
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── ABOUT PAGE ────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
const CHEFS = [
  {name:"Chef Aryan Kapoor",specialty:"North Indian & Mughlai",exp:"18 yrs experience",bio:"Former head chef at The Leela Palace, Aryan brings royal Mughlai secrets into every dish.",img:"https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400&q=80",emoji:"🌿"},
  {name:"Chef Meera Nair",specialty:"South Indian & Coastal",exp:"14 yrs experience",bio:"Born in Kerala's spice coast, Meera crafts dishes that tell stories of monsoon forests.",img:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",emoji:"🌊"},
  {name:"Chef Ravi Shetty",specialty:"Fusion & Desserts",exp:"11 yrs experience",bio:"A Mumbai-trained pastry wizard who blends East and West into unforgettable dessert experiences.",img:"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",emoji:"🍃"},
];

function AboutPage({ go }) {
  return (
    <div className="page">
      <div style={{ position:'relative', overflow:'hidden', minHeight:480, display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <img src="https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1600&q=90" alt="" loading="lazy" decoding="async" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(10,35,20,0.88) 0%, rgba(26,58,42,0.72) 50%, rgba(10,35,20,0.60) 100%)' }} />
        </div>
        <div className="container" style={{ padding:'120px 28px', position:'relative', zIndex:1 }}>
          <Reveal>
            <span className="section-label" style={{ color:T.fern }}>Our Story</span>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(42px,6vw,76px)', fontWeight:700, color:'white', lineHeight:1.0, marginBottom:16, textShadow:'0 3px 24px rgba(0,0,0,0.4)' }}>
              Food with a<br/><em style={{ fontStyle:'italic', color:T.fern }}>soul</em>
            </h1>
            <p style={{ color:'rgba(220,240,220,0.90)', fontSize:17, fontWeight:300, maxWidth:520, lineHeight:1.7 }}>
              Terra Eats was founded on a simple belief: great food comes from the earth, not a factory. We connect mindful eaters with restaurants who care.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
            <Reveal>
              <span className="section-label">Our Mission</span>
              <h2 className="section-title">We carefully select partners who share our values</h2>
              <p style={{ color:T.earth, fontSize:15, fontWeight:300, lineHeight:1.85, marginBottom:20 }}>
                Seasonal ingredients, minimal waste, and treating their teams with dignity. Every restaurant on Terra Eats passes our 12-point sustainability check.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:36 }}>
                {[['12K+','Trees Planted'],['500+','Partners'],['50K+','Happy Customers']].map(([n, l]) => (
                  <div key={l} style={{ textAlign:'center', padding:'20px 16px', background:T.snow, borderRadius:16, border:`1px solid rgba(107,158,122,0.12)` }}>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, color:T.sage }}>{n}</div>
                    <div style={{ fontSize:11, color:T.moss, marginTop:4, fontWeight:500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ borderRadius:24, overflow:'hidden', boxShadow:`0 20px 60px ${T.shadowD}` }}>
                <LazyImg src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90" alt="Restaurant" style={{ width:'100%', height:440 }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ background:T.snow }}>
        <div className="container">
          <Reveal>
            <div className="section-head" style={{ textAlign:'center' }}>
              <span className="section-label">Meet the Team</span>
              <h2 className="section-title">The Chefs Behind the Magic</h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:28, marginTop:48 }}>
            {CHEFS.map((chef, i) => (
              <Reveal key={chef.name} delay={i * 0.08}>
                <div style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:`0 4px 24px ${T.shadow}`, border:`1px solid rgba(107,158,122,0.1)`, transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow=`0 24px 60px ${T.shadowD}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 4px 24px ${T.shadow}`; }}
                >
                  <div style={{ position:'relative', height:300, overflow:'hidden' }}>
                    <LazyImg src={chef.img} alt={chef.name} style={{ width:'100%', height:'100%', transition:'transform 0.5s' }} />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(26,58,42,0.7) 0%, transparent 50%)' }} />
                    <div style={{ position:'absolute', bottom:16, right:16, fontSize:28 }}>{chef.emoji}</div>
                  </div>
                  <div style={{ padding:'22px 24px 26px' }}>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:T.forest }}>{chef.name}</div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:T.sage, margin:'6px 0 10px' }}>{chef.specialty}</div>
                    <div style={{ fontSize:11, color:T.moss, marginBottom:12 }}>🏅 {chef.exp}</div>
                    <p style={{ fontSize:13, color:T.earth, lineHeight:1.7, fontWeight:300 }}>{chef.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── CHECKOUT PAGE ─────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function CheckoutPage({ go, cart }) {
  const { user } = useAuth();
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [payOpt, setPayOpt]     = useState('upi');
  const sub   = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const del   = sub > 299 ? 0 : 29;
  const tax   = Math.round(sub * 0.05);
  const total = sub + del + tax;

  const placeOrder = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  if (done) return (
    <div className="page" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80vh', textAlign:'center', padding:24 }}>
      <div style={{ fontSize:80, marginBottom:20, animation:'bounceIn 0.5s ease' }}>🎉</div>
      <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:36, fontWeight:700, color:T.forest, marginBottom:10 }}>Order Placed!</h2>
      <p style={{ color:T.moss, fontSize:15, fontWeight:300, marginBottom:8 }}>Your food is being prepared with love.</p>
      <p style={{ color:T.moss, fontSize:13, marginBottom:32 }}>Order #TER-2025-8847 · Estimated delivery: 30 min</p>
      <div style={{ display:'flex', gap:12 }}>
        <button className="btn-nature btn-ripple" onClick={() => go('track')}>Track Order →</button>
        <button className="btn-outline" onClick={() => go('home')}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div style={{ background:`linear-gradient(135deg, ${T.forest} 0%, ${T.leaf} 100%)`, padding:'80px 0 60px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color:T.fern }}>Final Step</span>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(30px,4vw,52px)', fontWeight:700, color:'white' }}>Checkout</h1>
          </Reveal>
        </div>
      </div>
      <section className="section" style={{ paddingTop:40 }}>
        <div className="container">
          <div className="checkout-layout">
            <div>
              <div className="checkout-section animate-fade-up">
                <h3>📍 Delivery Address</h3>
                {user?.address ? (
                  <div style={{ background:T.snow, borderRadius:12, padding:'16px 20px', border:`1px solid rgba(107,158,122,0.15)` }}>
                    <div style={{ fontWeight:600, color:T.forest, marginBottom:4 }}>{user.address.line1}</div>
                    <div style={{ fontSize:13, color:T.moss }}>{user.address.city} — {user.address.pincode}</div>
                  </div>
                ) : (
                  <div className="form-row">
                    {[['Full Name',''],['Phone','']].map(([ph]) => (
                      <div key={ph} className="form-group"><input className="field" placeholder={ph} /></div>
                    ))}
                    <div className="form-group" style={{ gridColumn:'1/-1' }}><input className="field" placeholder="Street / Flat / Building" /></div>
                    <div className="form-group"><input className="field" placeholder="City" /></div>
                    <div className="form-group"><input className="field" placeholder="Pincode" /></div>
                  </div>
                )}
              </div>
              <div className="checkout-section animate-fade-up" style={{ animationDelay:'0.08s' }}>
                <h3>💳 Payment</h3>
                {[['upi','UPI / GPay / PhonePe','⚡'],['card','Credit / Debit Card','💳'],['cod','Cash on Delivery','💵']].map(([id, label, icon]) => (
                  <div key={id} onClick={() => setPayOpt(id)} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:12, border:`1.5px solid ${payOpt === id ? T.sage : 'rgba(107,158,122,0.2)'}`, background: payOpt === id ? 'rgba(107,158,122,0.06)' : 'transparent', cursor:'pointer', transition:'all 0.2s', marginBottom:10 }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${payOpt === id ? T.sage : T.fern}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {payOpt === id && <div style={{ width:9, height:9, borderRadius:'50%', background:T.sage }} />}
                    </div>
                    <span style={{ fontSize:22 }}>{icon}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:T.forest }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="cart-summary" style={{ position:'sticky', top:88 }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:T.forest, marginBottom:20 }}>Order Summary</h3>
                {cart.slice(0, 3).map(item => (
                  <div key={item.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color:T.forest }}>
                    <span>{item.name} ×{item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
                {cart.length > 3 && <div style={{ fontSize:12, color:T.moss, marginBottom:10 }}>+{cart.length - 3} more items</div>}
                <div style={{ borderTop:`1px solid rgba(107,158,122,0.15)`, paddingTop:12, marginTop:12 }}>
                  {[['Subtotal', `₹${sub}`],['Delivery', del === 0 ? 'Free' : `₹${del}`],['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13, color:T.moss }}><span>{l}</span><span>{v}</span></div>
                  ))}
                </div>
                <div style={{ borderTop:`1px solid rgba(107,158,122,0.15)`, paddingTop:16, display:'flex', justifyContent:'space-between', fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:700, color:T.forest }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
                <button className="btn-nature btn-ripple" style={{ width:'100%', marginTop:20, fontSize:15, padding:'16px', opacity: loading ? 0.8 : 1 }} onClick={placeOrder} disabled={loading}>
                  {loading ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}><span className="spinner" style={{ width:20, height:20 }} /> Placing Order…</span> : 'Confirm & Pay →'}
                </button>
                <p style={{ fontSize:11, color:T.moss, textAlign:'center', marginTop:10 }}>🔒 256-bit SSL secured</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── LOGIN PAGE ────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
function LoginPage({ go }) {
  const { setUser } = useAuth();
  const [form, setForm]   = useState({ name:'', email:'', pass:'' });
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.pass.trim()) { setErr('Please fill all fields'); return; }
    if (!form.email.includes('@')) { setErr('Enter a valid email'); return; }
    if (form.pass.length < 6)      { setErr('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name, email: form.email });
      go('home');
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div style={{ position:'absolute', inset:0 }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.25 }} />
        </div>
        <div style={{ position:'relative', zIndex:1, color:'white' }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:36, fontWeight:700, marginBottom:16 }}>🌿 Terra Eats</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, marginBottom:12, lineHeight:1.2 }}>Food that feels good,<br/><em>for you & the planet.</em></h2>
          <p style={{ fontSize:14, opacity:0.8, fontWeight:300, lineHeight:1.7, maxWidth:340 }}>Join 50,000+ eco-conscious food lovers who choose seasonal, sustainable, and utterly delicious.</p>
        </div>
      </div>
      <div className="login-form-side">
        <div className="login-form">
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, color:T.forest, marginBottom:6 }}>Welcome back</h2>
          <p style={{ color:T.moss, fontSize:14, marginBottom:32, fontWeight:300 }}>Sign in to continue ordering</p>
          {[['Full Name','name','text','Chef Priya Sharma'],['Email Address','email','email','you@example.com'],['Password','pass','password','••••••••']].map(([label, key, type, ph]) => (
            <div key={key} style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>{label}</label>
              <input type={type} className="field" placeholder={ph} value={form[key]}
                onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErr(''); }}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
            </div>
          ))}
          {err && <p style={{ color:'#E53E3E', fontSize:12, marginBottom:16, fontWeight:600 }}>⚠️ {err}</p>}
          <button className="btn-nature btn-ripple" style={{ width:'100%', fontSize:15, padding:'15px', marginBottom:16, opacity: loading ? 0.8 : 1 }} onClick={submit} disabled={loading}>
            {loading ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><span className="spinner" style={{ width:18, height:18 }} /> Signing in…</span> : 'Sign In →'}
          </button>
          <p style={{ fontSize:13, color:T.moss, textAlign:'center' }}>Don't have an account?{' '}
            <button style={{ background:'none', border:'none', color:T.sage, fontWeight:600, cursor:'pointer', fontSize:13 }} onClick={() => go('signup')}>Sign up free</button>
          </p>
          <button style={{ marginTop:16, background:'none', border:'none', color:T.moss, cursor:'pointer', fontSize:12, display:'block', textAlign:'center', width:'100%' }} onClick={() => go('home')}>← Back to home</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── SIGNUP PAGE (FIX: was missing — "Sign up free" had no route)
   ═══════════════════════════════════════════════════════════════ */
function SignupPage({ go }) {
  const { setUser } = useAuth();
  const [form, setForm]       = useState({ name:'', email:'', pass:'', confirm:'' });
  const [err,  setErr]        = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.pass.trim() || !form.confirm.trim()) {
      setErr('Please fill all fields'); return;
    }
    if (!form.email.includes('@')) { setErr('Enter a valid email'); return; }
    if (form.pass.length < 6)      { setErr('Password must be at least 6 characters'); return; }
    if (form.pass !== form.confirm) { setErr('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name, email: form.email });
      go('home');
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div style={{ position:'absolute', inset:0 }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90" alt="" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.25 }} />
        </div>
        <div style={{ position:'relative', zIndex:1, color:'white' }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:36, fontWeight:700, marginBottom:16 }}>🌿 Terra Eats</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, marginBottom:12, lineHeight:1.2 }}>
            Join the table.<br/><em>Eat better, live greener.</em>
          </h2>
          <p style={{ fontSize:14, opacity:0.8, fontWeight:300, lineHeight:1.7, maxWidth:340 }}>
            Create your free account and unlock exclusive offers, order tracking, and personalised picks.
          </p>
        </div>
      </div>
      <div className="login-form-side">
        <div className="login-form">
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, color:T.forest, marginBottom:6 }}>Create account</h2>
          <p style={{ color:T.moss, fontSize:14, marginBottom:32, fontWeight:300 }}>It's free — forever 🌱</p>
          {[
            ['Full Name',        'name',    'text',     'Chef Priya Sharma'],
            ['Email Address',    'email',   'email',    'you@example.com'],
            ['Password',         'pass',    'password', '••••••••'],
            ['Confirm Password', 'confirm', 'password', '••••••••'],
          ].map(([label, key, type, ph]) => (
            <div key={key} style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>{label}</label>
              <input
                type={type} className="field" placeholder={ph} value={form[key]}
                onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErr(''); }}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
            </div>
          ))}
          {err && <p style={{ color:'#E53E3E', fontSize:12, marginBottom:16, fontWeight:600 }}>⚠️ {err}</p>}
          <button
            className="btn-nature btn-ripple"
            style={{ width:'100%', fontSize:15, padding:'15px', marginBottom:16, opacity: loading ? 0.8 : 1 }}
            onClick={submit} disabled={loading}
          >
            {loading
              ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><span className="spinner" style={{ width:18, height:18 }} /> Creating account…</span>
              : 'Sign Up Free 🌿'}
          </button>
          <p style={{ fontSize:13, color:T.moss, textAlign:'center' }}>Already have an account?{' '}
            <button style={{ background:'none', border:'none', color:T.sage, fontWeight:600, cursor:'pointer', fontSize:13 }} onClick={() => go('login')}>Sign in</button>
          </p>
          <button style={{ marginTop:16, background:'none', border:'none', color:T.moss, cursor:'pointer', fontSize:12, display:'block', textAlign:'center', width:'100%' }} onClick={() => go('home')}>← Back to home</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ── LAZY IMAGE — FIX: replaces bare <img> for scroll performance
   Uses IntersectionObserver so off-screen images never load.
   Renders a shimmer skeleton until the image enters the viewport.
   ═══════════════════════════════════════════════════════════════ */
const LazyImg = memo(function LazyImg({ src, alt, style, className, ...rest }) {
  const [inView,  setInView]  = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    // Use native loading="lazy" as first-class fallback
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '200px' }   // start loading 200px before viewport entry
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position:'relative', overflow:'hidden', ...style }} className={className}>
      {/* shimmer placeholder shown until image loads */}
      {!loaded && <div className="skel" style={{ position:'absolute', inset:0, borderRadius:0 }} />}
      {inView && (
        <img
          src={src} alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{ width:'100%', height:'100%', objectFit:'cover', opacity: loaded ? 1 : 0, transition:'opacity 0.35s ease' }}
          {...rest}
        />
      )}
    </div>
  );
});


const DEFAULT_CART = [];

export default function App() {
  const [page, setPage]           = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [cart, setCart]           = useState(DEFAULT_CART);
  const [toast, setToast]         = useState(null);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [user, setUser]           = useState(null);

  // useMemo so cnt doesn't cause MobNav/Navbar re-renders on unrelated state changes
  const cnt = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  const addToCart = useCallback((item) => {
    if (item._remove) {
      setCart(p => p.map(c => c.id === item.id ? { ...c, qty: Math.max(0, c.qty - 1) } : c).filter(c => c.qty > 0));
      return;
    }
    setCart(p => {
      const ex = p.find(c => c.id === item.id);
      return ex ? p.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c) : [...p, { ...item, qty:1 }];
    });
    setToast(`${item.name} added to cart 🌿`);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const go = useCallback((p, params = {}) => {
    setPage(p);
    setPageParams(params);
    window.scrollTo({ top:0, behavior:'smooth' });
  }, []);

  const goRestaurant = useCallback((restId) => {
    const rest = RESTAURANTS.find(r => r.id === restId);
    if (rest) { setActiveRestaurant(rest); setPage('restaurant'); window.scrollTo({ top:0, behavior:'smooth' }); }
  }, []);

  const goDish = useCallback((dishName) => {
    setPageParams({ dishName });
    setPage('dish');
    window.scrollTo({ top:0, behavior:'smooth' });
  }, []);

  // Memoize commonProps object reference to avoid child re-renders
  const commonProps = useMemo(() => ({ go, cart, setCart, addToCart }), [go, cart, addToCart]);

  const renderPage = () => {
    if (page === 'restaurant' && activeRestaurant) {
      return <RestaurantMenuPage key={`rest-${activeRestaurant.id}`} restaurant={activeRestaurant} cart={cart} addToCart={addToCart} go={go} />;
    }
    if (page === 'dish' && pageParams.dishName) {
      return (
        <DishComparisonDashboard
          dishName={pageParams.dishName}
          go={go}
          goRestaurant={goRestaurant}
          addToCart={addToCart}
          RESTAURANTS={RESTAURANTS}
          RESTAURANT_MENUS={RESTAURANT_MENUS}
          DISH_RESTAURANTS={DISH_RESTAURANTS}
          T={T}
        />
      );
    }

    const pages = {
      home:        <HomePage        {...commonProps} goRestaurant={goRestaurant} goDish={goDish} />,
      restaurants: <RestaurantsPage {...commonProps} goRestaurant={goRestaurant} />,
      explore:     <ExplorePage     {...commonProps} goRestaurant={goRestaurant} initCat={pageParams.catFilter} />,
      offers:      <OffersPage      {...commonProps} />,
      track:       <TrackPage       {...commonProps} />,
      help:        <HelpPage        {...commonProps} />,
      about:       <AboutPage       {...commonProps} />,
      cart:        <CartPage        {...commonProps} />,
      checkout:    <CheckoutPage    {...commonProps} />,
      login:       <LoginPage       {...commonProps} />,
      signup:      <SignupPage      {...commonProps} />,
      contact:     <ContactPage     go={go} />,
    };

    return pages[page] || pages.home;
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <style>{CSS}</style>
      {page !== 'login' && page !== 'signup' && <Navbar page={page} go={go} cnt={cnt} user={user} />}
      <div key={page} className="page-enter">
        {renderPage()}
      </div>
      {page !== 'login' && page !== 'signup' && <MobNav page={page} go={go} cnt={cnt} />}
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </AuthContext.Provider>
  );
}