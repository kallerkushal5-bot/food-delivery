import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════════════════
   🌿 TERRA EATS — Full Food Delivery Platform
   Home → Restaurants → Menu → Cart → Order Tracking
   ══════════════════════════════════════════════════════════════ */

const T = {
  forest:  "#1A3A2A",
  leaf:    "#2D5A3D",
  sage:    "#4A7C59",
  moss:    "#6B9E7A",
  fern:    "#8FBA99",
  mist:    "#C8DFC5",
  cream:   "#F7F3EC",
  sand:    "#EDE6D6",
  earth:   "#8B6F47",
  sunset:  "#E8742A",
  amber:   "#D4A017",
  dusk:    "#C45B1A",
  bark:    "#5C3D1E",
  snow:    "#FDFAF5",
  shadow:  "rgba(26,58,42,0.15)",
  shadowD: "rgba(26,58,42,0.3)",
};

/* ─── DATA ───────────────────────────────────────────────────── */
const RESTAURANTS = [
  { id:1, name:"Spice Garden",    cuisine:"North Indian",  rating:4.5, time:"25-30", price:"₹₹",   discount:"30% off",      img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=85", badge:"Popular",    tags:["Biryani","Starters","Mains"] },
  { id:2, name:"Burger Republic", cuisine:"American",      rating:4.3, time:"20-25", price:"₹₹",   discount:"₹50 off",      img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=85", badge:"Fast",       tags:["Burger","Wraps"] },
  { id:3, name:"Pasta Palace",    cuisine:"Italian",       rating:4.7, time:"30-35", price:"₹₹₹",  discount:"20% off",      img:"https://images.unsplash.com/photo-1551183053-bf91798d792b?w=500&q=85", badge:"Chef's Pick",tags:["Pizza","Noodles","Salads"] },
  { id:4, name:"Dragon Wok",      cuisine:"Chinese",       rating:4.1, time:"25-30", price:"₹",    discount:"₹75 off",      img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=85", badge:null,         tags:["Noodles","Rolls","Seafood"] },
  { id:5, name:"Pizza Volcano",   cuisine:"Italian",       rating:4.6, time:"15-20", price:"₹₹",   discount:"Buy 1 Get 1",  img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=85", badge:"New",        tags:["Pizza"] },
  { id:6, name:"Sushi Bay",       cuisine:"Japanese",      rating:4.8, time:"35-40", price:"₹₹₹₹", discount:"Free Delivery",img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=85", badge:"Top Rated",  tags:["Sushi","Seafood"] },
  { id:7, name:"Dosa Junction",   cuisine:"South Indian",  rating:4.4, time:"15-20", price:"₹",    discount:"Free Delivery",img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=85", badge:null,         tags:["Coffee","Tacos"] },
  { id:8, name:"Sweet Tooth",     cuisine:"Desserts",      rating:4.9, time:"20-25", price:"₹₹",   discount:"15% off",      img:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=85", badge:"Fan Fav",    tags:["Desserts","Coffee"] },
];

// Per-restaurant menus
const RESTAURANT_MENUS = {
  1: { // Spice Garden
    Starters:[
      {id:101,name:"Paneer Tikka",      price:249,veg:true, img:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80",desc:"Chargrilled cottage cheese with tangy marinade",rating:4.6,badge:"Bestseller"},
      {id:102,name:"Chicken Kebab",     price:299,veg:false,img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80",desc:"Juicy minced chicken kebabs on skewers",       rating:4.7,badge:"Spicy"},
      {id:103,name:"Samosa (2 pcs)",    price:79, veg:true, img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80",desc:"Crispy pastry with spiced potato & peas",       rating:4.4,badge:null},
    ],
    Mains:[
      {id:201,name:"Butter Chicken",    price:319,veg:false,img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&q=80",desc:"Tender chicken in rich tomato-butter sauce",    rating:4.8,badge:"Bestseller"},
      {id:202,name:"Dal Makhani",       price:199,veg:true, img:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300&q=80",desc:"Slow-cooked black lentils with cream & butter",   rating:4.7,badge:null},
      {id:205,name:"Veg Biryani",       price:229,veg:true, img:"https://images.unsplash.com/photo-1563379091339-03246963d96e?w=300&q=80",desc:"Fragrant basmati rice with vegetables",          rating:4.5,badge:null},
      {id:206,name:"Chicken Biryani",   price:299,veg:false,img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&q=80",desc:"Hyderabadi dum biryani with saffron & raita",   rating:4.8,badge:"Most Ordered"},
    ],
    Drinks:[
      {id:601,name:"Mango Lassi",       price:89, veg:true, img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80",desc:"Thick chilled yogurt-mango smoothie",              rating:4.7,badge:"Summer Hit"},
      {id:603,name:"Masala Chai",       price:49, veg:true, img:"https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=80",desc:"Ginger-cardamom spiced milk tea",                  rating:4.6,badge:"Classic"},
    ],
  },
  2: { // Burger Republic
    Burgers:[
      {id:301,name:"Classic Beef Burger",price:199,veg:false,img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",desc:"Juicy beef patty with lettuce, tomato & cheese",rating:4.5,badge:"Bestseller"},
      {id:302,name:"Chicken Crispy",     price:179,veg:false,img:"https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80",desc:"Crispy fried chicken with spicy mayo",             rating:4.4,badge:null},
      {id:303,name:"Mushroom Swiss",     price:219,veg:true, img:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&q=80",desc:"Portobello mushroom with swiss cheese & aioli",  rating:4.6,badge:"New"},
    ],
    Wraps:[
      {id:401,name:"Chicken Wrap",       price:199,veg:false,img:"https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&q=80",desc:"Grilled chicken in a toasted tortilla wrap",     rating:4.3,badge:null},
      {id:402,name:"Falafel Wrap",       price:179,veg:true, img:"https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=300&q=80",desc:"Crispy falafel with hummus and fresh veggies",    rating:4.5,badge:"Veg Fav"},
    ],
    Drinks:[
      {id:602,name:"Cold Coffee",        price:99, veg:true, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80",desc:"Creamy blended iced coffee with chocolate",       rating:4.5,badge:null},
      {id:604,name:"Virgin Mojito",      price:119,veg:true, img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80",desc:"Mint-lemon fizz with crushed ice & lime",           rating:4.7,badge:null},
    ],
  },
  3: { // Pasta Palace
    Pizza:[
      {id:501,name:"Margherita",         price:299,veg:true, img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80",desc:"Classic tomato, mozzarella and fresh basil",      rating:4.7,badge:"Classic"},
      {id:502,name:"Pepperoni",          price:349,veg:false,img:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80",desc:"Generous pepperoni with extra cheese layer",       rating:4.8,badge:"Bestseller"},
      {id:503,name:"BBQ Chicken",        price:379,veg:false,img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",desc:"Smoky BBQ sauce, chicken, onions & peppers",      rating:4.6,badge:null},
    ],
    Pasta:[
      {id:504,name:"Spaghetti Arrabbiata",price:279,veg:true,img:"https://images.unsplash.com/photo-1551183053-bf91798d792b?w=300&q=80",desc:"Spicy tomato pasta with garlic and olive oil",     rating:4.5,badge:null},
      {id:505,name:"Fettuccine Alfredo", price:319,veg:true, img:"https://images.unsplash.com/photo-1612007688814-9b19b4b3c5e3?w=300&q=80",desc:"Rich creamy sauce with parmesan",                  rating:4.6,badge:"Chef's Pick"},
    ],
    Desserts:[
      {id:506,name:"Tiramisu",           price:199,veg:true, img:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=80",desc:"Classic Italian espresso-soaked dessert",          rating:4.9,badge:"Must Try"},
    ],
  },
  4: { // Dragon Wok
    Noodles:[
      {id:701,name:"Pad Thai",           price:229,veg:false,img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&q=80",desc:"Stir-fried rice noodles with peanuts & lime",     rating:4.5,badge:"Popular"},
      {id:702,name:"Hakka Noodles",      price:189,veg:true, img:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&q=80",desc:"Wok-tossed noodles with crispy veggies",           rating:4.3,badge:null},
      {id:703,name:"Ramen Bowl",         price:279,veg:false,img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80",desc:"Rich broth with noodles, egg and toppings",        rating:4.7,badge:"Chef's Fav"},
    ],
    Rolls:[
      {id:801,name:"Egg Roll",           price:99, veg:false,img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80",desc:"Crispy spring roll filled with egg and veg",         rating:4.2,badge:null},
      {id:802,name:"Chicken Roll",       price:149,veg:false,img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80",desc:"Juicy chicken wrapped in thin egg crepe",           rating:4.4,badge:"Bestseller"},
    ],
  },
  5: { // Pizza Volcano
    Pizza:[
      {id:901,name:"Margherita Volcano", price:349,veg:true, img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80",desc:"Extra stretchy cheese pull, volcano-style crust", rating:4.7,badge:"Signature"},
      {id:902,name:"BBQ Overload",       price:399,veg:false,img:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80",desc:"Double meat, triple cheese BBQ explosion",          rating:4.8,badge:"Bestseller"},
      {id:903,name:"Garden Fresh",       price:319,veg:true, img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",desc:"Farm-fresh veggies on herb-infused tomato base",   rating:4.5,badge:null},
    ],
    Sides:[
      {id:904,name:"Garlic Knots (6)",   price:129,veg:true, img:"https://images.unsplash.com/photo-1573821663912-569905455b1c?w=300&q=80",desc:"Buttery, garlicky knotted bread rolls",             rating:4.6,badge:"Fan Fav"},
    ],
  },
  6: { // Sushi Bay
    Sushi:[
      {id:1001,name:"Salmon Roll (8 pcs)",price:449,veg:false,img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80",desc:"Fresh Atlantic salmon with avocado & cucumber",   rating:4.9,badge:"Top Rated"},
      {id:1002,name:"Dragon Roll",        price:499,veg:false,img:"https://images.unsplash.com/photo-1617196034876-91f29e3f79ea?w=300&q=80",desc:"Shrimp tempura topped with avocado slices",        rating:4.8,badge:"Chef's Pick"},
      {id:1003,name:"Veggie Maki",        price:299,veg:true, img:"https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&q=80",desc:"Cucumber, avocado and pickled radish rolls",        rating:4.5,badge:null},
    ],
    Sashimi:[
      {id:1004,name:"Sashimi Platter",    price:599,veg:false,img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&q=80",desc:"8 pcs of chef's finest daily cuts",                   rating:4.9,badge:"Premium"},
    ],
    Drinks:[
      {id:1005,name:"Matcha Latte",       price:149,veg:true, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",desc:"Ceremonial grade matcha with oat milk",              rating:4.7,badge:"New"},
    ],
  },
  7: { // Dosa Junction
    Dosas:[
      {id:1101,name:"Masala Dosa",        price:99, veg:true, img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&q=80",desc:"Crispy crepe with spiced potato filling",            rating:4.7,badge:"Classic"},
      {id:1102,name:"Ghee Roast Dosa",    price:129,veg:true, img:"https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=300&q=80",desc:"Golden crisp dosa roasted in pure ghee",             rating:4.6,badge:"Bestseller"},
    ],
    Snacks:[
      {id:1103,name:"Vada Sambar",        price:79, veg:true, img:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&q=80",desc:"Crispy lentil donuts in tangy sambar",               rating:4.5,badge:null},
      {id:1104,name:"Idli Plate (4 pcs)", price:69, veg:true, img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&q=80",desc:"Soft steamed rice cakes with chutneys",              rating:4.4,badge:null},
    ],
    Drinks:[
      {id:1105,name:"Filter Coffee",      price:39, veg:true, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80",desc:"Authentic South Indian decoction coffee",            rating:4.8,badge:"Must Try"},
    ],
  },
  8: { // Sweet Tooth
    Desserts:[
      {id:1201,name:"Gulab Jamun",        price:119,veg:true, img:"https://images.unsplash.com/photo-1666010149492-9bf18bfb8b13?w=300&q=80",desc:"Soft dumplings in rose sugar syrup",                 rating:4.9,badge:"Fan Fav"},
      {id:1202,name:"Choc Lava Cake",     price:199,veg:true, img:"https://images.unsplash.com/photo-1617305855058-336d24456869?w=300&q=80",desc:"Warm cake with molten dark chocolate centre",         rating:4.8,badge:"Must Try"},
      {id:1203,name:"Kulfi Falooda",      price:149,veg:true, img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80",desc:"Pistachio ice cream with basil seeds & rose syrup",    rating:4.7,badge:null},
      {id:1204,name:"Brownie Sundae",     price:169,veg:true, img:"https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=300&q=80",desc:"Warm fudge brownie with vanilla ice cream",           rating:4.9,badge:"Bestseller"},
    ],
    Drinks:[
      {id:1205,name:"Cold Coffee Shake",  price:129,veg:true, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80",desc:"Thick blended coffee milkshake",                     rating:4.6,badge:null},
      {id:1206,name:"Mango Milkshake",    price:109,veg:true, img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80",desc:"Fresh Alphonso mango blended thick",                   rating:4.7,badge:"Seasonal"},
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
  {label:"Tacos",   emoji:"🌮", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80"},
  {label:"Seafood", emoji:"🦞", img:"https://images.unsplash.com/photo-1565380850788-f2897be34d21?w=300&q=80"},
  {label:"Rolls",   emoji:"🥡", img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80"},
];

// Map categories to restaurant IDs
const CATEGORY_RESTAURANTS = {
  Pizza:   [3,5],
  Burger:  [2],
  Biryani: [1],
  Sushi:   [6],
  Desserts:[8],
  Coffee:  [7,8],
  Salads:  [3],
  Noodles: [4],
  Wraps:   [2,4],
  Tacos:   [7],
  Seafood: [4,6],
  Rolls:   [4],
};

// Dish → restaurants that serve it (for recommendation system)
const DISH_RESTAURANTS = {
  "Butter Chicken":    [1],
  "Dal Makhani":       [1],
  "Paneer Tikka":      [1],
  "Chicken Kebab":     [1],
  "Veg Biryani":       [1],
  "Chicken Biryani":   [1],
  "Classic Beef Burger":[2],
  "Chicken Crispy":    [2],
  "Mushroom Swiss":    [2],
  "Chicken Wrap":      [2,4],
  "Falafel Wrap":      [2],
  "Margherita":        [3,5],
  "Pepperoni":         [3,5],
  "BBQ Chicken":       [3,5],
  "Spaghetti Arrabbiata":[3],
  "Fettuccine Alfredo":[3],
  "Tiramisu":          [3,8],
  "Pad Thai":          [4],
  "Hakka Noodles":     [4],
  "Ramen Bowl":        [4,6],
  "Egg Roll":          [4],
  "Chicken Roll":      [4,2],
  "Margherita Volcano":[5],
  "BBQ Overload":      [5],
  "Garden Fresh":      [5],
  "Garlic Knots (6)":  [5],
  "Salmon Roll (8 pcs)":[6],
  "Dragon Roll":       [6],
  "Veggie Maki":       [6],
  "Sashimi Platter":   [6],
  "Masala Dosa":       [7],
  "Ghee Roast Dosa":   [7],
  "Vada Sambar":       [7],
  "Idli Plate (4 pcs)":[7],
  "Gulab Jamun":       [8],
  "Choc Lava Cake":    [8],
  "Kulfi Falooda":     [8],
  "Brownie Sundae":    [8],
  "Mango Lassi":       [1,7],
  "Cold Coffee":       [2,7,8],
  "Masala Chai":       [1,7],
  "Filter Coffee":     [7],
  "Matcha Latte":      [6],
  "Virgin Mojito":     [2],
};

const TRENDING = [
  {id:'t1',name:"Butter Chicken",rest:"Spice Garden",restId:1,rating:4.9,reviews:"2.4k",price:319,img:"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=85",tag:"🔥 Trending",veg:false},
  {id:'t2',name:"Dragon Sushi Platter",rest:"Sushi Bay",restId:6,rating:4.8,reviews:"1.8k",price:599,img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=85",tag:"⭐ Top Rated",veg:false},
  {id:'t3',name:"Gulab Jamun Sundae",rest:"Sweet Tooth",restId:8,rating:4.9,reviews:"3.1k",price:189,img:"https://images.unsplash.com/photo-1666010149492-9bf18bfb8b13?w=400&q=85",tag:"💛 Fan Fav",veg:true},
  {id:'t4',name:"Margherita Volcano",rest:"Pizza Volcano",restId:5,rating:4.7,reviews:"1.2k",price:349,img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=85",tag:"🆕 New",veg:true},
  {id:'t5',name:"Chicken Dum Biryani",rest:"Spice Garden",restId:1,rating:4.8,reviews:"4.7k",price:299,img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=85",tag:"🔥 Trending",veg:false},
  {id:'t6',name:"Mango Lassi",rest:"Dosa Junction",restId:7,rating:4.7,reviews:"3.1k",price:89,img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=85",tag:"☀️ Summer Hit",veg:true},
];

const CHEFS = [
  {name:"Chef Aryan Kapoor",specialty:"North Indian & Mughlai",exp:"18 yrs experience",bio:"Former head chef at The Leela Palace, Aryan brings royal Mughlai secrets into every dish — roasted slow over wood-fired tandoors.",img:"https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400&q=80",emoji:"🌿"},
  {name:"Chef Meera Nair",specialty:"South Indian & Coastal",exp:"14 yrs experience",bio:"Born in Kerala's spice coast, Meera crafts dishes that tell stories of monsoon forests and sun-drenched backwaters with every bite.",img:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",emoji:"🌊"},
  {name:"Chef Ravi Shetty",specialty:"Fusion & Desserts",exp:"11 yrs experience",bio:"A Mumbai-trained pastry wizard, Ravi blends East and West — foraging seasonal flavors to create dessert experiences unlike any other.",img:"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80",emoji:"🍃"},
];

const FAQS = [
  {q:"How long does delivery take?",a:"Standard delivery takes 25–45 minutes depending on your location and restaurant. You can track your order live from the moment it's placed."},
  {q:"What is the minimum order amount?",a:"There's no platform-wide minimum. Individual restaurants may set their own — usually between ₹99–₹199. This is shown clearly before checkout."},
  {q:"Can I cancel or modify my order?",a:"Orders can be cancelled within 2 minutes of placing. After that, please contact our support. Modifications depend on restaurant confirmation."},
  {q:"Are there vegetarian-only restaurants?",a:"Yes! Use the 'Pure Veg' filter in Explore. Many restaurants on Terra Eats are certified vegetarian or offer clearly marked veg menus."},
  {q:"Do you deliver at night?",a:"Most restaurants deliver until 11 PM. Some partner restaurants offer late-night delivery until 1 AM — look for the 🌙 badge."},
  {q:"How are refunds processed?",a:"Refunds are credited to your original payment method within 5–7 business days, or instantly to your Terra wallet."},
];

const OFFERS = [
  {code:"TERRA30",title:"Weekend Feast",desc:"30% off on orders above ₹500",saving:"Save up to ₹180",expires:"Valid this weekend",color:T.sage},
  {code:"FIRST100",title:"Welcome Gift",desc:"₹100 off on your very first order",saving:"Save ₹100",expires:"New users only",color:T.earth},
  {code:"FREEDEL",title:"Free Delivery",desc:"Zero delivery charges on any order",saving:"Save ₹29",expires:"This week",color:T.moss},
  {code:"NIGHT20",title:"Night Owl",desc:"20% off on orders after 9 PM",saving:"Save up to ₹120",expires:"Daily 9PM–1AM",color:T.dusk},
];

const TRACK_STEPS = [
  {label:"Order Placed",    icon:"📋",desc:"Confirmed & being processed"},
  {label:"Preparing",       icon:"👨‍🍳",desc:"Chef is crafting your meal"},
  {label:"Out for Delivery",icon:"🛵",desc:"Rider heading your way"},
  {label:"Delivered",       icon:"🎉",desc:"Enjoy your meal!"},
];

const ROUTE_POINTS = [
  {x:12,y:75}, {x:22,y:68}, {x:30,y:58}, {x:38,y:52},
  {x:48,y:47}, {x:56,y:40}, {x:64,y:35}, {x:72,y:28},
  {x:80,y:22}, {x:88,y:18},
];

/* ─── DEFAULT CART ITEMS ─────────────────────────────────────── */
const DEFAULT_CART = [];

/* ─── AUTH CONTEXT ─────────────────────────────────────────── */
const AuthContext = createContext(null);
function useAuth() { return useContext(AuthContext); }

/* ─── ADDRESS MODAL ─────────────────────────────────────────── */
function AddressModal({ onSave, onClose }) {
  const [addr, setAddr] = useState({ line1:'', city:'', pincode:'' });
  const [err, setErr] = useState('');
  const submit = () => {
    if (!addr.line1.trim() || !addr.city.trim() || !addr.pincode.trim()) {
      setErr('Please fill all fields'); return;
    }
    if (!/^\d{6}$/.test(addr.pincode.trim())) {
      setErr('Enter valid 6-digit pincode'); return;
    }
    onSave(addr);
  };
  return (
    <div className="addr-modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="addr-modal">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:26, fontWeight:700, color:T.forest }}>📍 Add Delivery Address</h2>
            <p style={{ color:T.moss, fontSize:13, marginTop:4 }}>We need your address to deliver your order</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:T.moss, lineHeight:1 }}>×</button>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>Street / Flat / Building</label>
          <input className="field" placeholder="123 MG Road, Apt 4B" value={addr.line1} onChange={e=>{ setAddr(x=>({...x,line1:e.target.value})); setErr(''); }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>City</label>
            <input className="field" placeholder="Mysuru" value={addr.city} onChange={e=>{ setAddr(x=>({...x,city:e.target.value})); setErr(''); }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>Pincode</label>
            <input className="field" placeholder="570001" value={addr.pincode} onChange={e=>{ setAddr(x=>({...x,pincode:e.target.value})); setErr(''); }} maxLength={6} />
          </div>
        </div>
        {err && <p style={{ color:'#E53E3E', fontSize:12, fontWeight:600, marginBottom:12 }}>⚠ {err}</p>}
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn-nature" style={{ flex:1, padding:'14px' }} onClick={submit}>Save Address →</button>
          <button className="btn-outline" style={{ padding:'14px 20px' }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── CSS ───────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: ${T.cream};
  color: ${T.forest};
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  line-height: 1.6;
}
img { display: block; max-width: 100%; }
button, input, textarea, select { font-family: inherit; }
::selection { background: ${T.sage}; color: white; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: ${T.moss}; border-radius: 4px; }

.serif { font-family: 'Cormorant Garamond', serif; }
.page { padding-top: 70px; min-height: 100vh; }
.section { padding: 80px 0; }
.container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 28px; }
.section-head { margin-bottom: 48px; }
.section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.sage}; display: block; margin-bottom: 10px; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px,4vw,48px); font-weight: 700; color: ${T.forest}; line-height: 1.1; margin-bottom: 10px; }
.section-sub { color: ${T.moss}; font-size: 15px; font-weight: 300; }

/* ─── NAVBAR ─── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 500;
  height: 70px;
  background: rgba(247,243,236,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(107,158,122,0.18);
  display: flex; align-items: center;
  transition: transform 0.38s cubic-bezier(0.4,0,0.2,1), background 0.3s, box-shadow 0.3s, opacity 0.3s;
  animation: navSlideDown 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes navSlideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.navbar.scrolled {
  background: rgba(247,243,236,0.98);
  box-shadow: 0 4px 30px ${T.shadow};
}
.navbar.nav-hidden {
  transform: translateY(-100%);
}
.navbar.nav-visible {
  transform: translateY(0);
}
.nav-inner {
  width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}
.nav-logo {
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px; font-weight: 700; color: ${T.forest};
  letter-spacing: -0.02em;
  transition: opacity 0.2s;
}
.nav-logo:hover { opacity: 0.8; }
.logo-leaf {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, ${T.leaf}, ${T.moss});
  border-radius: 50% 50% 50% 10%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(45,90,61,0.3);
  animation: leafPulse 3s ease-in-out infinite;
}
@keyframes leafPulse {
  0%,100% { transform: scale(1) rotate(-3deg); }
  50% { transform: scale(1.06) rotate(3deg); }
}
.nav-links { display: none; gap: 2px; }
.nav-link {
  background: none; border: none; cursor: pointer;
  color: ${T.sage}; font-size: 13px; font-weight: 600;
  padding: 8px 14px; border-radius: 8px;
  transition: color 0.2s, background 0.2s, transform 0.18s; position: relative; white-space: nowrap;
  letter-spacing: 0.01em;
}
.nav-link::after {
  content: ''; position: absolute; bottom: 3px; left: 14px; right: 14px;
  height: 2px; background: linear-gradient(90deg, ${T.sage}, ${T.leaf}); border-radius: 1px;
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
}
.nav-link:hover { color: ${T.forest}; background: rgba(107,158,122,0.1); transform: translateY(-1px); }
.nav-link.active { color: ${T.forest}; }
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
.nav-actions { display: flex; align-items: center; gap: 10px; }
.nav-cart {
  position: relative; background: linear-gradient(135deg, ${T.forest}, ${T.leaf}); color: ${T.cream};
  border: none; cursor: pointer; border-radius: 10px;
  padding: 9px 18px; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; gap: 7px;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 4px 14px rgba(45,90,61,0.3);
  letter-spacing: 0.02em;
}
.nav-cart:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 22px rgba(45,90,61,0.4); }
.nav-btn-sm {
  background: none; border: 1.5px solid rgba(107,158,122,0.35); color: ${T.sage};
  border-radius: 8px; padding: 8px 16px; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.22s; white-space: nowrap; letter-spacing: 0.03em;
}
.nav-btn-sm:hover { border-color: ${T.leaf}; color: ${T.forest}; background: rgba(107,158,122,0.1); transform: translateY(-1px); }
.cart-badge {
  position: absolute; top: -6px; right: -6px;
  background: ${T.sunset}; color: white;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
}

/* ─── MOBILE NAV ─── */
.mob-nav {
  display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 500;
  background: rgba(247,243,236,0.97);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(107,158,122,0.2);
  padding: 8px 0 20px; justify-content: space-around;
}
.mob-btn {
  background: none; border: none; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 5px 12px; color: ${T.moss}; font-size: 9px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  transition: color 0.2s;
}
.mob-btn.active { color: ${T.forest}; }

/* ─── VIDEO HERO ─── */
.video-hero {
  position: relative; width: 100%; height: 100vh; min-height: 600px;
  overflow: hidden; display: flex; align-items: center;
}
.video-container { position: absolute; inset: 0; z-index: 0; }
.video-container iframe {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 177.78vh; height: 100vh;
  min-width: 100vw; min-height: 56.25vw;
  border: none; pointer-events: none;
}
.video-fallback {
  position: absolute; inset: 0;
  background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85');
  background-size: cover; background-position: center;
}
.video-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to right, rgba(26,58,42,0.82) 0%, rgba(26,58,42,0.55) 50%, rgba(26,58,42,0.25) 100%);
}
.video-hero-content { position: relative; z-index: 2; width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 28px; }
.hero-h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px,6vw,88px); font-weight: 700; line-height: 1.05; color: white; margin-bottom: 20px; text-shadow: 0 2px 20px rgba(0,0,0,0.3); }
.hero-h1 em { font-style: italic; color: ${T.fern}; }
.hero-sub { color: rgba(200,223,197,0.9); font-size: clamp(14px,1.6vw,18px); font-weight: 300; margin-bottom: 36px; max-width: 520px; line-height: 1.7; }
.hero-search { display: flex; align-items: center; background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.25); max-width: 540px; margin-bottom: 24px; }
.hero-search input { flex: 1; border: none; outline: none; padding: 16px 20px; font-size: 14px; color: ${T.forest}; background: transparent; }
.hero-search-btn { background: ${T.sunset}; color: white; border: none; cursor: pointer; padding: 16px 24px; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; transition: background 0.2s; white-space: nowrap; }
.hero-search-btn:hover { background: ${T.dusk}; }
.hero-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px; }
.hero-pill { background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 20px; padding: 7px 16px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.hero-pill:hover { background: rgba(255,255,255,0.22); }
.hero-stat-bar { display: flex; gap: 32px; }
.hero-stat { text-align: left; }
.hero-stat-n { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: white; line-height: 1; }
.hero-stat-l { font-size: 11px; color: rgba(200,223,197,0.7); font-weight: 400; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }

/* ─── CATEGORY CAROUSEL ─── */
.cat-carousel-wrap { position: relative; overflow: hidden; margin: 0 -28px; padding: 0 28px; user-select: none; }
.cat-carousel-track { display: flex; gap: 14px; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); will-change: transform; }
.cat-carousel-track.dragging { transition: none; cursor: grabbing; }
.cat-item { flex-shrink: 0; width: 110px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: transform 0.25s; }
.cat-item:hover { transform: translateY(-4px); }
.cat-img-ring { width: 88px; height: 88px; border-radius: 50%; overflow: hidden; border: 2.5px solid transparent; background: linear-gradient(white,white) padding-box, linear-gradient(135deg, ${T.moss}, ${T.fern}) border-box; box-shadow: 0 4px 18px ${T.shadow}; transition: all 0.3s; }
.cat-item:hover .cat-img-ring { background: linear-gradient(white,white) padding-box, linear-gradient(135deg, ${T.sage}, ${T.leaf}) border-box; box-shadow: 0 8px 28px ${T.shadowD}; }
.cat-item.active .cat-img-ring { background: linear-gradient(white,white) padding-box, linear-gradient(135deg, ${T.sunset}, ${T.dusk}) border-box; }
.cat-img-ring img { width: 100%; height: 100%; object-fit: cover; }
.cat-label { font-size: 12px; font-weight: 600; color: ${T.forest}; text-align: center; }
.cat-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 38px; height: 38px; border-radius: 50%; background: white; border: 1px solid rgba(107,158,122,0.2); color: ${T.forest}; font-size: 16px; cursor: pointer; z-index: 10; box-shadow: 0 4px 16px ${T.shadow}; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.cat-carousel-btn:hover { background: ${T.forest}; color: white; }
.cat-carousel-btn.prev { left: 6px; }
.cat-carousel-btn.next { right: 6px; }

/* ─── TRENDING ─── */
.trending-scroll { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.trending-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); cursor: pointer; position: relative; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
.trending-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 24px 60px ${T.shadowD}; border-color: ${T.fern}; }
.trending-img { position: relative; height: 200px; overflow: hidden; }
.trending-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.trending-card:hover .trending-img img { transform: scale(1.08); }
.trending-tag { position: absolute; top: 12px; left: 12px; background: rgba(26,58,42,0.85); backdrop-filter: blur(8px); color: white; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.04em; }
.trending-veg { position: absolute; top: 12px; right: 12px; width: 22px; height: 22px; border-radius: 4px; border: 2px solid; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; background: white; }
.trending-body { padding: 18px 20px 14px; }
.trending-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: ${T.forest}; margin-bottom: 2px; }
.trending-rest { font-size: 11px; color: ${T.moss}; margin-bottom: 12px; cursor: pointer; transition: color 0.2s; }
.trending-rest:hover { color: ${T.sage}; text-decoration: underline; }
.trending-meta { display: flex; align-items: center; justify-content: space-between; }
.trending-price { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: ${T.leaf}; }
.trending-rating { display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${T.moss}; }
.trending-stars { color: ${T.amber}; font-size: 12px; }
.trending-add-btn { flex: 1; background: linear-gradient(135deg, ${T.sage}, ${T.leaf}); color: white; border: none; cursor: pointer; padding: 11px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; border-radius: 10px; transition: all 0.25s; }
.trending-add-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

/* ─── RESTAURANT CARDS ─── */
.rest-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
.rest-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 20px ${T.shadow}; cursor: pointer; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); border: 1px solid rgba(107,158,122,0.1); }
.rest-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px ${T.shadowD}; border-color: ${T.fern}; }
.rest-img { position: relative; height: 180px; overflow: hidden; }
.rest-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.rest-card:hover .rest-img img { transform: scale(1.07); }
.rest-badge { position: absolute; top: 12px; left: 12px; background: ${T.forest}; color: white; font-size: 9px; font-weight: 700; padding: 4px 9px; border-radius: 6px; letter-spacing: 0.06em; text-transform: uppercase; }
.rest-discount { position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, ${T.sunset}, ${T.dusk}); color: white; font-size: 9px; font-weight: 700; padding: 4px 9px; border-radius: 6px; letter-spacing: 0.05em; }
.rest-body { padding: 16px 18px 18px; }
.rest-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 700; color: ${T.forest}; margin-bottom: 2px; }
.rest-cuisine { font-size: 12px; color: ${T.moss}; margin-bottom: 12px; }
.rest-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; }
.star { color: ${T.amber}; font-size: 12px; }
.rating { font-weight: 700; color: ${T.forest}; }
.rest-time { color: ${T.moss}; }
.rest-price { color: ${T.earth}; font-weight: 600; margin-left: auto; }

/* ─── RESTAURANT MENU PAGE ─── */
.menu-hero { background: linear-gradient(135deg, ${T.forest} 0%, ${T.leaf} 100%); padding: 60px 0 56px; position: relative; overflow: hidden; }
.menu-hero-back { background: none; border: 1px solid rgba(200,223,197,0.3); color: ${T.mist}; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 20px; transition: all 0.2s; }
.menu-hero-back:hover { background: rgba(255,255,255,0.1); color: white; }
.menu-hero-info { display: flex; align-items: flex-start; gap: 24px; }
.menu-hero-img { width: 100px; height: 100px; border-radius: 16px; overflow: hidden; border: 3px solid rgba(200,223,197,0.3); flex-shrink: 0; }
.menu-hero-img img { width: 100%; height: 100%; object-fit: cover; }
.menu-cat-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-top: 28px; scrollbar-width: none; }
.menu-cat-tabs::-webkit-scrollbar { display: none; }
.menu-cat-tab { background: rgba(255,255,255,0.1); border: 1px solid rgba(200,223,197,0.2); color: rgba(200,223,197,0.8); border-radius: 20px; padding: 8px 18px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.menu-cat-tab.active { background: white; color: ${T.forest}; border-color: white; }
.menu-cat-tab:hover:not(.active) { background: rgba(255,255,255,0.18); color: white; }
.menu-items-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; margin-top: 0; }
.menu-item-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); display: flex; gap: 0; }
.menu-item-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px ${T.shadowD}; border-color: ${T.fern}; }
.menu-item-img { width: 130px; min-width: 130px; height: 130px; overflow: hidden; position: relative; flex-shrink: 0; }
.menu-item-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.menu-item-card:hover .menu-item-img img { transform: scale(1.08); }
.menu-item-body { padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.menu-item-top { flex: 1; }
.menu-item-name { font-weight: 700; font-size: 15px; color: ${T.forest}; margin-bottom: 4px; }
.menu-item-desc { font-size: 12px; color: ${T.moss}; font-weight: 300; line-height: 1.5; margin-bottom: 8px; }
.menu-item-bottom { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.menu-item-price { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: ${T.leaf}; }
.menu-item-badge { font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 5px; background: ${T.forest}; color: white; letter-spacing: 0.05em; white-space: nowrap; }
.menu-add-btn { background: ${T.forest}; color: white; border: none; cursor: pointer; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 700; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 4px; }
.menu-add-btn:hover { background: ${T.leaf}; transform: scale(1.05); }
.menu-qty-ctrl { display: flex; align-items: center; gap: 2px; }
.menu-qty-btn { width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid ${T.fern}; background: none; color: ${T.forest}; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.menu-qty-btn:hover { background: ${T.forest}; color: white; border-color: ${T.forest}; }
.menu-qty-num { font-weight: 700; font-size: 14px; min-width: 24px; text-align: center; color: ${T.forest}; }

/* ─── DISH SUGGESTIONS ─── */
.dish-suggestions { margin-top: 40px; }
.dish-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 20px; }
.dish-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px ${T.shadow}; transition: all 0.3s; cursor: pointer; border: 1px solid rgba(107,158,122,0.12); }
.dish-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px ${T.shadowD}; border-color: ${T.fern}; }
.dish-card img { width: 100%; height: 160px; object-fit: cover; }
.dish-card-body { padding: 16px; }
.dish-card-name { font-weight: 600; font-size: 15px; color: ${T.forest}; }
.dish-card-price { color: ${T.sage}; font-weight: 700; font-size: 15px; margin-top: 6px; }
.dish-card-add { margin-top: 12px; width: 100%; padding: 9px; background: ${T.forest}; color: white; border: none; cursor: pointer; border-radius: 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.2s; }
.dish-card-add:hover { background: ${T.leaf}; }

/* ─── NATURE DIVIDER ─── */
.nature-divider { background: linear-gradient(180deg, ${T.cream} 0%, ${T.sand} 100%); padding: 60px 0; border-top: 1px solid rgba(107,158,122,0.15); border-bottom: 1px solid rgba(107,158,122,0.15); position: relative; overflow: hidden; }
.nd-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 5 C30 25 20 45 50 65 C80 45 70 25 50 5Z' fill='%231A3A2A'/%3E%3C/svg%3E"); background-size: 60px 60px; }

/* ─── ABOUT ─── */
.chefs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; margin-top: 48px; }
.chef-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); transition: all 0.35s cubic-bezier(0.4,0,0.2,1); position: relative; }
.chef-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px ${T.shadowD}; }
.chef-img { position: relative; height: 300px; overflow: hidden; }
.chef-img img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform 0.5s; }
.chef-card:hover .chef-img img { transform: scale(1.06); }
.chef-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,58,42,0.7) 0%, transparent 50%); }
.chef-emoji { position: absolute; bottom: 16px; right: 16px; font-size: 28px; }
.chef-body { padding: 22px 24px 26px; }
.chef-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: ${T.forest}; }
.chef-spec { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.sage}; margin: 6px 0 10px; }
.chef-exp { font-size: 11px; color: ${T.moss}; margin-bottom: 12px; }
.chef-bio { font-size: 13px; color: ${T.earth}; line-height: 1.7; font-weight: 300; }
.story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.story-img { border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px ${T.shadowD}; position: relative; }
.story-img img { width: 100%; height: 500px; object-fit: cover; }
.story-img-leaf { position: absolute; bottom: -20px; right: -20px; width: 120px; height: 120px; background: linear-gradient(135deg, ${T.sage}, ${T.moss}); border-radius: 50% 50% 50% 10%; display: flex; align-items: center; justify-content: center; font-size: 48px; box-shadow: 0 10px 30px rgba(45,90,61,0.3); }

/* ─── FAQ ─── */
.faq-item { background: white; border-radius: 14px; overflow: hidden; border: 1px solid rgba(107,158,122,0.15); margin-bottom: 10px; transition: border-color 0.3s, box-shadow 0.3s, background 0.3s; position: relative; }
.faq-item.hovered { border-color: ${T.fern}; box-shadow: 0 6px 28px ${T.shadow}; }
.faq-highlight-bar { position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, ${T.sage}, ${T.moss}); transform: scaleY(0); transform-origin: top; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); border-radius: 0 0 0 0; }
.faq-item.hovered .faq-highlight-bar { transform: scaleY(1); }
.faq-q { width: 100%; background: none; border: none; cursor: pointer; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; text-align: left; }
.faq-q span:first-child { font-size: 14px; font-weight: 600; color: ${T.forest}; line-height: 1.4; }
.faq-icon { font-size: 20px; color: ${T.moss}; transition: transform 0.3s, color 0.3s; flex-shrink: 0; font-weight: 300; }
.faq-icon.open { transform: rotate(45deg); color: ${T.sage}; }
.faq-ans { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
.faq-ans.open { max-height: 300px; }
.faq-ans p { padding: 0 20px 18px 20px; font-size: 13.5px; color: ${T.earth}; font-weight: 300; line-height: 1.75; }

/* ─── BUTTONS ─── */
.btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: ${T.forest}; color: white; border: none; cursor: pointer; padding: 14px 30px; border-radius: 12px; font-size: 14px; font-weight: 600; transition: all 0.25s; box-shadow: 0 4px 20px ${T.shadow}; }
.btn-primary:hover { background: ${T.leaf}; transform: translateY(-2px); box-shadow: 0 8px 28px ${T.shadowD}; }
.btn-nature { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, ${T.sage}, ${T.leaf}); color: white; border: none; cursor: pointer; padding: 14px 30px; border-radius: 12px; font-size: 14px; font-weight: 600; transition: all 0.25s; box-shadow: 0 4px 20px rgba(74,124,89,0.3); }
.btn-nature:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(74,124,89,0.4); filter: brightness(1.06); }
.btn-outline { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: transparent; color: ${T.sage}; cursor: pointer; padding: 13px 28px; border-radius: 12px; font-size: 14px; font-weight: 600; border: 1.5px solid rgba(107,158,122,0.4); transition: all 0.25s; }
.btn-outline:hover { border-color: ${T.sage}; background: rgba(107,158,122,0.08); color: ${T.forest}; }

/* ─── FIELD ─── */
.field { width: 100%; background: ${T.sand}; border: 1.5px solid rgba(107,158,122,0.2); color: ${T.forest}; padding: 14px 18px; font-size: 14px; outline: none; transition: border-color 0.25s, box-shadow 0.25s; border-radius: 12px; }
.field:focus { border-color: ${T.sage}; box-shadow: 0 0 0 4px rgba(107,158,122,0.1); background: white; }
.field::placeholder { color: ${T.moss}; opacity: 0.7; font-size: 13px; }

/* ─── CART ─── */
.cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; }
.cart-item { display: flex; align-items: center; gap: 16px; background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 12px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); transition: all 0.2s; }
.cart-item:hover { box-shadow: 0 6px 24px ${T.shadowD}; }
.cart-item-img { width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
.cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
.qty-ctrl { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.qty-btn { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid ${T.fern}; background: none; color: ${T.forest}; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.qty-btn:hover { background: ${T.forest}; color: white; border-color: ${T.forest}; }
.qty-btn.fill { background: ${T.forest}; color: white; border-color: ${T.forest}; }
.cart-summary { background: white; border-radius: 18px; padding: 24px; box-shadow: 0 4px 20px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); }

/* ─── CHECKOUT ─── */
.checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; }
.checkout-section { background: white; border-radius: 18px; padding: 28px; box-shadow: 0 4px 20px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); margin-bottom: 20px; }
.checkout-section h3 { font-family: 'Cormorant Garamond',serif; font-size: 22px; font-weight: 700; color: ${T.forest}; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 11px; font-weight: 700; color: ${T.moss}; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 7px; }
.payment-option { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; border: 1.5px solid rgba(107,158,122,0.2); cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
.payment-option:hover { border-color: ${T.sage}; background: rgba(107,158,122,0.04); }
.payment-option.selected { border-color: ${T.sage}; background: rgba(107,158,122,0.08); }
.payment-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid ${T.fern}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.payment-option.selected .payment-radio { border-color: ${T.sage}; }
.payment-radio-dot { width: 9px; height: 9px; border-radius: 50%; background: ${T.sage}; transform: scale(0); transition: transform 0.2s; }
.payment-option.selected .payment-radio-dot { transform: scale(1); }
.order-success { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; padding: 24px; }

@media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }

/* ─── OFFERS ─── */
.offers-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
.offer-card { background: white; border-radius: 18px; padding: 28px; box-shadow: 0 4px 20px ${T.shadow}; border: 1px solid rgba(107,158,122,0.1); transition: all 0.3s; }
.offer-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px ${T.shadowD}; }
.offer-code { display: inline-block; background: ${T.sand}; border: 1.5px dashed rgba(107,158,122,0.4); border-radius: 8px; padding: 5px 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; color: ${T.forest}; margin-bottom: 14px; }
.offer-copy { display: block; margin-top: 16px; background: none; border: 1.5px solid rgba(107,158,122,0.3); color: ${T.sage}; border-radius: 8px; padding: 9px 18px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.offer-copy:hover { background: ${T.forest}; color: white; border-color: ${T.forest}; }

/* ─── TRACK ─── */
.track-steps { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; position: relative; gap: 4px; }
.track-steps::before { content: ''; position: absolute; top: 20px; left: 24px; right: 24px; height: 2px; background: rgba(107,158,122,0.15); z-index: 0; }
.track-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; z-index: 1; }
.track-icon { width: 44px; height: 44px; border-radius: 50%; background: white; border: 2px solid rgba(107,158,122,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.4s; box-shadow: 0 2px 12px ${T.shadow}; }
.track-step.done .track-icon { background: ${T.sage}; border-color: ${T.sage}; box-shadow: 0 4px 16px rgba(74,124,89,0.3); }
.track-step.current .track-icon { background: white; border-color: ${T.sunset}; box-shadow: 0 0 0 4px rgba(232,116,42,0.15); animation: trackPulse 1.5s ease-in-out infinite; }
@keyframes trackPulse { 0%,100%{box-shadow:0 0 0 4px rgba(232,116,42,0.15);} 50%{box-shadow:0 0 0 8px rgba(232,116,42,0.08);} }
.track-label { font-size: 10px; font-weight: 600; color: ${T.moss}; text-align: center; text-transform: uppercase; letter-spacing: 0.06em; }
.track-step.done .track-label { color: ${T.forest}; }
.track-live-map { border-radius: 20px; overflow: hidden; border: 1px solid rgba(107,158,122,0.15); margin-bottom: 24px; position: relative; box-shadow: 0 8px 32px ${T.shadow}; }
.track-map-svg { width: 100%; height: 260px; display: block; }

/* ─── COMPACT FOOTER ─── */
.footer { background: ${T.forest}; color: rgba(200,223,197,0.8); padding: 60px 0 40px; position: relative; }
.footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.footer-col { display: flex; flex-direction: column; }
.footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: white; margin-bottom: 16px; }
.footer-contact { font-size: 13px; font-weight: 400; color: rgba(200,223,197,0.8); line-height: 1.6; margin-bottom: 20px; }
.footer-contact div { margin-bottom: 4px; }
.footer-title { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.fern}; margin-bottom: 16px; }
.footer-links { display: flex; flex-direction: column; gap: 8px; }
.footer-link { font-size: 13px; font-weight: 400; color: rgba(200,223,197,0.7); cursor: pointer; transition: all 0.2s ease; padding: 2px 0; }
.footer-link:hover { color: white; transform: translateX(2px); }
.footer-socials { display: flex; gap: 12px; margin-top: 8px; }
.footer-social-link { font-size: 16px; color: rgba(200,223,197,0.6); transition: all 0.2s ease; padding: 8px; border-radius: 6px; text-decoration: none; }
.footer-social-link:hover { color: white; background: rgba(200,223,197,0.1); transform: translateY(-1px); }
.footer-eco { background: rgba(200,223,197,0.05); border: 1px solid rgba(200,223,197,0.1); border-radius: 10px; padding: 16px; margin-top: 20px; }
.footer-eco-title { font-size: 11px; font-weight: 700; color: ${T.fern}; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }
.footer-eco p { font-size: 12px; font-weight: 400; line-height: 1.5; color: rgba(200,223,197,0.8); margin: 0; }
.footer-bar { border-top: 1px solid rgba(200,223,197,0.15); padding: 20px 0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 400; color: rgba(200,223,197,0.6); }

/* ─── TOAST ─── */
.toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: ${T.forest}; color: white; padding: 12px 24px; border-radius: 30px; font-size: 13px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 30px ${T.shadowD}; animation: toastIn 0.3s cubic-bezier(0.4,0,0.2,1) both; white-space: nowrap; }
@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

/* ─── CHIPS ─── */
.chip { background: white; border: 1.5px solid rgba(107,158,122,0.2); color: ${T.sage}; border-radius: 20px; padding: 8px 16px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.chip:hover, .chip.active { border-color: ${T.sage}; background: rgba(107,158,122,0.1); color: ${T.forest}; }

/* ─── EXPLORE HERO ─── */
.explore-hero { background: linear-gradient(135deg, ${T.sand} 0%, ${T.cream} 100%); padding: 56px 0 48px; border-bottom: 1px solid rgba(107,158,122,0.1); }

/* ─── LOGIN ─── */
.login-page { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
.login-art { background: linear-gradient(160deg, ${T.forest} 0%, ${T.leaf} 60%, ${T.sage} 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; position: relative; overflow: hidden; }
.login-art-img { position: absolute; inset: 0; }
.login-art-img img { width: 100%; height: 100%; object-fit: cover; opacity: 0.25; }
.login-art-content { position: relative; z-index: 1; color: white; }
.login-form-side { display: flex; align-items: center; justify-content: center; padding: 40px 28px; background: ${T.snow}; }
.login-form { width: 100%; max-width: 400px; }

/* ─── ADDRESS MODAL ─── */
.addr-modal-bg { position: fixed; inset: 0; background: rgba(26,58,42,0.55); backdrop-filter: blur(6px); z-index: 900; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeInBg 0.25s ease both; }
@keyframes fadeInBg { from{opacity:0} to{opacity:1} }
.addr-modal { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 24px 80px rgba(26,58,42,0.25); animation: slideUpModal 0.32s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes slideUpModal { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }

/* ─── AUTH GATE ─── */
.auth-gate { background: linear-gradient(135deg, ${T.forest}, ${T.leaf}); border-radius: 16px; padding: 28px 24px; text-align: center; margin-bottom: 20px; }

/* ─── RESPONSIVE ─── */
@media (min-width: 1024px) { .nav-links { display: flex; } .mob-nav { display: none; } }
@media (max-width: 1200px) { .rest-grid { grid-template-columns: repeat(3,1fr); } .trending-scroll { grid-template-columns: repeat(2,1fr); } .cart-layout { grid-template-columns: 1fr 320px; } }
@media (max-width: 900px) { .rest-grid { grid-template-columns: repeat(2,1fr); } .chefs-grid { grid-template-columns: 1fr; } .story-grid { grid-template-columns: 1fr; } .cart-layout { grid-template-columns: 1fr; } .trending-scroll { grid-template-columns: repeat(2,1fr); } .video-hero { height: 75vh; } .hero-stat-bar { gap: 20px; } .menu-items-grid { grid-template-columns: 1fr; } .footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; } .offers-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .track-steps { gap: 4px; } .track-label { font-size: 9px; } .footer-grid { grid-template-columns: 1fr; gap: 30px; } .login-page { grid-template-columns: 1fr; } .login-art { display: none; } .login-form-side { padding: 40px 28px; } .dish-grid { grid-template-columns: repeat(2,1fr); } .video-hero { height: 70vh; min-height: 480px; } }
@media (max-width: 600px) { .video-container iframe { width: 100vw; min-width: unset; height: 56.25vw; min-height: unset; top: 50%; } .video-hero { height: 90vw; min-height: 380px; } .rest-grid { grid-template-columns: 1fr; } .dish-grid { grid-template-columns: 1fr; } .trending-scroll { grid-template-columns: 1fr; } .hero-stat-bar { display: none; } .hero-pills { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; } .cat-item { width: 88px; } .cat-img-ring { width: 70px; height: 70px; } .menu-item-card { flex-direction: column; } .menu-item-img { width: 100%; height: 160px; min-width: unset; } .menu-hero-info { flex-direction: column; gap: 14px; } .footer-grid { grid-template-columns: 1fr; } }
`;

/* ─── HELPERS ─────────────────────────────────────────────── */
function Stars({ r }) {
  return (
    <span>
      {[1,2,3,4,5].map(i=>(
        <span key={i} className="star" style={{ opacity: i<=Math.floor(r)?1:i===Math.ceil(r)?0.5:0.2 }}>★</span>
      ))}
      <span style={{ fontSize:12, fontWeight:700, marginLeft:4, color:T.forest }}>{r}</span>
    </span>
  );
}

function Rv({ children, delay=0 }) {
  const ref = useRef();
  const [vis, setVis] = useState(false);
  useEffect(()=>{
    const ob = new IntersectionObserver(([e])=>{ if(e.isIntersecting){setVis(true);ob.disconnect();} },{threshold:0.1});
    if(ref.current) ob.observe(ref.current);
    return ()=>ob.disconnect();
  },[]);
  return (
    <div ref={ref} style={{ opacity: vis?1:0, transform: vis?'none':'translateY(24px)', transition:`opacity 0.5s ${delay}s, transform 0.5s ${delay}s cubic-bezier(0.4,0,0.2,1)` }}>
      {children}
    </div>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function Navbar({ page, go, cnt, user, onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(()=>{
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (y > lastScrollY.current && y > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return ()=> window.removeEventListener('scroll', fn);
  },[]);

  const links = [
    {id:'home',label:'Home'},{id:'restaurants',label:'Restaurants'},{id:'explore',label:'Explore'},{id:'offers',label:'Offers'},
    {id:'track',label:'Track'},{id:'help',label:'Help'},{id:'about',label:'About'},
  ];
  return (
    <nav className={`navbar${scrolled?' scrolled':''}${hidden?' nav-hidden':' nav-visible'}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={()=>go('home')}>
          <div className="logo-leaf">🌿</div>
          <span>Terra<em style={{fontStyle:'italic',fontWeight:400}}> Eats</em></span>
        </button>
        <div className="nav-links">
          {links.map(l=>(
            <button key={l.id} className={`nav-link${page===l.id?' active':''}`} onClick={()=>go(l.id)}>{l.label}</button>
          ))}
        </div>
        <div className="nav-actions">
          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${T.sage},${T.leaf})`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}
                title={user.name} onClick={()=>go('cart')}>
                {user.name[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <button className="nav-btn-sm" onClick={()=>go('login')}>Login</button>
          )}
          <button className="nav-cart" onClick={()=>go('cart')}>
            🛒 Cart
            {cnt>0 && <span className="cart-badge">{cnt}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

function MobNav({ page, go, cnt }) {
  const tabs = [
    {id:'home',label:'Home',icon:'🏠'},{id:'restaurants',label:'Restaurants',icon:'🏪'},{id:'explore',label:'Explore',icon:'🔍'},
    {id:'offers',label:'Offers',icon:'🏷️'},{id:'cart',label:'Cart',icon:'🛒',badge:cnt},
  ];
  return (
    <div className="mob-nav">
      {tabs.map(t=>(
        <button key={t.id} className={`mob-btn${page===t.id?' active':''}`} onClick={()=>go(t.id)}>
          <span style={{fontSize:22,position:'relative'}}>
            {t.icon}
            {t.badge>0&&<span className="cart-badge" style={{top:-4,right:-4}}>{t.badge}</span>}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── VIDEO HERO ─────────────────────────────────────────── */
function VideoHero({ go }) {
  return (
    <div className="video-hero">
      <div className="video-fallback" />
      <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/lcU3pruVyUw?autoplay=1&mute=1&loop=1&playlist=lcU3pruVyUw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&end=65"
          title="Terra Eats Hero Video"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
        />
      </div>
      <div className="video-overlay" />
      <div className="video-hero-content">
        <div style={{ maxWidth:620, animation:'fadeUp 0.8s ease both' }}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.1)',borderRadius:20,padding:'6px 14px 6px 8px',marginBottom:22,backdropFilter:'blur(8px)' }}>
            <span style={{ background:'rgba(232,116,42,0.85)',borderRadius:14,padding:'2px 10px',fontSize:11,fontWeight:700,color:'white',letterSpacing:'0.06em' }}>NEW</span>
            <span style={{ fontSize:12,color:'rgba(200,223,197,0.9)',fontWeight:400 }}>Farm-to-table delivery is here 🌱</span>
          </div>
          <h1 className="hero-h1">From nature's<br/>kitchen <em>to yours</em></h1>
          <p className="hero-sub">Handpicked restaurants. Seasonal ingredients.<br/>Delivered with care in 30 minutes.</p>
          <div className="hero-search">
            <input placeholder="Search for biryani, sushi, burgers…" style={{ border:'none',outline:'none',flex:1,padding:'16px 20px',fontSize:14,color:T.forest,background:'transparent' }} />
            <button className="hero-search-btn" onClick={()=>go('explore')}>Search</button>
          </div>
          <div className="hero-pills">
            {['🍕 Pizza','🍔 Burger','🍛 Biryani','🍜 Noodles','🍣 Sushi'].map(p=>(
              <button key={p} className="hero-pill" onClick={()=>go('explore')}>{p}</button>
            ))}
          </div>
          <div className="hero-stat-bar">
            {[['500+','Restaurants'],['30min','Avg Delivery'],['4.8★','Avg Rating']].map(([n,l])=>(
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

/* ─── CATEGORY CAROUSEL ──────────────────────────────────── */
function CategoryCarousel({ activeCat, setActiveCat, go }) {
  const trackRef = useRef();
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const autoRef = useRef(null);
  const ITEM_W = 124;

  const maxOffset = Math.max(0, CATEGORIES.length * ITEM_W - (typeof window !== 'undefined' ? window.innerWidth - 56 : 800));

  const startAuto = useCallback(() => {
    autoRef.current = setInterval(() => {
      setOffset(prev => { const next = prev + 0.5; return next > maxOffset ? 0 : next; });
    }, 20);
  }, [maxOffset]);

  useEffect(() => { startAuto(); return () => clearInterval(autoRef.current); }, [startAuto]);

  const stopAuto = () => clearInterval(autoRef.current);
  const slide = (dir) => {
    stopAuto();
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + dir * ITEM_W * 3)));
    setTimeout(startAuto, 4000);
  };

  const onMouseDown = (e) => { stopAuto(); setIsDragging(true); dragStart.current = { x: e.clientX, offset }; };
  const onMouseMove = (e) => { if (!isDragging || !dragStart.current) return; const dx = dragStart.current.x - e.clientX; setOffset(Math.max(0, Math.min(maxOffset, dragStart.current.offset + dx))); };
  const onMouseUp = () => { setIsDragging(false); setTimeout(startAuto, 4000); };
  const onTouchStart = (e) => { stopAuto(); dragStart.current = { x: e.touches[0].clientX, offset }; };
  const onTouchMove = (e) => { if (!dragStart.current) return; const dx = dragStart.current.x - e.touches[0].clientX; setOffset(Math.max(0, Math.min(maxOffset, dragStart.current.offset + dx))); };
  const onTouchEnd = () => { dragStart.current = null; setTimeout(startAuto, 4000); };

  const handleCatClick = (cat) => {
    setActiveCat(cat.label === activeCat ? null : cat.label);
    go && go('explore', { catFilter: cat.label });
  };

  return (
    <div style={{ position:'relative' }}>
      <button className="cat-carousel-btn prev" onClick={()=>slide(-1)}>‹</button>
      <div className="cat-carousel-wrap"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div ref={trackRef} className={`cat-carousel-track${isDragging?' dragging':''}`} style={{ transform:`translateX(-${offset}px)` }}>
          {CATEGORIES.map((cat)=>(
            <div key={cat.label} className={`cat-item${activeCat===cat.label?' active':''}`}
              onClick={()=>handleCatClick(cat)}>
              <div className="cat-img-ring"><img src={cat.img} alt={cat.label} loading="lazy" /></div>
              <span className="cat-label">{cat.emoji} {cat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="cat-carousel-btn next" onClick={()=>slide(1)}>›</button>
    </div>
  );
}

/* ─── TOP OFFERS SECTION ─────────────────────────────────── */
function TopOffersSection({ go, goRestaurant }) {
  const offeredRests = RESTAURANTS.filter(r => r.discount);
  return (
    <section className="section" style={{ background: T.sand, paddingTop: 56, paddingBottom: 56 }}>
      <div className="container">
        <Rv>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="section-label">💰 Save Big</span>
              <h2 className="section-title">Top Offers & Discounts</h2>
              <p className="section-sub">Grab these deals before they expire</p>
            </div>
            <button className="btn-outline" onClick={() => go('offers')}>All Offers →</button>
          </div>
        </Rv>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {offeredRests.map((r, i) => (
            <Rv key={r.id} delay={i * 0.06}>
              <div
                onClick={() => goRestaurant(r.id)}
                style={{ background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: `0 4px 20px ${T.shadow}`, border: `1px solid rgba(107,158,122,0.1)`, cursor: 'pointer', transition: 'all 0.3s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${T.shadowD}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 20px ${T.shadow}`; }}
              >
                {/* Discount badge ribbon */}
                <div style={{ position: 'absolute', top: 14, right: -1, background: `linear-gradient(135deg, ${T.sunset}, ${T.dusk})`, color: 'white', fontSize: 10, fontWeight: 800, padding: '5px 14px 5px 12px', borderRadius: '6px 0 0 6px', letterSpacing: '0.04em', zIndex: 2, boxShadow: `-2px 2px 8px rgba(0,0,0,0.2)` }}>
                  {r.discount}
                </div>
                <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} loading="lazy"
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = ''}
                  />
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 700, color: T.forest, marginBottom: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: T.moss, marginBottom: 10 }}>{r.cuisine} · {r.price} · ⏱ {r.time} min</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stars r={r.rating} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.leaf, background: 'rgba(45,90,61,0.08)', padding: '3px 10px', borderRadius: 6 }}>View Menu →</span>
                  </div>
                </div>
              </div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TRENDING SECTION ──────────────────────────────────── */
function TrendingSection({ addToCart, goRestaurant, goDish }) {
  return (
    <section className="section" style={{ paddingBottom:40 }}>
      <div className="container">
        <Rv>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:40 }}>
            <div className="section-head" style={{ marginBottom:0 }}>
              <span className="section-label">🔥 Hot right now</span>
              <h2 className="section-title">Trending Now</h2>
              <p className="section-sub">Dishes everyone's ordering this week — click a dish to find where to order it</p>
            </div>
          </div>
        </Rv>
        <div className="trending-scroll">
          {TRENDING.map((item, i) => (
            <Rv key={item.id} delay={i * 0.06}>
              <div className="trending-card">
                <div className="trending-img" style={{ cursor: 'pointer' }} onClick={() => goDish && goDish(item.name)}>
                  <img src={item.img} alt={item.name} loading="lazy" />
                  <span className="trending-tag">{item.tag}</span>
                  <div className="trending-veg" style={{ borderColor: item.veg ? '#2D7A22' : '#E53E3E', color: item.veg ? '#2D7A22' : '#E53E3E' }}>●</div>
                  {/* Dish finder hint */}
                  <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(to top, rgba(26,58,42,0.85), transparent)',padding:'20px 10px 8px',opacity:0,transition:'opacity 0.25s',display:'flex',alignItems:'flex-end',justifyContent:'center' }}
                    onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0'}>
                    <span style={{ fontSize:10,fontWeight:700,color:'white',letterSpacing:'0.06em' }}>🔍 FIND WHERE TO ORDER</span>
                  </div>
                </div>
                <div className="trending-body">
                  <div className="trending-name" style={{ cursor: 'pointer' }} onClick={() => goDish && goDish(item.name)}>{item.name}</div>
                  <div className="trending-rest" onClick={()=>goRestaurant(item.restId)}>🏪 {item.rest}</div>
                  <div className="trending-meta">
                    <div className="trending-price">₹{item.price}</div>
                    <div className="trending-rating">
                      <span className="trending-stars">★</span>
                      <span style={{ fontWeight:700,color:T.forest }}>{item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex',gap:6,padding:'0 14px 14px' }}>
                  <button className="trending-add-btn" style={{ flex:1 }} onClick={()=>addToCart({id:item.id,name:item.name,price:item.price,img:item.img,restName:item.rest})}>
                    + Add to Cart
                  </button>
                  {goDish && (
                    <button onClick={() => goDish(item.name)} style={{ padding:'10px 12px',borderRadius:10,border:`1.5px solid rgba(107,158,122,0.3)`,background:'none',cursor:'pointer',fontSize:14,color:T.sage,fontWeight:700,transition:'all 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background=T.sage;e.currentTarget.style.color='white';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=T.sage;}}>
                      🔍
                    </button>
                  )}
                </div>
              </div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── COMPACT FOOTER ─────────────────────────────────────── */
function Footer({ go }) {
  const socials = [
    { icon:'📸', label:'Instagram', url:'https://instagram.com' },
    { icon:'▶️', label:'YouTube', url:'https://youtube.com' },
    { icon:'𝕏', label:'Twitter', url:'https://twitter.com' },
    { icon:'💼', label:'LinkedIn', url:'https://linkedin.com' },
    { icon:'📘', label:'Facebook', url:'https://facebook.com' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand */}
          <div className="footer-col">
            <div className="footer-brand">🌿 Terra Eats</div>
            <div className="footer-contact">
              <div>📍 Mysuru, Karnataka, India</div>
              <div>📱 +91 98765 43210</div>
              <div>📧 hello@terraeats.in</div>
            </div>
            <div className="footer-eco">
              <div className="footer-eco-title">🌱 Eco Pledge</div>
              <p>1 order = 1 tree planted. 12,000 trees so far!</p>
            </div>
          </div>

          {/* Col 2: Navigate */}
          <div className="footer-col">
            <div className="footer-title">Navigate</div>
            <div className="footer-links">
              {['Home','Explore','Restaurants','Offers','Track','Help'].map(l=>(
                <span key={l} className="footer-link" onClick={()=>go(l.toLowerCase())}>{l}</span>
              ))}
            </div>
            <div className="footer-title" style={{ marginTop: 20 }}>Follow Us</div>
            <div className="footer-socials">
              {socials.map(s=>(
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="footer-social-link" title={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: Company */}
          <div className="footer-col">
            <div className="footer-title">Company</div>
            <div className="footer-links">
              {['About Us','Careers','Blog','Press','Sustainability','Partners'].map(l=>(
                <span key={l} className="footer-link">{l}</span>
              ))}
            </div>
          </div>

          {/* Col 4: Legal */}
          <div className="footer-col">
            <div className="footer-title">Legal</div>
            <div className="footer-links">
              {['Privacy Policy','Terms of Service','Cookie Policy','Refund Policy','Accessibility'].map(l=>(
                <span key={l} className="footer-link">{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <span>© 2026 Terra Eats · All rights reserved</span>
          <span>Made with 🌿 in Mysuru, India</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── RESTAURANT MENU PAGE ────────────────────────────────── */
function RestaurantMenuPage({ restaurant, cart, addToCart, go }) {
  const menu = RESTAURANT_MENUS[restaurant.id] || {};
  const categories = Object.keys(menu);
  const [activeTab, setActiveTab] = useState(categories[0] || '');
  const [quantities, setQuantities] = useState({});

  const getQty = (itemId) => quantities[itemId] || 0;
  const increment = (item) => {
    const newQty = getQty(item.id) + 1;
    setQuantities(q => ({...q, [item.id]: newQty}));
    addToCart({...item, restName: restaurant.name});
  };
  const decrement = (item) => {
    const newQty = Math.max(0, getQty(item.id) - 1);
    setQuantities(q => ({...q, [item.id]: newQty}));
    if (newQty > 0) {
      // reduce qty in cart
      addToCart({...item, restName: restaurant.name, _remove: true});
    }
  };

  const currentItems = menu[activeTab] || [];

  return (
    <div className="page">
      {/* Menu Hero */}
      <div className="menu-hero">
        <div style={{ position:'absolute',inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 4 C20 24 12 44 40 60 C68 44 60 24 40 4Z' fill='%238FBA99' fill-opacity='0.06'/%3E%3C/svg%3E")`,backgroundSize:'80px' }} />
        <div className="container" style={{ position:'relative',zIndex:1 }}>
          <button className="menu-hero-back" onClick={()=>go('explore')}>← Back to Restaurants</button>
          <div className="menu-hero-info">
            <div className="menu-hero-img">
              <img src={restaurant.img} alt={restaurant.name} />
            </div>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
                {restaurant.badge && <span style={{ background:'rgba(232,116,42,0.9)',color:'white',fontSize:9,fontWeight:700,padding:'4px 10px',borderRadius:6,letterSpacing:'0.06em',textTransform:'uppercase' }}>{restaurant.badge}</span>}
                {restaurant.discount && <span style={{ background:'rgba(255,255,255,0.15)',color:T.fern,fontSize:10,fontWeight:600,padding:'4px 10px',borderRadius:6 }}>{restaurant.discount}</span>}
              </div>
              <h1 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:700,color:'white',lineHeight:1.1,marginBottom:6 }}>{restaurant.name}</h1>
              <p style={{ color:T.mist,fontSize:14,fontWeight:300,marginBottom:12 }}>{restaurant.cuisine} cuisine</p>
              <div style={{ display:'flex',alignItems:'center',gap:18,fontSize:13 }}>
                <span style={{ color:'white',fontWeight:700 }}>★ {restaurant.rating}</span>
                <span style={{ color:T.mist }}>⏱ {restaurant.time} min</span>
                <span style={{ color:T.mist }}>{restaurant.price}</span>
              </div>
            </div>
          </div>
          {/* Category Tabs */}
          <div className="menu-cat-tabs">
            {categories.map(cat => (
              <button key={cat} className={`menu-cat-tab${activeTab===cat?' active':''}`} onClick={()=>setActiveTab(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <section className="section" style={{ paddingTop:40 }}>
        <div className="container">
          <Rv>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:700,color:T.forest,marginBottom:6 }}>{activeTab}</h2>
            <p style={{ color:T.moss,fontSize:13,fontWeight:300,marginBottom:28 }}>{currentItems.length} items</p>
          </Rv>
          <div className="menu-items-grid">
            {currentItems.map((item, i) => {
              const qty = getQty(item.id);
              return (
                <Rv key={item.id} delay={i*0.05}>
                  <div className="menu-item-card">
                    <div className="menu-item-img">
                      <img src={item.img} alt={item.name} loading="lazy" />
                    </div>
                    <div className="menu-item-body">
                      <div className="menu-item-top">
                        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:4 }}>
                          <div className="menu-item-name">{item.name}</div>
                          <div style={{ display:'flex',alignItems:'center',gap:6,flexShrink:0 }}>
                            <div style={{ width:14,height:14,borderRadius:3,border:`2px solid ${item.veg?'#2D7A22':'#E53E3E'}`,background:'white',display:'flex',alignItems:'center',justifyContent:'center' }}>
                              <div style={{ width:7,height:7,borderRadius:'50%',background:item.veg?'#2D7A22':'#E53E3E' }} />
                            </div>
                          </div>
                        </div>
                        <p className="menu-item-desc">{item.desc}</p>
                        <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:10 }}>
                          <span style={{ color:T.amber,fontSize:11 }}>★</span>
                          <span style={{ fontSize:11,fontWeight:600,color:T.forest }}>{item.rating}</span>
                          {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                        </div>
                      </div>
                      <div className="menu-item-bottom">
                        <div className="menu-item-price">₹{item.price}</div>
                        {qty === 0 ? (
                          <button className="menu-add-btn" onClick={()=>increment(item)}>
                            + Add
                          </button>
                        ) : (
                          <div className="menu-qty-ctrl">
                            <button className="menu-qty-btn" onClick={()=>decrement(item)}>−</button>
                            <span className="menu-qty-num">{qty}</span>
                            <button className="menu-qty-btn" onClick={()=>increment(item)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Rv>
              );
            })}
          </div>

          {/* Cart nudge */}
          {cart.length > 0 && (
            <div style={{ marginTop:40,background:`linear-gradient(135deg, ${T.forest}, ${T.leaf})`,borderRadius:16,padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:`0 8px 32px ${T.shadowD}` }}>
              <div style={{ color:'white' }}>
                <div style={{ fontSize:14,fontWeight:600 }}>🛒 {cart.reduce((s,c)=>s+c.qty,0)} items in cart</div>
                <div style={{ fontSize:12,color:T.mist,marginTop:2 }}>₹{cart.reduce((s,c)=>s+c.price*c.qty,0)} total</div>
              </div>
              <button className="btn-nature" style={{ padding:'10px 24px',fontSize:13 }} onClick={()=>go('cart')}>
                View Cart →
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── LIVE TRACK MAP ─────────────────────────────────────── */
function LiveTrackMap({ step }) {
  const progress = step / 3;
  const pts = ROUTE_POINTS;
  const riderIdx = Math.floor(progress * (pts.length - 1));
  const riderFrac = (progress * (pts.length - 1)) - riderIdx;
  const p1 = pts[Math.min(riderIdx, pts.length-1)];
  const p2 = pts[Math.min(riderIdx+1, pts.length-1)];
  const riderX = p1.x + (p2.x - p1.x) * riderFrac;
  const riderY = p1.y + (p2.y - p1.y) * riderFrac;
  const pathD = pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="track-live-map">
      <svg className="track-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#E8F5E4" />
        {[10,20,30,40,50,60,70,80,90].map(v=>(
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(107,158,122,0.15)" strokeWidth="0.3"/>
            <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(107,158,122,0.15)" strokeWidth="0.3"/>
          </g>
        ))}
        <rect x="5" y="55" width="30" height="18" rx="1.5" fill="rgba(107,158,122,0.08)" stroke="rgba(107,158,122,0.15)" strokeWidth="0.3"/>
        <rect x="40" y="35" width="22" height="16" rx="1.5" fill="rgba(107,158,122,0.08)" stroke="rgba(107,158,122,0.15)" strokeWidth="0.3"/>
        <rect x="68" y="10" width="20" height="16" rx="1.5" fill="rgba(107,158,122,0.08)" stroke="rgba(107,158,122,0.15)" strokeWidth="0.3"/>
        <path d={pathD} fill="none" stroke="rgba(107,158,122,0.25)" strokeWidth="1.5" strokeDasharray="2,1.5"/>
        {step > 0 && (
          <path d={pts.slice(0, riderIdx+2).map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ')} fill="none" stroke={T.sage} strokeWidth="2" strokeLinecap="round"/>
        )}
        <circle cx={pts[0].x} cy={pts[0].y} r="3.5" fill={T.leaf} stroke="white" strokeWidth="1"/>
        <text x={pts[0].x+4} y={pts[0].y+1} fontSize="3" fill={T.forest} fontWeight="bold">🏪 Restaurant</text>
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="3.5" fill={T.sunset} stroke="white" strokeWidth="1"/>
        <text x={pts[pts.length-1].x-14} y={pts[pts.length-1].y+1} fontSize="3" fill={T.forest} fontWeight="bold">📍 You</text>
        {step >= 2 && (
          <>
            <circle cx={riderX} cy={riderY} r="5" fill="white" stroke={T.sage} strokeWidth="1.5" style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}/>
            <text x={riderX} y={riderY+1.5} fontSize="4.5" textAnchor="middle">🛵</text>
          </>
        )}
        {step < 2 && <text x="50" y="50" fontSize="5" textAnchor="middle" fill={T.sage} opacity="0.6">🗺️ Preparing order…</text>}
      </svg>
      <div style={{ position:'absolute',top:14,right:14,background:'rgba(255,255,255,0.92)',backdropFilter:'blur(8px)',borderRadius:10,padding:'8px 14px',boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize:11,fontWeight:700,color:T.forest,marginBottom:2 }}>Order #TE28741</div>
        <div style={{ fontSize:10,color:T.moss }}>🏪 Spice Garden → 📍 Your Location</div>
        {step >= 2 && <div style={{ fontSize:10,fontWeight:700,color:T.sage,marginTop:3 }}>🛵 Rider on the way!</div>}
      </div>
      <div style={{ position:'absolute',bottom:14,left:14,background:'rgba(255,255,255,0.92)',backdropFilter:'blur(8px)',borderRadius:8,padding:'6px 12px' }}>
        <div style={{ fontSize:10,color:T.moss }}>
          <span style={{ display:'inline-block',width:8,height:8,borderRadius:'50%',background:T.sage,marginRight:5 }}/>Route: MG Road → Ashoka Rd → Your Door
        </div>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ───────────────────────────────────────────── */
function HomePage({ go, addToCart, goRestaurant, goDish }) {
  const [activeCat, setActiveCat] = useState(null);

  const handleCatClick = (cat) => {
    setActiveCat(cat);
  };

  const catRestaurants = activeCat
    ? RESTAURANTS.filter(r => (CATEGORY_RESTAURANTS[activeCat]||[]).includes(r.id))
    : [];

  return (
    <div style={{ paddingTop:70, minHeight:'100vh' }}>
      <VideoHero go={go} />

      {/* Categories */}
      <section className="section" style={{ background:T.snow, paddingBottom:60 }}>
        <div className="container">
          <Rv>
            <div className="section-head" style={{ marginBottom:36 }}>
              <span className="section-label">Browse by Category</span>
              <h2 className="section-title">What's your craving?</h2>
              <p className="section-sub">Drag, swipe or click — discover every cuisine</p>
            </div>
          </Rv>
          <Rv delay={0.06}>
            <CategoryCarousel activeCat={activeCat} setActiveCat={handleCatClick} />
          </Rv>

          {activeCat && catRestaurants.length > 0 && (
            <div className="dish-suggestions">
              <Rv>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
                  <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:26,fontWeight:700,color:T.forest }}>Restaurants offering {activeCat}</h3>
                  <button className="btn-outline" style={{ padding:'9px 20px',fontSize:12 }} onClick={()=>go('restaurants')}>See all →</button>
                </div>
              </Rv>
              <div className="rest-grid">
                {catRestaurants.map((r,i)=>(
                  <Rv key={r.id} delay={i*.07}>
                    <div className="rest-card" onClick={()=>goRestaurant(r.id)}>
                      <div className="rest-img">
                        <img src={r.img} alt={r.name} loading="lazy" />
                        {r.badge && <span className="rest-badge">{r.badge}</span>}
                        {r.discount && <span className="rest-discount">{r.discount}</span>}
                      </div>
                      <div className="rest-body">
                        <div className="rest-name">{r.name}</div>
                        <div className="rest-cuisine">{r.cuisine}</div>
                        <div className="rest-meta">
                          <Stars r={r.rating} />
                          <span className="rest-time">⏱ {r.time} min</span>
                          <span className="rest-price">{r.price}</span>
                        </div>
                      </div>
                    </div>
                  </Rv>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trending */}
      <TrendingSection addToCart={addToCart} goRestaurant={goRestaurant} goDish={goDish} />

      {/* Top Offers & Discounts */}
      <TopOffersSection go={go} goRestaurant={goRestaurant} />

      {/* Featured Restaurants */}
      <div className="nature-divider">
        <div className="nd-pattern" />
        <div className="container">
          <Rv>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:36 }}>
              <div className="section-head" style={{ marginBottom:0 }}>
                <span className="section-label">Handpicked for you</span>
                <h2 className="section-title">Featured Restaurants</h2>
                <p className="section-sub">Click any restaurant to explore their full menu</p>
              </div>
              <button className="btn-outline" onClick={()=>go('restaurants')}>View all →</button>
            </div>
          </Rv>
          <div className="rest-grid">
            {RESTAURANTS.map((r,i)=>(
              <Rv key={r.id} delay={i*.05}>
                <div className="rest-card" onClick={()=>goRestaurant(r.id)}>
                  <div className="rest-img">
                    <img src={r.img} alt={r.name} loading="lazy" />
                    {r.badge && <span className="rest-badge">{r.badge}</span>}
                    {r.discount && <span className="rest-discount">{r.discount}</span>}
                  </div>
                  <div className="rest-body">
                    <div className="rest-name">{r.name}</div>
                    <div className="rest-cuisine">{r.cuisine}</div>
                    <div className="rest-meta">
                      <Stars r={r.rating} />
                      <span className="rest-time">⏱ {r.time} min</span>
                      <span className="rest-price">{r.price}</span>
                    </div>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section style={{ background:`linear-gradient(135deg, ${T.forest} 0%, ${T.leaf} 100%)`, padding:'80px 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 4 C24 20 16 36 40 52 C64 36 56 20 40 4Z\' fill=\'%238FBA99\' fill-opacity=\'0.06\'/%3E%3C/svg%3E") repeat', opacity:1 }} />
        <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <Rv>
            <div style={{ fontSize:48,marginBottom:16 }}>🌱</div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4vw,56px)',fontWeight:700,color:'white',marginBottom:14,lineHeight:1.1 }}>
              Order today,<br/>save the planet tomorrow
            </h2>
            <p style={{ color:T.mist,fontSize:16,fontWeight:300,marginBottom:32,maxWidth:480,margin:'0 auto 32px' }}>We plant one tree for every 10 orders. Join 50,000+ eco-conscious food lovers.</p>
            <button className="btn-nature" style={{ fontSize:15,padding:'16px 36px' }} onClick={()=>go('explore')}>Start Ordering 🍃</button>
          </Rv>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

/* ─── EXPLORE PAGE ────────────────────────────────────────── */
function ExplorePage({ go, addToCart, goRestaurant, initCat }) {
  const [filter, setFilter] = useState(initCat || 'All');
  const [sort, setSort] = useState('rating');
  const [search, setSearch] = useState('');
  const filters = ['All','North Indian','American','Italian','Chinese','Japanese','South Indian','Desserts'];

  const list = RESTAURANTS
    .filter(r => {
      const matchFilter = filter === 'All' || r.cuisine.toLowerCase().includes(filter.toLowerCase());
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a,b) => sort==='rating' ? b.rating-a.rating : a.time.localeCompare(b.time));

  return (
    <div className="page">
      <div className="explore-hero">
        <div className="container">
          <Rv>
            <span className="section-label">Discover</span>
            <h1 className="serif" style={{ fontSize:'clamp(36px,5vw,60px)',fontWeight:700,color:T.forest,lineHeight:1.1,marginBottom:8 }}>Explore Restaurants</h1>
            <p style={{ color:T.moss,fontSize:15,fontWeight:300,marginBottom:28 }}>{RESTAURANTS.length} handpicked restaurants near you — click any to view menu</p>
          </Rv>
          <Rv delay={0.06}>
            <div style={{ display:'grid',gridTemplateColumns:'1fr auto',gap:12,marginBottom:16,maxWidth:700 }}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',fontSize:18 }}>🔍</span>
                <input className="field" placeholder="Search restaurants or cuisines…" style={{ paddingLeft:48 }} value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <div style={{ display:'flex',gap:8 }}>
                {['rating','time'].map(s=>(
                  <button key={s} className="chip" style={{ borderColor: sort===s?T.sage:'', background: sort===s?'rgba(74,124,89,0.1)':'' }}
                    onClick={()=>setSort(s)}>{s==='rating'?'⭐ Top Rated':'⚡ Fastest'}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              {filters.map(f=>(
                <button key={f} className={`chip${filter===f?' active':''}`} onClick={()=>setFilter(f)}>{f}</button>
              ))}
            </div>
          </Rv>
        </div>
      </div>

      <section className="section" style={{ paddingTop:48 }}>
        <div className="container">
          {list.length > 0 ? (
            <>
              <Rv>
                <p style={{ color:T.moss,fontSize:13,marginBottom:24 }}>Showing {list.length} restaurant{list.length!==1?'s':''} · Click to view full menu</p>
              </Rv>
              <div className="rest-grid">
                {list.map((r,i)=>(
                  <Rv key={r.id} delay={i*.04}>
                    <div className="rest-card" onClick={()=>goRestaurant(r.id)}>
                      <div className="rest-img">
                        <img src={r.img} alt={r.name} loading="lazy" />
                        {r.badge && <span className="rest-badge">{r.badge}</span>}
                        {r.discount && <span className="rest-discount">{r.discount}</span>}
                      </div>
                      <div className="rest-body">
                        <div className="rest-name">{r.name}</div>
                        <div className="rest-cuisine">{r.cuisine}</div>
                        <div className="rest-meta">
                          <Stars r={r.rating} />
                          <span className="rest-time">⏱ {r.time} min</span>
                          <span className="rest-price">{r.price}</span>
                        </div>
                      </div>
                    </div>
                  </Rv>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center',padding:'80px 20px' }}>
              <div style={{ fontSize:56,marginBottom:16 }}>🌿</div>
              <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:26,color:T.forest,marginBottom:8 }}>No restaurants found</h3>
              <p style={{ color:T.moss }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── ABOUT PAGE ──────────────────────────────────────────── */
function AboutPage({ go }) {
  return (
    <div className="page">
      <div style={{ background:`linear-gradient(135deg, ${T.forest}, ${T.leaf})`, padding:'80px 0 100px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 4 C20 24 12 44 40 60 C68 44 60 24 40 4Z' fill='%238FBA99' fill-opacity='0.07'/%3E%3C/svg%3E")`,backgroundSize:'80px' }} />
        <div className="container" style={{ position:'relative',zIndex:1 }}>
          <Rv>
            <span className="section-label" style={{ color:T.fern }}>Our Story</span>
            <h1 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,6vw,80px)',fontWeight:700,color:'white',lineHeight:1.05,marginBottom:18 }}>
              Rooted in nature,<br/><em style={{fontStyle:'italic'}}>crafted with love</em>
            </h1>
            <p style={{ color:T.mist,fontSize:16,fontWeight:300,maxWidth:540,lineHeight:1.8 }}>
              Terra Eats was born from a simple belief: that food should nourish both body and planet. We partner with responsible restaurants and local farmers to bring you meals that feel good — truly good.
            </p>
          </Rv>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="story-grid">
            <Rv>
              <div className="story-img">
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90" alt="Our kitchen" />
                <div className="story-img-leaf">🌿</div>
              </div>
            </Rv>
            <Rv delay={0.12}>
              <div>
                <span className="section-label">Our Mission</span>
                <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,3vw,42px)',fontWeight:700,color:T.forest,lineHeight:1.2,marginBottom:20 }}>
                  Every meal is a chance to do better
                </h2>
                <p style={{ color:T.earth,fontSize:15,fontWeight:300,lineHeight:1.85,marginBottom:20 }}>
                  We carefully select restaurant partners who share our values — using seasonal, locally sourced ingredients, minimizing waste, and treating their teams with dignity.
                </p>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:36 }}>
                  {[['12K+','Trees Planted'],['500+','Partner Restaurants'],['50K+','Happy Customers']].map(([n,l])=>(
                    <div key={l} style={{ textAlign:'center',padding:'20px 16px',background:T.snow,borderRadius:16,border:`1px solid rgba(107,158,122,0.12)` }}>
                      <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:32,fontWeight:700,color:T.sage }}>{n}</div>
                      <div style={{ fontSize:11,color:T.moss,marginTop:4,fontWeight:500 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Rv>
          </div>
        </div>
      </section>

      <section className="section" style={{ background:T.snow }}>
        <div className="container">
          <Rv>
            <div className="section-head" style={{ textAlign:'center' }}>
              <span className="section-label">Meet the Team</span>
              <h2 className="section-title">The Chefs Behind the Magic</h2>
            </div>
          </Rv>
          <div className="chefs-grid">
            {CHEFS.map((chef,i)=>(
              <Rv key={chef.name} delay={i*.08}>
                <div className="chef-card">
                  <div className="chef-img">
                    <img src={chef.img} alt={chef.name} loading="lazy" />
                    <div className="chef-img-overlay" />
                    <div className="chef-emoji">{chef.emoji}</div>
                  </div>
                  <div className="chef-body">
                    <div className="chef-name">{chef.name}</div>
                    <div className="chef-spec">{chef.specialty}</div>
                    <div className="chef-exp">🏅 {chef.exp}</div>
                    <p className="chef-bio">{chef.bio}</p>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── CART PAGE ───────────────────────────────────────────── */
function CartPage({ cart, setCart, go }) {
  const { user } = useAuth();
  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState(false);
  const [msg, setMsg] = useState('');
  const [showAddrModal, setShowAddrModal] = useState(false);
  const { setUser } = useAuth();
  const CODES = {TERRA30:1,FIRST100:1,FREEDEL:1,NIGHT20:1};
  const chQ = (id,d) => setCart(p=>p.map(c=>c.id===id?{...c,qty:c.qty+d}:c).filter(c=>c.qty>0));
  const sub = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const del = sub>299?0:29; const tax=Math.round(sub*.05);
  const disc=applied?Math.round(sub*.1):0; const total=sub+del+tax-disc;
  const applyP=()=>{ if(CODES[promo.toUpperCase()]){setApplied(true);setMsg('✓ 10% discount applied!');}else{setMsg('Invalid code. Try TERRA30');setApplied(false);}};

  const placeO = () => {
    if (!user) { go('login'); return; }
    if (!user.address) { setShowAddrModal(true); return; }
    go('checkout');
  };

  if(cart.length===0) return (
    <div className="page" style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',textAlign:'center',padding:24 }}>
      <div style={{ fontSize:80,marginBottom:20 }}>🛒</div>
      <h2 className="serif" style={{ fontSize:36,fontWeight:700,color:T.forest,marginBottom:10 }}>Your cart is empty</h2>
      <p style={{ color:T.moss,fontSize:15,fontWeight:300,marginBottom:32 }}>Add something delicious to get started 🌿</p>
      <button className="btn-nature" style={{ fontSize:15 }} onClick={()=>go('explore')}>Explore Restaurants</button>
    </div>
  );

  return (
    <>
    {showAddrModal && (
      <AddressModal
        onSave={(addr) => { setUser(u => ({...u, address: addr})); setShowAddrModal(false); go('checkout'); }}
        onClose={() => setShowAddrModal(false)}
      />
    )}
    <div className="page">
      <div className="explore-hero">
        <div className="container">
          <span className="section-label">Checkout</span>
          <h1 className="serif" style={{ fontSize:'clamp(30px,4vw,52px)',fontWeight:700,color:T.forest }}>Your Cart</h1>
          <p style={{ color:T.moss,fontSize:14,marginTop:6 }}>{cart.reduce((s,c)=>s+c.qty,0)} item{cart.reduce((s,c)=>s+c.qty,0)!==1?'s':''} ready to order</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop:40 }}>
        <div className="container">
          <div className="cart-layout">
            <div>
              {del===0&&<div style={{ background:'rgba(45,90,61,0.08)',border:'1px solid rgba(45,90,61,0.2)',borderRadius:12,padding:'12px 18px',marginBottom:18,fontSize:13,color:T.leaf,fontWeight:600 }}>🎉 Free delivery unlocked!</div>}
              {cart.map((item,i)=>(
                <Rv key={item.id} delay={i*.04}>
                  <div className="cart-item">
                    <div className="cart-item-img"><img src={item.img} alt={item.name} /></div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600,fontSize:15,color:T.forest }}>{item.name}</div>
                      {item.restName && <div style={{ fontSize:11,color:T.moss,marginTop:2 }}>🏪 {item.restName}</div>}
                      <div style={{ color:T.sage,fontWeight:700,fontSize:15,marginTop:4 }}>₹{item.price*item.qty}</div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={()=>chQ(item.id,-1)}>−</button>
                      <span style={{ fontWeight:700,fontSize:15,minWidth:22,textAlign:'center',color:T.forest }}>{item.qty}</span>
                      <button className="qty-btn fill" onClick={()=>chQ(item.id,1)}>+</button>
                    </div>
                  </div>
                </Rv>
              ))}
            </div>
            <div>
              <div className="cart-summary" style={{ marginBottom:16 }}>
                <h3 className="serif" style={{ fontSize:20,fontWeight:700,color:T.forest,marginBottom:16 }}>Apply Promo</h3>
                <div style={{ display:'flex',gap:8 }}>
                  <input className="field" placeholder="e.g. TERRA30" value={promo} onChange={e=>setPromo(e.target.value.toUpperCase())} />
                  <button className="btn-primary" style={{ padding:'0 18px',whiteSpace:'nowrap',borderRadius:12 }} onClick={applyP}>Apply</button>
                </div>
                {msg&&<p style={{ marginTop:9,fontSize:12,color:applied?T.leaf:'#E53E3E',fontWeight:600 }}>{msg}</p>}
              </div>
              <div className="cart-summary">
                <h3 className="serif" style={{ fontSize:22,fontWeight:700,color:T.forest,marginBottom:20 }}>Bill Summary</h3>
                {[['Item Total',`₹${sub}`],['Delivery',del===0?'Free 🎉':`₹${del}`],['Taxes & Fees',`₹${tax}`],applied&&['Promo Discount',`−₹${disc}`]].filter(Boolean).map(([l,v])=>(
                  <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:14,fontSize:14 }}>
                    <span style={{ color:T.moss,fontWeight:300 }}>{l}</span>
                    <span style={{ color:l==='Promo Discount'?T.leaf:T.forest,fontWeight:l==='Promo Discount'?700:500 }}>{v}</span>
                  </div>
                ))}
                <hr style={{ border:'none',borderTop:`1px solid rgba(107,158,122,0.15)`,margin:'18px 0' }} />
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:20,fontWeight:700,marginBottom:24 }}>
                  <span className="serif">Grand Total</span>
                  <span style={{ color:T.leaf }}>₹{total}</span>
                </div>
                {!user && (
                  <div className="auth-gate" style={{ marginBottom:14 }}>
                    <div style={{ fontSize:28,marginBottom:8 }}>🔐</div>
                    <p style={{ color:'rgba(200,223,197,0.9)',fontSize:13,fontWeight:400,marginBottom:12 }}>Login required to place an order</p>
                    <button className="btn-nature" style={{ padding:'10px 24px',fontSize:13 }} onClick={()=>go('login')}>Login / Sign Up</button>
                  </div>
                )}
                {user && !user.address && (
                  <div className="auth-gate" style={{ marginBottom:14 }}>
                    <div style={{ fontSize:28,marginBottom:8 }}>📍</div>
                    <p style={{ color:'rgba(200,223,197,0.9)',fontSize:13,fontWeight:400,marginBottom:12 }}>Add a delivery address to continue</p>
                    <button className="btn-nature" style={{ padding:'10px 24px',fontSize:13 }} onClick={()=>setShowAddrModal(true)}>Add Address</button>
                  </div>
                )}
                <button className="btn-nature" style={{ width:'100%',padding:'16px',fontSize:15,opacity:(!user||!user.address)?0.5:1 }} onClick={placeO}>
                  {!user ? '🔒 Login to Checkout' : !user.address ? '📍 Add Address to Continue' : `Proceed to Checkout · ₹${total}`}
                </button>
                {user && user.address && <p style={{ textAlign:'center',color:T.moss,fontSize:11,marginTop:12 }}>📍 Delivering to: {user.address.line1}, {user.address.city}</p>}
                <p style={{ textAlign:'center',color:T.moss,fontSize:11,marginTop:8 }}>🔒 Secure payment · 100% refund guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
    </>
  );
}

/* ─── TRACK PAGE ──────────────────────────────────────────── */
function TrackPage({ go }) {
  const [step, setStep] = useState(1);
  const [sim, setSim] = useState(false);
  useEffect(()=>{
    if(!sim) return;
    if(step>=3){setSim(false);return;}
    const tm = setTimeout(()=>setStep(s=>s+1),2500);
    return ()=>clearTimeout(tm);
  },[step,sim]);

  return (
    <div className="page">
      <div className="explore-hero">
        <div className="container">
          <span className="section-label">Live Tracking</span>
          <h1 className="serif" style={{ fontSize:'clamp(30px,4vw,52px)',fontWeight:700,color:T.forest }}>Order Tracking</h1>
          <p style={{ color:T.moss,fontSize:14,marginTop:6 }}>Order #TE28741 · Spice Garden · Estimated {step===3?'Delivered ✓':'18 min'}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop:40 }}>
        <div className="container" style={{ maxWidth:780 }}>
          <Rv>
            <LiveTrackMap step={step} />
            <div className="track-steps" style={{ marginBottom:32 }}>
              {TRACK_STEPS.map((s,i)=>(
                <div key={s.label} className={`track-step ${i<=step?'done':i===step+1?'current':''}`}>
                  <div className="track-icon">{s.icon}</div>
                  <div className="track-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'white',borderRadius:18,padding:24,border:'1px solid rgba(107,158,122,0.12)',boxShadow:`0 4px 20px ${T.shadow}`,marginBottom:24 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:700,color:T.forest }}>
                    {TRACK_STEPS[Math.min(step,3)].label}
                  </div>
                  <div style={{ color:T.moss,fontSize:13,fontWeight:300,marginTop:4 }}>{TRACK_STEPS[Math.min(step,3)].desc}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:32,fontWeight:700,color:T.sage }}>{step<3?`${18-step*5} min`:'🎉'}</div>
                  {step<3&&<div style={{ fontSize:11,color:T.moss }}>estimated</div>}
                </div>
              </div>
              <hr style={{ border:'none',borderTop:'1px solid rgba(107,158,122,0.12)',margin:'0 0 16px' }} />
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                <div style={{ background:T.snow,borderRadius:10,padding:'12px 14px' }}>
                  <div style={{ fontSize:10,color:T.moss,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4 }}>From</div>
                  <div style={{ fontSize:13,color:T.forest,fontWeight:500 }}>🏪 Spice Garden, MG Road</div>
                </div>
                <div style={{ background:T.snow,borderRadius:10,padding:'12px 14px' }}>
                  <div style={{ fontSize:10,color:T.moss,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4 }}>To</div>
                  <div style={{ fontSize:13,color:T.forest,fontWeight:500 }}>📍 Your Location, Mysuru</div>
                </div>
              </div>
              {step>=2&&(
                <div style={{ marginTop:12,background:'rgba(74,124,89,0.08)',borderRadius:10,padding:'10px 14px',fontSize:13,color:T.leaf,fontWeight:600 }}>
                  🛵 Rider: Rajan Kumar · ⭐ 4.9 rating · 📱 Contact
                </div>
              )}
            </div>
            <div style={{ display:'flex',gap:12 }}>
              <button className="btn-nature" style={{ flex:1 }} onClick={()=>{setSim(true);}} disabled={sim||step>=3}>
                {sim?'🛵 Simulating…':step>=3?'Order Delivered! 🎉':'▶ Simulate Delivery'}
              </button>
              <button className="btn-outline" onClick={()=>setStep(1)}>Reset</button>
            </div>
          </Rv>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── OFFERS PAGE ─────────────────────────────────────────── */
function OffersPage({ go }) {
  const [copied, setCopied] = useState(null);
  const copy = (code) => { setCopied(code); setTimeout(()=>setCopied(null),2000); };

  return (
    <div className="page">
      <div style={{ background:`linear-gradient(135deg, ${T.leaf}, ${T.forest})`, padding:'70px 0 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 2 L36 18 L54 18 L40 28 L46 46 L30 36 L14 46 L20 28 L6 18 L24 18Z\' fill=\'%238FBA99\' fill-opacity=\'0.07\'/%3E%3C/svg%3E") repeat' }} />
        <div className="container" style={{ textAlign:'center',position:'relative',zIndex:1 }}>
          <Rv>
            <div style={{ fontSize:48,marginBottom:14 }}>🏷️</div>
            <h1 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,5vw,64px)',fontWeight:700,color:'white',lineHeight:1.1,marginBottom:12 }}>Exclusive Offers</h1>
            <p style={{ color:T.mist,fontSize:15,fontWeight:300 }}>Save more, eat better — click to copy any code</p>
          </Rv>
        </div>
      </div>
      <section className="section" style={{ paddingTop:48 }}>
        <div className="container">
          <div className="offers-grid">
            {OFFERS.map((o,i)=>(
              <Rv key={o.code} delay={i*.07}>
                <div className="offer-card" style={{ borderLeft:`4px solid ${o.color}` }}>
                  <span className="offer-code">{o.code}</span>
                  <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:24,fontWeight:700,color:T.forest,marginBottom:8 }}>{o.title}</h3>
                  <p style={{ color:T.moss,fontSize:14,fontWeight:300,lineHeight:1.6,marginBottom:8 }}>{o.desc}</p>
                  <p style={{ color:o.color,fontSize:13,fontWeight:700 }}>{o.saving}</p>
                  <p style={{ color:T.moss,fontSize:11,marginTop:6 }}>{o.expires}</p>
                  <button className="offer-copy" onClick={()=>copy(o.code)} style={{ background:copied===o.code?o.color:undefined,color:copied===o.code?'white':undefined,borderColor:copied===o.code?o.color:undefined }}>
                    {copied===o.code?'✓ Copied!':'Copy Code'}
                  </button>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── HELP PAGE ───────────────────────────────────────────── */
function HelpPage({ go }) {
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const handleMouseEnter = (i) => { if (!isMobile) { setHovered(i); setOpen(i); } };
  const handleMouseLeave = () => { if (!isMobile) { setHovered(null); setOpen(null); } };
  const handleClick = (i) => { if (isMobile) { setOpen(open === i ? null : i); setHovered(open === i ? null : i); } };

  return (
    <div className="page">
      <div style={{ background:T.sand, padding:'70px 0 80px', borderBottom:`1px solid rgba(107,158,122,0.12)` }}>
        <div className="container">
          <Rv>
            <span className="section-label">Support</span>
            <h1 className="serif" style={{ fontSize:'clamp(36px,5vw,60px)',fontWeight:700,color:T.forest,lineHeight:1.1,marginBottom:12 }}>How can we help?</h1>
            <p style={{ color:T.moss,fontSize:15,fontWeight:300 }}>Browse FAQs or reach out — our team responds in under 5 minutes.</p>
          </Rv>
        </div>
      </div>
      <section className="section" style={{ paddingTop:56 }}>
        <div className="container" style={{ display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:60,alignItems:'start' }}>
          <Rv>
            <div>
              <h2 className="serif" style={{ fontSize:28,fontWeight:700,color:T.forest,marginBottom:24 }}>Reach Us</h2>
              {[
                {icon:'📱',label:'WhatsApp Support',val:'+91 98765 43210',sub:'Daily 8AM–11PM'},
                {icon:'📧',label:'Email',val:'support@terraeats.in',sub:'Reply in 2 hours'},
                {icon:'💬',label:'Live Chat',val:'Available in-app',sub:'Instant response'},
              ].map(c=>(
                <div key={c.label} style={{ background:'white',borderRadius:14,padding:'18px 20px',marginBottom:12,border:'1px solid rgba(107,158,122,0.12)',display:'flex',gap:16,alignItems:'flex-start',transition:'all 0.2s',cursor:'pointer' }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 8px 24px ${T.shadow}`; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                  <div style={{ fontSize:24,flexShrink:0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight:600,fontSize:14,color:T.forest }}>{c.label}</div>
                    <div style={{ color:T.sage,fontSize:14,marginTop:2 }}>{c.val}</div>
                    <div style={{ color:T.moss,fontSize:11,marginTop:2,fontWeight:300 }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Rv>
          <Rv delay={0.08}>
            <div>
              <h2 className="serif" style={{ fontSize:28,fontWeight:700,color:T.forest,marginBottom:8 }}>Frequently Asked</h2>
              <p style={{ fontSize:13,color:T.moss,marginBottom:24,fontWeight:300 }}>{isMobile ? 'Tap a question to see the answer.' : 'Hover over a question to reveal the answer.'}</p>
              {FAQS.map((faq,i)=>(
                <div key={i} className={`faq-item${hovered===i?' hovered':''}`}
                  onMouseEnter={()=>handleMouseEnter(i)} onMouseLeave={handleMouseLeave} onClick={()=>handleClick(i)}>
                  <div className="faq-highlight-bar" />
                  <button className="faq-q" style={{ cursor:'default' }}>
                    <span>{faq.q}</span>
                    <span className={`faq-icon${open===i?' open':''}`}>+</span>
                  </button>
                  <div className={`faq-ans${open===i?' open':''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Rv>
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── LOGIN PAGE ──────────────────────────────────────────── */
function LoginPage({ go }) {
  const { setUser } = useAuth();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', name:'' });
  const [loading, setLoading] = useState(false);
  const [showAddr, setShowAddr] = useState(false);
  const pendingUser = useRef(null);

  const submit = () => {
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      const u = { name: tab==='signup' ? (form.name||'User') : 'Aarav', email: form.email, address: null };
      pendingUser.current = u;
      setShowAddr(true);
    }, 1400);
  };

  const handleAddrSave = (addr) => {
    const u = { ...pendingUser.current, address: addr };
    setUser(u);
    setShowAddr(false);
    go('home');
  };

  const skipAddr = () => {
    setUser(pendingUser.current);
    setShowAddr(false);
    go('home');
  };

  return (
    <>
      {showAddr && (
        <AddressModal
          onSave={handleAddrSave}
          onClose={skipAddr}
        />
      )}
      <div className="login-page" style={{ paddingTop:70, minHeight:'100vh' }}>
        <div className="login-art">
          <div className="login-art-img"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90" alt="" /></div>
          <div className="login-art-content">
            <div style={{ fontSize:60, marginBottom:20 }}>🌿</div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:48, fontWeight:700, lineHeight:1.1, marginBottom:16 }}>Nature's table<br/><em>awaits you</em></h2>
            <p style={{ color:T.mist, fontSize:14, fontWeight:300, maxWidth:300, margin:'0 auto' }}>Join 50,000+ food lovers who order consciously and eat beautifully.</p>
          </div>
        </div>
        <div className="login-form-side">
          <div className="login-form">
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:36, fontWeight:700, color:T.forest, marginBottom:6 }}>Welcome{tab==='login'?' back':''}! 👋</div>
            <p style={{ color:T.moss, fontSize:14, fontWeight:300, marginBottom:32 }}>
              {tab==='login'?'Sign in to your Terra Eats account':'Create your Terra Eats account'}
            </p>
            <div style={{ display:'flex', background:T.sand, borderRadius:12, padding:4, marginBottom:28 }}>
              {['login','signup'].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:'10px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
                  background:tab===t?'white':'transparent', color:tab===t?T.forest:T.moss,
                  boxShadow:tab===t?`0 2px 10px ${T.shadow}`:'none', transition:'all 0.2s' }}>{t==='login'?'Sign In':'Sign Up'}</button>
              ))}
            </div>
            {tab==='signup'&&(
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>Full Name</label>
                <input className="field" placeholder="Aarav Sharma" value={form.name} onChange={e=>setForm(x=>({...x,name:e.target.value}))} />
              </div>
            )}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>Email Address</label>
              <input className="field" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm(x=>({...x,email:e.target.value}))} />
            </div>
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.moss, letterSpacing:'0.08em', textTransform:'uppercase' }}>Password</label>
                {tab==='login'&&<span style={{ fontSize:12, color:T.sage, cursor:'pointer', fontWeight:500 }}>Forgot?</span>}
              </div>
              <input className="field" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(x=>({...x,password:e.target.value}))} />
            </div>
            <button className="btn-nature" style={{ width:'100%', fontSize:15, padding:'16px' }} onClick={submit} disabled={loading}>
              {loading?'🌿 Please wait…':tab==='login'?'Sign In →':'Create Account →'}
            </button>
            <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:T.moss }}>
              {tab==='login'?<>Don't have an account? <span style={{ color:T.sage, cursor:'pointer', fontWeight:600 }} onClick={()=>setTab('signup')}>Sign up</span></>:<>Have an account? <span style={{ color:T.sage, cursor:'pointer', fontWeight:600 }} onClick={()=>setTab('login')}>Sign in</span></>}
            </div>
            <div style={{ textAlign:'center', marginTop:32, fontSize:11, color:T.mist }}>🔒 256-bit SSL encrypted · Your data is safe</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── CHECKOUT PAGE ───────────────────────────────────────── */
function CheckoutPage({ cart, setCart, go }) {
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', city:'', pincode:'', notes:'' });
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});

  const sub = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const del = sub>299?0:29;
  const tax = Math.round(sub*.05);
  const total = sub+del+tax;

  const validate = () => {
    const e = {};
    if(!form.name.trim()) e.name = 'Name is required';
    if(!form.phone.trim()||!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter valid 10-digit mobile number';
    if(!form.address.trim()) e.address = 'Delivery address is required';
    if(!form.city.trim()) e.city = 'City is required';
    if(!form.pincode.trim()||!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter valid 6-digit pincode';
    return e;
  };

  const placeOrder = () => {
    const e = validate();
    if(Object.keys(e).length>0){ setErrors(e); return; }
    setPlacing(true);
    setTimeout(()=>{ setPlacing(false); setCart([]); go('track'); }, 2000);
  };

  if(cart.length===0) return (
    <div className="page" style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',textAlign:'center',padding:24 }}>
      <div style={{ fontSize:80,marginBottom:20 }}>🛒</div>
      <h2 className="serif" style={{ fontSize:36,fontWeight:700,color:T.forest,marginBottom:10 }}>Nothing to checkout</h2>
      <p style={{ color:T.moss,fontSize:15,fontWeight:300,marginBottom:32 }}>Add some delicious items to your cart first 🌿</p>
      <button className="btn-nature" style={{ fontSize:15 }} onClick={()=>go('explore')}>Explore Restaurants</button>
    </div>
  );

  const Field = ({ label, field, placeholder, type='text', half=false }) => (
    <div className="form-group" style={half?{}:{}}>
      <label>{label}</label>
      <input className="field" type={type} placeholder={placeholder} value={form[field]}
        onChange={e=>{ setForm(x=>({...x,[field]:e.target.value})); setErrors(x=>({...x,[field]:undefined})); }}
        style={errors[field]?{borderColor:'#E53E3E',boxShadow:'0 0 0 3px rgba(229,62,62,0.1)'}:{}} />
      {errors[field]&&<p style={{ marginTop:5,fontSize:11,color:'#E53E3E',fontWeight:600 }}>⚠ {errors[field]}</p>}
    </div>
  );

  const PAYMENT_OPTIONS = [
    { id:'cod',   icon:'💵', label:'Cash on Delivery',      sub:'Pay when your order arrives' },
    { id:'upi',   icon:'📱', label:'UPI / GPay / PhonePe',  sub:'Instant & secure payment' },
    { id:'card',  icon:'💳', label:'Credit / Debit Card',   sub:'Visa, Mastercard, RuPay' },
    { id:'wallet',icon:'👜', label:'Terra Wallet',           sub:'Balance: ₹0.00' },
  ];

  return (
    <div className="page">
      <div className="explore-hero">
        <div className="container">
          <button style={{ background:'none',border:'none',cursor:'pointer',fontSize:13,color:T.sage,fontWeight:600,padding:'0 0 12px',display:'flex',alignItems:'center',gap:6 }} onClick={()=>go('cart')}>
            ← Back to Cart
          </button>
          <span className="section-label">Final Step</span>
          <h1 className="serif" style={{ fontSize:'clamp(30px,4vw,52px)',fontWeight:700,color:T.forest }}>Checkout</h1>
          <p style={{ color:T.moss,fontSize:14,marginTop:6 }}>Review your order and enter delivery details</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop:40 }}>
        <div className="container">
          <div className="checkout-layout">

            {/* LEFT — Form */}
            <div>
              {/* Delivery Details */}
              <div className="checkout-section">
                <h3>📍 Delivery Details</h3>
                <Field label="Full Name" field="name" placeholder="Aarav Sharma" />
                <div className="form-row">
                  <Field label="Phone Number" field="phone" placeholder="9876543210" type="tel" half />
                  <Field label="Email (optional)" field="email" placeholder="you@email.com" type="email" half />
                </div>
                <Field label="Delivery Address" field="address" placeholder="Flat / House No, Street, Landmark" />
                <div className="form-row">
                  <Field label="City" field="city" placeholder="Bengaluru" half />
                  <Field label="Pincode" field="pincode" placeholder="560001" half />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label>Delivery Instructions (optional)</label>
                  <textarea className="field" placeholder="Leave at door, ring bell twice, avoid calling…" value={form.notes}
                    onChange={e=>setForm(x=>({...x,notes:e.target.value}))}
                    style={{ resize:'vertical',minHeight:80 }} />
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-section">
                <h3>💳 Payment Method</h3>
                {PAYMENT_OPTIONS.map(opt=>(
                  <div key={opt.id} className={`payment-option${payment===opt.id?' selected':''}`} onClick={()=>setPayment(opt.id)}>
                    <div className="payment-radio">
                      <div className="payment-radio-dot" />
                    </div>
                    <span style={{ fontSize:20 }}>{opt.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600,fontSize:14,color:T.forest }}>{opt.label}</div>
                      <div style={{ fontSize:12,color:T.moss,fontWeight:300 }}>{opt.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div>
              <div className="cart-summary" style={{ position:'sticky',top:90 }}>
                <h3 className="serif" style={{ fontSize:22,fontWeight:700,color:T.forest,marginBottom:20 }}>Order Summary</h3>

                {/* Items */}
                <div style={{ maxHeight:260,overflowY:'auto',marginBottom:16 }}>
                  {cart.map(item=>(
                    <div key={item.id} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
                      <div style={{ width:52,height:52,borderRadius:10,overflow:'hidden',flexShrink:0,border:`1px solid rgba(107,158,122,0.15)` }}>
                        <img src={item.img} alt={item.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontWeight:600,fontSize:13,color:T.forest,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{item.name}</div>
                        {item.restName&&<div style={{ fontSize:11,color:T.moss }}>🏪 {item.restName}</div>}
                        <div style={{ fontSize:11,color:T.moss }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontWeight:700,fontSize:13,color:T.leaf,flexShrink:0 }}>₹{item.price*item.qty}</div>
                    </div>
                  ))}
                </div>

                <hr style={{ border:'none',borderTop:`1px solid rgba(107,158,122,0.12)`,margin:'16px 0' }} />

                {/* Bill */}
                {[['Item Total',`₹${sub}`],['Delivery',del===0?'Free 🎉':`₹${del}`],['Taxes & Fees',`₹${tax}`]].map(([l,v])=>(
                  <div key={l} style={{ display:'flex',justifyContent:'space-between',marginBottom:12,fontSize:14 }}>
                    <span style={{ color:T.moss,fontWeight:300 }}>{l}</span>
                    <span style={{ color:T.forest,fontWeight:500 }}>{v}</span>
                  </div>
                ))}
                <hr style={{ border:'none',borderTop:`1px solid rgba(107,158,122,0.12)`,margin:'16px 0' }} />
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:20,fontWeight:700,marginBottom:6 }}>
                  <span className="serif">Grand Total</span>
                  <span style={{ color:T.leaf }}>₹{total}</span>
                </div>
                <div style={{ fontSize:12,color:T.moss,marginBottom:20,fontWeight:300 }}>
                  Payment via {PAYMENT_OPTIONS.find(o=>o.id===payment)?.label}
                </div>

                <button className="btn-nature" style={{ width:'100%',padding:'16px',fontSize:15 }} onClick={placeOrder} disabled={placing}>
                  {placing ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}>
                    <span style={{ display:'inline-block',width:16,height:16,border:'2.5px solid rgba(255,255,255,0.4)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
                    Placing your order…
                  </span> : `🌿 Place Order · ₹${total}`}
                </button>
                <p style={{ textAlign:'center',color:T.moss,fontSize:11,marginTop:12 }}>🔒 Secure & encrypted · 100% refund guarantee</p>
              </div>
            </div>

          </div>
        </div>
      </section>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Footer go={go} />
    </div>
  );
}

/* ─── RESTAURANTS PAGE ────────────────────────────────────── */
function RestaurantsPage({ go, goRestaurant }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rating');
  const [cuisine, setCuisine] = useState('All');
  const [offerOnly, setOfferOnly] = useState(false);
  const cuisines = ['All', ...Array.from(new Set(RESTAURANTS.map(r => r.cuisine)))];

  const list = RESTAURANTS
    .filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCuisine = cuisine === 'All' || r.cuisine === cuisine;
      const matchOffer = !offerOnly || !!r.discount;
      return matchSearch && matchCuisine && matchOffer;
    })
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'time' ? parseInt(a.time) - parseInt(b.time) : 0);

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${T.forest}, ${T.leaf})`, padding: '80px 0 90px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 4 C20 24 12 44 40 60 C68 44 60 24 40 4Z' fill='%238FBA99' fill-opacity='0.07'/%3E%3C/svg%3E")`, backgroundSize: '80px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Rv>
            <span className="section-label" style={{ color: T.fern }}>🏪 All Restaurants</span>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 10 }}>
              Discover Every<br /><em style={{ fontStyle: 'italic', fontWeight: 400 }}>Restaurant Near You</em>
            </h1>
            <p style={{ color: T.mist, fontSize: 15, fontWeight: 300, marginBottom: 32 }}>{RESTAURANTS.length} handpicked restaurants · Fresh menus · Fast delivery</p>
          </Rv>
          {/* Search bar */}
          <Rv delay={0.08}>
            <div style={{ background: 'white', borderRadius: 16, padding: '6px 6px 6px 18px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 640, boxShadow: `0 12px 40px rgba(0,0,0,0.15)` }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search restaurants, cuisines, dishes…"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: T.forest, background: 'transparent', padding: '10px 0' }}
              />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: T.moss }}>✕</button>}
              <button className="btn-nature" style={{ padding: '12px 24px', fontSize: 13, borderRadius: 12 }}>Search</button>
            </div>
          </Rv>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: T.snow, borderBottom: `1px solid rgba(107,158,122,0.1)`, padding: '18px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.moss, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Sort:</span>
            {[['rating', '⭐ Top Rated'], ['time', '⚡ Fastest']].map(([s, l]) => (
              <button key={s} className={`chip${sort === s ? ' active' : ''}`} onClick={() => setSort(s)}>{l}</button>
            ))}
            <div style={{ width: 1, height: 24, background: 'rgba(107,158,122,0.2)', margin: '0 4px' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.moss, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Cuisine:</span>
            {cuisines.map(c => (
              <button key={c} className={`chip${cuisine === c ? ' active' : ''}`} onClick={() => setCuisine(c)}>{c}</button>
            ))}
            <div style={{ width: 1, height: 24, background: 'rgba(107,158,122,0.2)', margin: '0 4px' }} />
            <button
              className={`chip${offerOnly ? ' active' : ''}`}
              onClick={() => setOfferOnly(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              🏷️ Offers Only
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Rv>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <p style={{ color: T.moss, fontSize: 13 }}>
                Showing <strong style={{ color: T.forest }}>{list.length}</strong> restaurant{list.length !== 1 ? 's' : ''}
                {search && <> matching <em>"{search}"</em></>}
              </p>
              {(search || cuisine !== 'All' || offerOnly) && (
                <button className="btn-outline" style={{ padding: '8px 16px', fontSize: 12 }} onClick={() => { setSearch(''); setCuisine('All'); setOfferOnly(false); }}>
                  Clear filters ✕
                </button>
              )}
            </div>
          </Rv>
          {list.length > 0 ? (
            <div className="rest-grid">
              {list.map((r, i) => (
                <Rv key={r.id} delay={i * 0.04}>
                  <div className="rest-card" onClick={() => goRestaurant(r.id)} style={{ cursor: 'pointer' }}>
                    <div className="rest-img">
                      <img src={r.img} alt={r.name} loading="lazy" />
                      {r.badge && <span className="rest-badge">{r.badge}</span>}
                      {r.discount && <span className="rest-discount">{r.discount}</span>}
                    </div>
                    <div className="rest-body">
                      <div className="rest-name">{r.name}</div>
                      <div className="rest-cuisine">{r.cuisine}</div>
                      <div className="rest-meta">
                        <Stars r={r.rating} />
                        <span className="rest-time">⏱ {r.time} min</span>
                        <span className="rest-price">{r.price}</span>
                      </div>
                      {r.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                          {r.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{ fontSize: 10, fontWeight: 600, color: T.sage, background: 'rgba(107,158,122,0.1)', borderRadius: 6, padding: '2px 8px' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Rv>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🌿</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: T.forest, marginBottom: 10 }}>No restaurants found</h3>
              <p style={{ color: T.moss, fontSize: 14, marginBottom: 24 }}>Try a different search or clear your filters</p>
              <button className="btn-outline" onClick={() => { setSearch(''); setCuisine('All'); setOfferOnly(false); }}>Clear filters</button>
            </div>
          )}
        </div>
      </section>
      <Footer go={go} />
    </div>
  );
}

/* ─── DISH RECOMMENDATIONS PAGE ───────────────────────────── */
function DishRecommendationsPage({ go, goRestaurant, addToCart, dishName }) {
  // Find all restaurants that serve this dish
  const restIds = DISH_RESTAURANTS[dishName] || [];
  const restaurants = restIds.map(id => RESTAURANTS.find(r => r.id === id)).filter(Boolean);

  // Find the dish item across all menus
  const dishItems = [];
  Object.entries(RESTAURANT_MENUS).forEach(([restId, categories]) => {
    Object.values(categories).forEach(items => {
      items.forEach(item => {
        if (item.name.toLowerCase() === dishName.toLowerCase()) {
          const rest = RESTAURANTS.find(r => r.id === Number(restId));
          if (rest) dishItems.push({ ...item, restName: rest.name, restId: rest.id, restRating: rest.rating, restTime: rest.time });
        }
      });
    });
  });

  // Also gather similar dishes (same category name or keyword match)
  const similarDishes = [];
  const keywords = dishName.toLowerCase().split(' ');
  Object.entries(RESTAURANT_MENUS).forEach(([restId, categories]) => {
    Object.values(categories).forEach(items => {
      items.forEach(item => {
        const isMatch = keywords.some(kw => kw.length > 3 && item.name.toLowerCase().includes(kw));
        const alreadyIncluded = dishItems.find(d => d.id === item.id);
        if (isMatch && !alreadyIncluded && item.name.toLowerCase() !== dishName.toLowerCase()) {
          const rest = RESTAURANTS.find(r => r.id === Number(restId));
          if (rest) similarDishes.push({ ...item, restName: rest.name, restId: rest.id });
        }
      });
    });
  });

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${T.earth}, ${T.bark})`, padding: '80px 0 90px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' fill='%23D4A017' fill-opacity='0.07'/%3E%3C/svg%3E")`, backgroundSize: '60px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Rv>
            <button
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 10, padding: '8px 18px', fontSize: 13, cursor: 'pointer', marginBottom: 20, fontWeight: 600 }}
              onClick={() => go('home')}
            >← Back to Home</button>
            <span style={{ display: 'inline-block', background: 'rgba(232,116,42,0.85)', color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 6, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>🍽️ Dish Finder</span>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 10 }}>
              {dishName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 300 }}>
              {restaurants.length > 0 ? `Available at ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} near you` : 'Searching across our partner restaurants'}
            </p>
          </Rv>
        </div>
      </div>

      {/* Dish versions across restaurants */}
      {dishItems.length > 0 && (
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="container">
            <Rv>
              <div className="section-head" style={{ marginBottom: 32 }}>
                <span className="section-label">🏪 Compare Versions</span>
                <h2 className="section-title">Where to Order {dishName}</h2>
                <p className="section-sub">Compare prices and ratings across restaurants</p>
              </div>
            </Rv>
            <div className="menu-items-grid">
              {dishItems.map((item, i) => (
                <Rv key={`${item.id}-${item.restId}`} delay={i * 0.06}>
                  <div className="menu-item-card" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => goRestaurant(item.restId)}>
                    <div className="menu-item-img">
                      <img src={item.img} alt={item.name} loading="lazy" />
                    </div>
                    <div className="menu-item-body">
                      <div className="menu-item-top">
                        <div style={{ fontSize: 11, color: T.sage, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                          🏪 {item.restName}
                          <span style={{ fontSize: 10, color: T.amber }}>★ {item.restRating}</span>
                          <span style={{ fontSize: 10, color: T.moss }}>⏱ {item.restTime} min</span>
                        </div>
                        <div className="menu-item-name">{item.name}</div>
                        <p className="menu-item-desc">{item.desc}</p>
                        {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                      </div>
                      <div className="menu-item-bottom">
                        <div className="menu-item-price">₹{item.price}</div>
                        <button className="menu-add-btn" onClick={e => { e.stopPropagation(); addToCart({ id: item.id, name: item.name, price: item.price, img: item.img, restName: item.restName }); }}>
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </Rv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Restaurants serving this dish */}
      {restaurants.length > 0 && (
        <section className="section" style={{ background: T.snow, paddingTop: 48 }}>
          <div className="container">
            <Rv>
              <div className="section-head" style={{ marginBottom: 32 }}>
                <span className="section-label">📍 Nearby Options</span>
                <h2 className="section-title">Restaurants Serving This Dish</h2>
                <p className="section-sub">Click to view the full menu</p>
              </div>
            </Rv>
            <div className="rest-grid">
              {restaurants.map((r, i) => (
                <Rv key={r.id} delay={i * 0.07}>
                  <div className="rest-card" onClick={() => goRestaurant(r.id)} style={{ cursor: 'pointer' }}>
                    <div className="rest-img">
                      <img src={r.img} alt={r.name} loading="lazy" />
                      {r.badge && <span className="rest-badge">{r.badge}</span>}
                      {r.discount && <span className="rest-discount">{r.discount}</span>}
                    </div>
                    <div className="rest-body">
                      <div className="rest-name">{r.name}</div>
                      <div className="rest-cuisine">{r.cuisine}</div>
                      <div className="rest-meta">
                        <Stars r={r.rating} />
                        <span className="rest-time">⏱ {r.time} min</span>
                        <span className="rest-price">{r.price}</span>
                      </div>
                    </div>
                  </div>
                </Rv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Similar dishes */}
      {similarDishes.length > 0 && (
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="container">
            <Rv>
              <div className="section-head" style={{ marginBottom: 32 }}>
                <span className="section-label">✨ You Might Also Like</span>
                <h2 className="section-title">Similar Dishes</h2>
              </div>
            </Rv>
            <div className="menu-items-grid">
              {similarDishes.slice(0, 6).map((item, i) => (
                <Rv key={`sim-${item.id}`} delay={i * 0.05}>
                  <div className="menu-item-card">
                    <div className="menu-item-img"><img src={item.img} alt={item.name} loading="lazy" /></div>
                    <div className="menu-item-body">
                      <div className="menu-item-top">
                        <div style={{ fontSize: 11, color: T.sage, fontWeight: 700, marginBottom: 4 }}>🏪 {item.restName}</div>
                        <div className="menu-item-name">{item.name}</div>
                        <p className="menu-item-desc">{item.desc}</p>
                      </div>
                      <div className="menu-item-bottom">
                        <div className="menu-item-price">₹{item.price}</div>
                        <button className="menu-add-btn" onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, img: item.img, restName: item.restName })}>+ Add</button>
                      </div>
                    </div>
                  </div>
                </Rv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {restaurants.length === 0 && dishItems.length === 0 && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, color: T.forest, marginBottom: 10 }}>Dish not found</h3>
            <p style={{ color: T.moss, fontSize: 14, marginBottom: 28 }}>We couldn't find "{dishName}" at any restaurant right now</p>
            <button className="btn-nature" onClick={() => go('explore')}>Explore All Restaurants</button>
          </div>
        </section>
      )}

      <Footer go={go} />
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [cart, setCart] = useState(DEFAULT_CART);
  const [toast, setToast] = useState(null);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const cnt = cart.reduce((s,c)=>s+c.qty,0);

  const addToCart = useCallback((item)=>{
    if (item._remove) {
      setCart(p => p.map(c => c.id === item.id ? {...c, qty: Math.max(0, c.qty - 1)} : c).filter(c => c.qty > 0));
      return;
    }
    setCart(p=>{ const ex=p.find(c=>c.id===item.id); return ex?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1}]; });
    setToast(`${item.name} added to cart 🌿`);
    setTimeout(()=>setToast(null),2200);
  },[]);

  const go = useCallback((p, params={})=>{
    setPage(p);
    setPageParams(params);
    window.scrollTo({top:0,behavior:'smooth'});
  },[]);

  const goRestaurant = useCallback((restId)=>{
    const rest = RESTAURANTS.find(r => r.id === restId);
    if (rest) {
      setActiveRestaurant(rest);
      setPage('restaurant');
      window.scrollTo({top:0,behavior:'smooth'});
    }
  },[]);

  const goDish = useCallback((dishName)=>{
    setPageParams({ dishName });
    setPage('dish');
    window.scrollTo({top:0,behavior:'smooth'});
  },[]);

  // Restaurant menu page
  if (page === 'restaurant' && activeRestaurant) {
    return (
      <AuthContext.Provider value={{ user, setUser }}>
        <style>{CSS}</style>
        <Navbar page={page} go={go} cnt={cnt} user={user} />
        <div key={`rest-${activeRestaurant.id}`}>
          <RestaurantMenuPage restaurant={activeRestaurant} cart={cart} addToCart={addToCart} go={go} />
        </div>
        <MobNav page={page} go={go} cnt={cnt} />
        {toast && <div className="toast">{toast}</div>}
      </AuthContext.Provider>
    );
  }

  // Dish recommendations page
  if (page === 'dish' && pageParams.dishName) {
    return (
      <AuthContext.Provider value={{ user, setUser }}>
        <style>{CSS}</style>
        <Navbar page={page} go={go} cnt={cnt} user={user} />
        <div key={`dish-${pageParams.dishName}`}>
          <DishRecommendationsPage dishName={pageParams.dishName} go={go} goRestaurant={goRestaurant} addToCart={addToCart} />
        </div>
        <MobNav page={page} go={go} cnt={cnt} />
        {toast && <div className="toast">{toast}</div>}
      </AuthContext.Provider>
    );
  }

  const PAGES = {
    home: (props) => <HomePage {...props} goRestaurant={goRestaurant} goDish={goDish} />,
    restaurants: (props) => <RestaurantsPage {...props} goRestaurant={goRestaurant} />,
    explore: (props) => <ExplorePage {...props} goRestaurant={goRestaurant} initCat={pageParams.catFilter} />,
    about: AboutPage,
    cart: CartPage,
    checkout: (props) => <CheckoutPage {...props} />,
    track: TrackPage,
    offers: OffersPage,
    help: HelpPage,
    login: LoginPage,
  };

  const PageComp = PAGES[page] || PAGES.home;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <style>{CSS}</style>
      {page !== 'login' && <Navbar page={page} go={go} cnt={cnt} user={user} />}
      <div key={page}>
        <PageComp go={go} cart={cart} setCart={setCart} addToCart={addToCart} />
      </div>
      {page !== 'login' && <MobNav page={page} go={go} cnt={cnt} />}
      {toast && <div className="toast">{toast}</div>}
    </AuthContext.Provider>
  );
}