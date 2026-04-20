import { useState, useMemo, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   🌿 TERRA EATS — Smart Dish Comparison Feature
   ─────────────────────────────────────────────────────────────
   Components exported:
   · DishComparisonDashboard  — full page comparison view
   · DishSelector             — dish search / picker trigger
   · CompareCard              — single restaurant comparison card
   · SortBar                  — sort controls bar
   · CompareBadge             — "Best Deal" / "Most Popular" badge

   Usage in App.jsx:
   1. Import this file alongside App_Premium.jsx
   2. In the 'dish' page branch inside renderPage(), replace
      <DishRecommendationsPage> with:
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
   ══════════════════════════════════════════════════════════════ */

/* ─── DESIGN TOKENS (mirrors App_Premium.jsx T object) ──────── */
const DEFAULT_T = {
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

/* ─── SORT OPTIONS ────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { key: "bestValue",   label: "Best Value",     icon: "✦" },
  { key: "price_asc",  label: "Price: Low–High", icon: "↑" },
  { key: "price_desc", label: "Price: High–Low", icon: "↓" },
  { key: "rating",     label: "Top Rated",       icon: "★" },
  { key: "time",       label: "Fastest",         icon: "⚡" },
];

/* ─── HELPERS ─────────────────────────────────────────────────── */
function parseTime(timeStr = "25-30") {
  const parts = timeStr.split("-").map(Number);
  return parts[0] || 30;
}

function computeScore(price, rating) {
  // higher rating per rupee = better value
  return (rating / price) * 1000;
}

function getDishFromMenus(restaurantId, dishName, RESTAURANT_MENUS) {
  const menu = RESTAURANT_MENUS[restaurantId];
  if (!menu) return null;
  for (const category of Object.values(menu)) {
    const found = category.find(
      (d) => d.name.toLowerCase() === dishName.toLowerCase()
    );
    if (found) return found;
  }
  return null;
}

/* ─── COMPARE BADGE ──────────────────────────────────────────── */
export function CompareBadge({ type, T: colors }) {
  const C = colors || DEFAULT_T;
  const configs = {
    bestDeal:    { label: "Best Deal",     bg: "#1A7A4A", color: "#E8F7EF" },
    mostPopular: { label: "Most Popular",  bg: "#C45B1A", color: "#FDF2EB" },
    fastestDel:  { label: "Fastest",       bg: "#1A5A8A", color: "#EBF3FD" },
    topRated:    { label: "Top Rated",     bg: "#7A4A1A", color: "#FDF5EB" },
  };
  const cfg = configs[type];
  if (!cfg) return null;
  return (
    <span style={{
      display:       "inline-block",
      background:    cfg.bg,
      color:         cfg.color,
      fontSize:      10,
      fontWeight:    700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding:       "4px 10px",
      borderRadius:  20,
      whiteSpace:    "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

/* ─── SORT BAR ───────────────────────────────────────────────── */
export function SortBar({ active, onChange, T: colors }) {
  const C = colors || DEFAULT_T;
  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      gap:            8,
      flexWrap:       "wrap",
      padding:        "14px 0",
      borderBottom:   `1px solid rgba(107,158,122,0.12)`,
      marginBottom:   24,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.moss, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 4, flexShrink: 0 }}>
        Sort by
      </span>
      {SORT_OPTIONS.map((opt) => {
        const isActive = active === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           5,
              padding:       "7px 14px",
              borderRadius:  20,
              border:        isActive ? `1.5px solid ${C.sage}` : `1px solid rgba(107,158,122,0.22)`,
              background:    isActive ? C.forest : "white",
              color:         isActive ? "white" : C.moss,
              fontSize:      12,
              fontWeight:    isActive ? 700 : 500,
              cursor:        "pointer",
              transition:    "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              whiteSpace:    "nowrap",
            }}
          >
            <span style={{ fontSize: 13 }}>{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── COMPARE CARD ───────────────────────────────────────────── */
export function CompareCard({
  restaurant,
  dish,
  badges,
  isBest,
  onAddToCart,
  onGoRestaurant,
  T: colors,
  rank,
}) {
  const C = colors || DEFAULT_T;
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    onAddToCart({ ...dish, restaurantId: restaurant.id, restaurantName: restaurant.name });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [dish, restaurant, onAddToCart]);

  const deliveryMin = parseTime(restaurant.time);

  /* Meter: normalise rating to 0–100 */
  const ratingPct = ((dish.rating - 3.5) / 1.5) * 100;

  return (
    <div style={{
      background:    "white",
      borderRadius:  18,
      overflow:      "hidden",
      border:        isBest
        ? `2px solid ${C.sage}`
        : `1px solid rgba(107,158,122,0.14)`,
      boxShadow:     isBest
        ? `0 8px 32px rgba(74,124,89,0.18)`
        : `0 4px 16px rgba(26,58,42,0.07)`,
      transition:    "transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s",
      position:      "relative",
      display:       "flex",
      flexDirection: "column",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = isBest
        ? `0 16px 40px rgba(74,124,89,0.25)`
        : `0 10px 30px rgba(26,58,42,0.13)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = isBest
        ? `0 8px 32px rgba(74,124,89,0.18)`
        : `0 4px 16px rgba(26,58,42,0.07)`;
    }}
    >
      {/* Rank ribbon */}
      <div style={{
        position:    "absolute",
        top:         14,
        left:        14,
        width:       28,
        height:      28,
        borderRadius: "50%",
        background:  rank === 1 ? C.forest : "rgba(107,158,122,0.15)",
        color:       rank === 1 ? "white" : C.moss,
        fontSize:    12,
        fontWeight:  700,
        display:     "flex",
        alignItems:  "center",
        justifyContent: "center",
        zIndex:      3,
      }}>
        {rank}
      </div>

      {/* Dish image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={dish.img}
          alt={dish.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.4s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,58,42,0.45) 0%, transparent 60%)",
        }} />
        {/* Badges row */}
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
          {badges.map((b) => <CompareBadge key={b} type={b} T={C} />)}
        </div>
        {/* Veg indicator */}
        <div style={{
          position: "absolute", bottom: 10, left: 10,
          width: 18, height: 18, borderRadius: 3,
          border: `2px solid ${dish.veg ? "#2E7D32" : "#B71C1C"}`,
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: dish.veg ? "#2E7D32" : "#B71C1C",
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>

        {/* Restaurant name */}
        <button
          onClick={() => onGoRestaurant(restaurant.id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            textAlign: "left", padding: 0, marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: C.sage, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {restaurant.name}
          </span>
        </button>

        {/* Dish name */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 19, fontWeight: 700,
          color: C.forest, lineHeight: 1.2,
          marginBottom: 6,
        }}>
          {dish.name}
        </div>

        {/* Desc */}
        <p style={{
          fontSize: 12, color: C.moss, fontWeight: 300,
          lineHeight: 1.55, marginBottom: 14,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {dish.desc}
        </p>

        {/* Metrics row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 14,
        }}>
          {/* Price */}
          <div style={{
            background: "rgba(26,58,42,0.04)", borderRadius: 10,
            padding: "10px 8px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: C.forest, lineHeight: 1 }}>
              ₹{dish.price}
            </div>
            <div style={{ fontSize: 10, color: C.moss, fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Price
            </div>
          </div>
          {/* Rating */}
          <div style={{
            background: "rgba(212,160,23,0.06)", borderRadius: 10,
            padding: "10px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.amber, lineHeight: 1 }}>
              ★ {dish.rating}
            </div>
            <div style={{ fontSize: 10, color: C.moss, fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Rating
            </div>
          </div>
          {/* Delivery */}
          <div style={{
            background: "rgba(74,124,89,0.06)", borderRadius: 10,
            padding: "10px 8px", textAlign: "center",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.sage, lineHeight: 1 }}>
              {restaurant.time}
            </div>
            <div style={{ fontSize: 10, color: C.moss, fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              mins
            </div>
          </div>
        </div>

        {/* Rating bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: C.moss, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rating quality</span>
            <span style={{ fontSize: 10, color: C.sage, fontWeight: 700 }}>{dish.rating} / 5.0</span>
          </div>
          <div style={{ height: 5, background: "rgba(107,158,122,0.12)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min(100, Math.max(0, ratingPct))}%`,
              background: `linear-gradient(90deg, ${C.fern}, ${C.sage})`,
              borderRadius: 99,
              transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
            }} />
          </div>
        </div>

        {/* Discount chip if any */}
        {restaurant.discount && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(232,116,42,0.08)", border: "1px solid rgba(232,116,42,0.2)",
            borderRadius: 8, padding: "5px 10px",
            fontSize: 11, fontWeight: 700, color: C.dusk,
            marginBottom: 14, alignSelf: "flex-start",
          }}>
            🏷 {restaurant.discount}
          </div>
        )}

        {/* CTA */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button
            onClick={handleAdd}
            style={{
              flex:          1,
              padding:       "11px 0",
              borderRadius:  10,
              border:        "none",
              background:    added ? "#2E7D32" : C.forest,
              color:         "white",
              fontSize:      13,
              fontWeight:    700,
              cursor:        "pointer",
              transition:    "all 0.25s",
              letterSpacing: "0.02em",
            }}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
          <button
            onClick={() => onGoRestaurant(restaurant.id)}
            style={{
              padding:    "11px 16px",
              borderRadius: 10,
              border:     `1.5px solid rgba(107,158,122,0.25)`,
              background: "white",
              color:      C.sage,
              fontSize:   13,
              fontWeight: 700,
              cursor:     "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.forest; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = C.sage; }}
          >
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── BEST VALUE HIGHLIGHT BAR ──────────────────────────────── */
function BestValueBar({ winner, T: C }) {
  if (!winner) return null;
  return (
    <div style={{
      background:    `linear-gradient(135deg, ${C.forest} 0%, ${C.leaf} 100%)`,
      borderRadius:  14,
      padding:       "18px 24px",
      marginBottom:  28,
      display:       "flex",
      alignItems:    "center",
      gap:           18,
      flexWrap:      "wrap",
    }}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>✦</div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.fern, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
          Best Value Pick
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
          {winner.dishName} · {winner.restaurantName}
        </div>
        <div style={{ fontSize: 13, color: C.mist, fontWeight: 300, marginTop: 4 }}>
          ₹{winner.price} · ★ {winner.rating} · {winner.time} min delivery
        </div>
      </div>
      <div style={{
        background:  "rgba(255,255,255,0.12)",
        border:      "1px solid rgba(255,255,255,0.2)",
        borderRadius: 10, padding: "10px 18px",
        textAlign:   "center",
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "white" }}>
          {winner.score.toFixed(1)}
        </div>
        <div style={{ fontSize: 10, color: C.fern, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Value Score
        </div>
      </div>
    </div>
  );
}

/* ─── DISH SELECTOR ──────────────────────────────────────────── */
export function DishSelector({ dishes, selected, onChange, T: colors }) {
  const C = colors || DEFAULT_T;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => dishes.filter((d) => d.toLowerCase().includes(query.toLowerCase())),
    [dishes, query]
  );

  return (
    <div style={{ position: "relative", maxWidth: 400 }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width:        "100%",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "space-between",
          gap:          12,
          padding:      "12px 18px",
          borderRadius: 12,
          border:       `1.5px solid rgba(107,158,122,0.3)`,
          background:   "white",
          color:        C.forest,
          fontSize:     14,
          fontWeight:   600,
          cursor:       "pointer",
          boxShadow:    "0 2px 8px rgba(26,58,42,0.06)",
        }}
      >
        <span>{selected || "Select a dish to compare"}</span>
        <span style={{ fontSize: 18, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>⌄</span>
      </button>

      {open && (
        <div style={{
          position:   "absolute",
          top:        "calc(100% + 8px)",
          left:       0, right: 0,
          background: "white",
          borderRadius: 14,
          border:     `1px solid rgba(107,158,122,0.18)`,
          boxShadow:  `0 12px 40px rgba(26,58,42,0.15)`,
          zIndex:     200,
          overflow:   "hidden",
        }}>
          <div style={{ padding: 10, borderBottom: `1px solid rgba(107,158,122,0.1)` }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dish…"
              style={{
                width:      "100%",
                border:     `1px solid rgba(107,158,122,0.2)`,
                borderRadius: 8,
                padding:    "8px 12px",
                fontSize:   13,
                color:      C.forest,
                outline:    "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "16px", fontSize: 13, color: C.moss, textAlign: "center" }}>No dishes found</div>
            )}
            {filtered.map((d) => (
              <button
                key={d}
                onClick={() => { onChange(d); setOpen(false); setQuery(""); }}
                style={{
                  width:      "100%",
                  textAlign:  "left",
                  padding:    "10px 16px",
                  background: d === selected ? "rgba(74,124,89,0.07)" : "white",
                  border:     "none",
                  fontSize:   13,
                  fontWeight: d === selected ? 700 : 400,
                  color:      d === selected ? C.forest : C.moss,
                  cursor:     "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (d !== selected) e.currentTarget.style.background = "rgba(74,124,89,0.04)"; }}
                onMouseLeave={(e) => { if (d !== selected) e.currentTarget.style.background = "white"; }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN DASHBOARD ─────────────────────────────────────────── */
export function DishComparisonDashboard({
  dishName: initialDishName = null,
  go,
  goRestaurant,
  addToCart,
  RESTAURANTS,
  RESTAURANT_MENUS,
  DISH_RESTAURANTS,
  T: externalT,
}) {
  const C = externalT || DEFAULT_T;

  /* All comparable dish names (appear in ≥2 restaurants or any) */
  const allDishNames = useMemo(
    () => Object.keys(DISH_RESTAURANTS || {}),
    [DISH_RESTAURANTS]
  );

  const [selectedDish, setSelectedDish] = useState(initialDishName || allDishNames[0] || "");
  const [sortKey, setSortKey] = useState("bestValue");

  /* Build comparison entries */
  const entries = useMemo(() => {
    if (!selectedDish) return [];
    const restIds = (DISH_RESTAURANTS || {})[selectedDish] || [];
    return restIds.map((restId) => {
      const restaurant = RESTAURANTS.find((r) => r.id === restId);
      const dish = getDishFromMenus(restId, selectedDish, RESTAURANT_MENUS);
      if (!restaurant || !dish) return null;
      return {
        restaurant,
        dish,
        score: computeScore(dish.price, dish.rating),
        deliveryMin: parseTime(restaurant.time),
      };
    }).filter(Boolean);
  }, [selectedDish, DISH_RESTAURANTS, RESTAURANTS, RESTAURANT_MENUS]);

  /* Sort */
  const sorted = useMemo(() => {
    const arr = [...entries];
    switch (sortKey) {
      case "price_asc":  arr.sort((a, b) => a.dish.price - b.dish.price); break;
      case "price_desc": arr.sort((a, b) => b.dish.price - a.dish.price); break;
      case "rating":     arr.sort((a, b) => b.dish.rating - a.dish.rating); break;
      case "time":       arr.sort((a, b) => a.deliveryMin - b.deliveryMin); break;
      case "bestValue":
      default:           arr.sort((a, b) => b.score - a.score); break;
    }
    return arr;
  }, [entries, sortKey]);

  /* Identify badge winners */
  const bestValueEntry   = entries.length ? [...entries].sort((a, b) => b.score - a.score)[0] : null;
  const cheapestEntry    = entries.length ? [...entries].sort((a, b) => a.dish.price - b.dish.price)[0] : null;
  const topRatedEntry    = entries.length ? [...entries].sort((a, b) => b.dish.rating - a.dish.rating)[0] : null;
  const fastestEntry     = entries.length ? [...entries].sort((a, b) => a.deliveryMin - b.deliveryMin)[0] : null;
  const mostPopularEntry = entries.find((e) => e.dish.badge && ["Bestseller", "Most Ordered", "Popular", "Top Rated"].includes(e.dish.badge));

  function getBadgesFor(entry) {
    const badges = [];
    if (bestValueEntry && entry.restaurant.id === bestValueEntry.restaurant.id) badges.push("bestDeal");
    if (mostPopularEntry && entry.restaurant.id === mostPopularEntry.restaurant.id) badges.push("mostPopular");
    if (fastestEntry && entry.restaurant.id === fastestEntry.restaurant.id && entries.length > 1) badges.push("fastestDel");
    if (topRatedEntry && entry.restaurant.id === topRatedEntry.restaurant.id && !badges.includes("bestDeal")) badges.push("topRated");
    return badges;
  }

  /* Aggregate stats for summary strip */
  const avgPrice  = entries.length ? Math.round(entries.reduce((s, e) => s + e.dish.price, 0) / entries.length) : 0;
  const avgRating = entries.length ? (entries.reduce((s, e) => s + e.dish.rating, 0) / entries.length).toFixed(1) : "—";
  const avgTime   = entries.length ? Math.round(entries.reduce((s, e) => s + e.deliveryMin, 0) / entries.length) : 0;

  const isBestCard = (entry) =>
    bestValueEntry && entry.restaurant.id === bestValueEntry.restaurant.id;

  return (
    <div className="page" style={{ background: C.snow, minHeight: "100vh" }}>

      {/* ── Hero header ───────────────────────────────────── */}
      <div style={{
        background:     `linear-gradient(135deg, ${C.forest} 0%, ${C.leaf} 55%, ${C.sage} 100%)`,
        padding:        "76px 0 52px",
        position:       "relative",
        overflow:       "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

        <div className="container">
          <button
            onClick={() => go("home")}
            style={{ background:"none", border:"none", color:C.fern, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:20, display:"flex", alignItems:"center", gap:6 }}
          >
            ← Back
          </button>

          <span style={{ fontSize:10, fontWeight:700, color:C.fern, letterSpacing:"0.14em", textTransform:"uppercase", display:"block", marginBottom:10 }}>
            ✦ Smart Comparison
          </span>

          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:700, color:"white", lineHeight:1.1, marginBottom:14, textShadow:"0 3px 20px rgba(0,0,0,0.3)" }}>
            Compare & Choose
          </h1>
          <p style={{ color:C.mist, fontSize:15, fontWeight:300, marginBottom:28, maxWidth:480, lineHeight:1.65 }}>
            One dish, multiple restaurants. See price, rating, and delivery time side-by-side and pick the best deal.
          </p>

          {/* Dish selector */}
          <DishSelector
            dishes={allDishNames}
            selected={selectedDish}
            onChange={setSelectedDish}
            T={C}
          />
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────── */}
      {entries.length > 0 && (
        <div style={{ background:"white", borderBottom:`1px solid rgba(107,158,122,0.1)` }}>
          <div className="container">
            <div style={{ display:"flex", gap:0, flexWrap:"wrap" }}>
              {[
                { label:"Restaurants offering", value:entries.length, unit:"", icon:"🏪" },
                { label:"Avg price", value:`₹${avgPrice}`, unit:"", icon:"💰" },
                { label:"Avg rating", value:`★ ${avgRating}`, unit:"", icon:"⭐" },
                { label:"Avg delivery", value:`${avgTime}`, unit:"min", icon:"🛵" },
                { label:"Price range", value:`₹${cheapestEntry ? cheapestEntry.dish.price : "—"}–₹${entries.length > 0 ? Math.max(...entries.map(e => e.dish.price)) : "—"}`, unit:"", icon:"📊" },
              ].map((stat, i) => (
                <div key={stat.label} style={{
                  flex:         "1 1 140px",
                  padding:      "18px 20px",
                  borderRight:  i < 4 ? `1px solid rgba(107,158,122,0.1)` : "none",
                  minWidth:     140,
                }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{stat.icon}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:700, color:C.forest, lineHeight:1 }}>
                    {stat.value}<span style={{ fontSize:13, fontWeight:400, color:C.moss, marginLeft:3 }}>{stat.unit}</span>
                  </div>
                  <div style={{ fontSize:10, color:C.moss, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginTop:4 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────── */}
      <section style={{ padding:"36px 0 80px" }}>
        <div className="container">

          {!selectedDish && (
            <div style={{ textAlign:"center", padding:"80px 0", color:C.moss }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🍽️</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:C.forest, marginBottom:8 }}>Select a dish above</div>
              <div style={{ fontSize:14, fontWeight:300 }}>Pick any dish to see it across multiple restaurants</div>
            </div>
          )}

          {selectedDish && entries.length === 0 && (
            <div style={{ textAlign:"center", padding:"80px 0", color:C.moss }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🤔</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:C.forest, marginBottom:8 }}>No restaurants found</div>
              <div style={{ fontSize:14, fontWeight:300 }}>Try another dish</div>
            </div>
          )}

          {selectedDish && entries.length > 0 && (
            <>
              {/* Best value banner */}
              {bestValueEntry && (
                <BestValueBar
                  winner={{
                    dishName:       bestValueEntry.dish.name,
                    restaurantName: bestValueEntry.restaurant.name,
                    price:          bestValueEntry.dish.price,
                    rating:         bestValueEntry.dish.rating,
                    time:           bestValueEntry.restaurant.time,
                    score:          bestValueEntry.score,
                  }}
                  T={C}
                />
              )}

              {/* Sort bar */}
              <SortBar active={sortKey} onChange={setSortKey} T={C} />

              {/* Cards grid */}
              <div style={{
                display:               "grid",
                gridTemplateColumns:   "repeat(auto-fill, minmax(290px, 1fr))",
                gap:                   22,
              }}>
                {sorted.map((entry, i) => (
                  <CompareCard
                    key={entry.restaurant.id}
                    restaurant={entry.restaurant}
                    dish={entry.dish}
                    badges={getBadgesFor(entry)}
                    isBest={isBestCard(entry)}
                    onAddToCart={addToCart}
                    onGoRestaurant={goRestaurant}
                    T={C}
                    rank={i + 1}
                  />
                ))}
              </div>

              {/* Bottom info note */}
              {entries.length > 1 && (
                <div style={{
                  marginTop:   32, borderTop:`1px solid rgba(107,158,122,0.1)`,
                  paddingTop:  24, display:"flex", alignItems:"center", gap:10,
                  flexWrap:    "wrap",
                }}>
                  <span style={{ fontSize:13, color:C.moss, fontWeight:300 }}>
                    ✦ <strong style={{ fontWeight:700, color:C.forest }}>Best Deal</strong> is calculated by rating-per-rupee value score.
                    &nbsp;Prices and times may vary. Always check restaurant page for live data.
                  </span>
                  <button
                    onClick={() => go("explore")}
                    style={{ marginLeft:"auto", background:"none", border:`1px solid rgba(107,158,122,0.3)`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, color:C.sage, cursor:"pointer" }}
                  >
                    Explore All →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}