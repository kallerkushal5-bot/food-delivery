import { useState, useEffect } from 'react';
import TrackingMap from './TrackingMap';
import { Clock, MapPin, Phone, Star } from 'lucide-react';

const TRACK_STEPS = [
  { label: "Order Placed", icon: "📋", desc: "Confirmed & being processed" },
  { label: "Preparing", icon: "👨‍🍳", desc: "Chef is crafting your meal" },
  { label: "Out for Delivery", icon: "🛵", desc: "Rider heading your way" },
  { label: "Delivered", icon: "🎉", desc: "Enjoy your meal!" },
];

export default function TrackPage({ go }) { // eslint-disable-line no-unused-vars
  const [step, setStep] = useState(1);
  const [sim, setSim] = useState(false);

  useEffect(() => {
    if (!sim) return;
    const tm = setTimeout(() => {
      setStep(s => {
        const nextStep = s + 1;
        if (nextStep >= 3) {
          setSim(false);
        }
        return nextStep;
      });
    }, 3000);
    return () => clearTimeout(tm);
  }, [sim]);

  return (
    <div className="page">
      {/* Banner */}
      <div className="page-banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1>Live Order Tracking</h1>
          <p>Follow your food journey in real-time</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1000px', padding: '40px 20px' }}>
        <div className="tracking-dashboard">
          {/* Order Info */}
          <div className="tracking-header">
            <div className="order-info">
              <h2>Order #TE28741</h2>
              <p>Spice Garden • Estimated {step === 3 ? 'Delivered ✓' : '18 min'}</p>
            </div>
            <div className="delivery-time">
              <Clock size={20} />
              <span>{step < 3 ? `${18 - step * 5} min` : 'Delivered!'}</span>
            </div>
          </div>

          {/* Map */}
          <div className="tracking-map">
            <TrackingMap step={step} />
          </div>

          {/* Progress Steps */}
          <div className="tracking-steps">
            {TRACK_STEPS.map((s, i) => (
              <div key={s.label} className={`step ${i < step ? 'completed' : i === step ? 'active' : ''}`}>
                <div className="step-icon">{s.icon}</div>
                <div className="step-content">
                  <h4>{s.label}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Details */}
          <div className="delivery-details">
            <div className="detail-card">
              <MapPin size={20} />
              <div>
                <h4>From</h4>
                <p>🏪 Spice Garden, MG Road</p>
              </div>
            </div>
            <div className="detail-card">
              <MapPin size={20} />
              <div>
                <h4>To</h4>
                <p>📍 Your Location, Mysuru</p>
              </div>
            </div>
            {step >= 2 && (
              <div className="rider-card">
                <div className="rider-info">
                  <div className="rider-avatar">🛵</div>
                  <div>
                    <h4>Rajan Kumar</h4>
                    <div className="rider-rating">
                      <Star size={14} fill="currentColor" />
                      <span>4.9 rating</span>
                    </div>
                  </div>
                </div>
                <button className="btn-outline">
                  <Phone size={16} />
                  Contact
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="tracking-controls">
            <button
              className="btn-primary"
              onClick={() => { setSim(true); }}
              disabled={sim || step >= 3}
            >
              {sim ? '🛵 Simulating...' : step >= 3 ? 'Order Delivered! 🎉' : '▶ Simulate Delivery'}
            </button>
            <button className="btn-outline" onClick={() => setStep(1)}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}