import React from 'react';
import mapImage from './map.jpg'; // Import the map.jpg file

const MapImage = () => {
  return (
    <div style={{ maxWidth: '100%', maxHeight: '100vh', overflow: 'auto' }}>
      <img src={mapImage} alt="Map" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
    </div>
  );
}

export default MapImage;
