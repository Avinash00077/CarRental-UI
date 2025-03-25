import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useLocationPicker from "./useLocationPicker";// Import hook

const LocationPicker = ({ setData, initialLatitude, initialLongitude }) => {
  const { position, updatePosition } = useLocationPicker(initialLatitude, initialLongitude); // Pass existing location

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        updatePosition(e.latlng.lat, e.latlng.lng);
        setData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      className="rounded-md border border-gray-300"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
