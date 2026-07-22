import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { QuestResponse } from '../types';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const svg_flag = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-check-inside-icon lucide-map-pin-check-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m9 10 2 2 4-4"/></svg>
`;

// Red flag icon for user location
const userLocationIcon = L.icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(svg_flag)}`,
  iconSize: [32, 40],
  iconAnchor: [2, 40],
  popupAnchor: [15, -35],
});

type QuestMapProps = {
  quests: QuestResponse[];
  center: [number, number];
  userLocation?: [number, number] | null;
  onSelectQuest?: (questId: string) => void;
};

export function QuestMap({ quests, center, userLocation, onSelectQuest }: QuestMapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      scrollWheelZoom 
      className="h-[500px] w-full"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Location Marker - Red Flag */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={userLocationIcon}
          zIndexOffset={1000}
        >
          <Popup>
            <div className="p-2">
              <p className="font-bold text-red-600">📍 Your Location</p>
              <p className="text-xs text-slate-600">
                {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Quest Markers */}
      {quests.map((quest) => (
        <Marker
          key={quest.id}
          position={[quest.latitude, quest.longitude]}
          icon={markerIcon}
          eventHandlers={{ 
            click: () => onSelectQuest?.(quest.id),
          }}
        >
          <Popup className="custom-popup">
            <div className="min-w-[220px] p-2">
              <h3 className="mb-2 text-base font-bold text-slate-900">{quest.title}</h3>
              <p className="mb-3 text-sm text-slate-600">{quest.description}</p>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  +{quest.rewardXp} XP
                </span>
                <a 
                  href={`/quests/${quest.id}`}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View Details →
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
