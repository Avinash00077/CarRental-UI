import { useState, useEffect } from "react";

const useLocationPicker = (initialLatitude, initialLongitude) => {
  const [position, setPosition] = useState([
    initialLatitude || 17.385,
    initialLongitude || 78.4867,
  ]);

  useEffect(() => {
    // Update position when the initial values change (for edit mode)
    if (initialLatitude && initialLongitude) {
      setPosition([initialLatitude, initialLongitude]);
    }
  }, [initialLatitude, initialLongitude]);

  const updatePosition = (lat, lng) => {
    setPosition([lat, lng]);
  };

  return { position, updatePosition };
};

export default useLocationPicker;
