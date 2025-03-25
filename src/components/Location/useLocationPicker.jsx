import { useState, useEffect } from "react";

const useLocationPicker = (initialLatitude = 17.385, initialLongitude = 78.4867) => {
  const [position, setPosition] = useState([initialLatitude, initialLongitude]);

  // If position changes (e.g., when editing), update state
  useEffect(() => {
    setPosition([initialLatitude, initialLongitude]);
  }, [initialLatitude, initialLongitude]);

  const updatePosition = (lat, lng) => {
    setPosition([lat, lng]);
  };

  return { position, updatePosition };
};

export default useLocationPicker;
