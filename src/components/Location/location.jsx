import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useLocationPicker from "./useLocationPicker";
import L from "leaflet";

// Fix Leaflet icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({ setData, initialLatitude, initialLongitude }) => {
  const { position, updatePosition } = useLocationPicker(initialLatitude, initialLongitude);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        updatePosition(e.latlng.lat, e.latlng.lng);
        setData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      className="rounded-md border border-gray-300"
      key={position.toString()} // Force re-render when position updates
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
