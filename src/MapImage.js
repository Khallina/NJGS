import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapImage = () => {
  const mapContainer = useRef(null);
  const markers = useRef({});

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnB0b2xlbnRpbm8iLCJhIjoiY2x2YmduOXo0MDhzdzJqcDc1d2Vxb2EzYyJ9.Q9D-xvTQMnhGgKo8xK7CeA';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-120.656, 35.305],
      zoom: 14,
      maxBounds: [ // Set the maximum bounds of the map
        [-120.68, 35.29], // Southwest coordinates
        [-120.63, 35.32]  // Northeast coordinates
      ],
      scrollZoom: true // Allow zooming with mouse scroll
    });

    function addMarker(e) {
      const markerId = Date.now().toString();
      const coordinates = e.lngLat;
      
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
    
      const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<p>Latitude: ${coordinates.lat.toFixed(6)}</p><p>Longitude: ${coordinates.lng.toFixed(6)}</p>`);
      
      marker.setPopup(popup);
    
      markers.current[markerId] = marker;
      
      marker.getElement().addEventListener('contextmenu', (event) => {
        event.preventDefault();
        removeMarker(markerId);
      });
    }

    function removeMarker(markerId) {
      const markerToRemove = markers.current[markerId];
      if (markerToRemove) {
        markerToRemove.remove();
        delete markers.current[markerId];
      }
    }

    map.on('click', addMarker);

    return () => {
      map.off('click', addMarker);
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
}

export default MapImage;
