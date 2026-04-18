import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const riderIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function TrackingMap({ step }) {
  const [riderPosition, setRiderPosition] = useState([12.9716, 77.5946]); // Bangalore coordinates
  const restaurantPos = [12.9716, 77.5946];
  const userPos = [12.9352, 77.6245]; // Mysuru approx

  const routePoints = [
    restaurantPos,
    [12.965, 77.598],
    [12.955, 77.605],
    [12.945, 77.612],
    [12.935, 77.618],
    userPos
  ];

  useEffect(() => {
    if (step >= 2) {
      const interval = setInterval(() => {
        setRiderPosition(prev => {
          const currentIndex = routePoints.findIndex(point =>
            Math.abs(point[0] - prev[0]) < 0.001 && Math.abs(point[1] - prev[1]) < 0.001
          );
          if (currentIndex < routePoints.length - 1) {
            return routePoints[currentIndex + 1];
          }
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step, routePoints]);

  const currentRoute = step >= 2 ? routePoints.slice(0, routePoints.findIndex(point =>
    Math.abs(point[0] - riderPosition[0]) < 0.001 && Math.abs(point[1] - riderPosition[1]) < 0.001
  ) + 1) : [restaurantPos];

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={[12.9538, 77.6075]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={restaurantPos} icon={restaurantIcon}>
          <Popup>🏪 Spice Garden, MG Road</Popup>
        </Marker>
        <Marker position={userPos} icon={userIcon}>
          <Popup>📍 Your Location, Mysuru</Popup>
        </Marker>
        {step >= 2 && (
          <Marker position={riderPosition} icon={riderIcon}>
            <Popup>🛵 Rajan Kumar - Rider</Popup>
          </Marker>
        )}
        {step >= 2 && (
          <Polyline
            positions={currentRoute}
            color="#E8742A"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}