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
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-120.656, 35.305], // Centered on Cal Poly San Luis Obispo
      zoom: 14 // Adjust zoom level as needed
    });

    // Add a marker at the clicked location
    function addMarker(e) {
      const markerId = Date.now().toString(); // Unique identifier for the marker
      const coordinates = e.lngLat; // Get the coordinates of the marker
      
      const marker = new mapboxgl.Marker() // Create a marker
        .setLngLat(coordinates)
        .addTo(map);
    
      // Create a popup displaying the coordinates
      const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<p>Latitude: ${coordinates.lat.toFixed(6)}</p><p>Longitude: ${coordinates.lng.toFixed(6)}</p>`);
      
      // Attach the popup to the marker
      marker.setPopup(popup);
    
      markers.current[markerId] = marker; // Store the marker reference with its id
      
      // Event listener for right-click to remove the marker
      marker.getElement().addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Preventing the default context menu
        removeMarker(markerId); // Call removeMarker function with the marker id
      });
    }

    // Function to remove a marker by its id
    function removeMarker(markerId) {
      const markerToRemove = markers.current[markerId];
      if (markerToRemove) {
        markerToRemove.remove(); // Remove the marker from the map
        delete markers.current[markerId]; // Remove the marker reference from the markers object
      }
    }

    // Event listener for the 'click' event to add markers
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