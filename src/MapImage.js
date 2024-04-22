import React from 'react';

const MapImage = ({ imageUrl }) => {
  return (
    <div style={{ maxWidth: '100%', maxHeight: '100vh', overflow: 'auto' }}>
      <img src={imageUrl} alt="Map" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
    </div>
  );
}

export default MapImage;
