import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapImage = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnB0b2xlbnRpbm8iLCJhIjoiY2x2YmduOXo0MDhzdzJqcDc1d2Vxb2EzYyJ9.Q9D-xvTQMnhGgKo8xK7CeA';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-120.656, 35.305], // Centered on Cal Poly San Luis Obispo
      zoom: 14 // Adjust zoom level as needed
    });

    // Add a marker at the clicked location
    function addMarker(e) {
      const marker = new mapboxgl.Marker()
        .setLngLat(e.lngLat)
        .addTo(map);
    }

    // Event listener for the 'click' event
    map.on('click', addMarker);

    // Cleanup function to remove event listener and map instance
    return () => {
      map.off('click', addMarker);
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
}

export default MapImage;
