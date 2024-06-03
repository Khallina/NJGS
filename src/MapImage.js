import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // Importing Mapbox library
import 'mapbox-gl/dist/mapbox-gl.css'; // Importing Mapbox styles

const MapImage = () => {
  const mapContainer = useRef(null); // Reference to map container
  const markers = useRef({}); // Reference to markers
  const [startPosition, setStartPosition] = useState([-120.656, 35.305]); // State for start position
  const [endPosition, setEndPosition] = useState(null); // State for end position
  const [setStartMode, setSetStartMode] = useState(false); // State for setting start mode
  const [setEndMode, setSetEndMode] = useState(false); // State for setting end mode

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnB0b2xlbnRpbm8iLCJhIjoiY2x2YmduOXo0MDhzdzJqcDc1d2Vxb2EzYyJ9.Q9D-xvTQMnhGgKo8xK7CeA'; // Setting Mapbox access token

    // Creating Map instance
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: startPosition,
      zoom: 14,
      maxBounds: [
        [-120.68, 35.29],
        [-120.63, 35.32]
      ],
      scrollZoom: true
    });

    const start = startPosition;

    async function getRoute(end) {
      // Fetching route data from Mapbox Directions API
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      // Displaying route instructions
      const instructions = document.getElementById('instructions');
      const steps = data.legs[0].steps;
      let tripInstructions = '';
      for (const step of steps) {
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
      }
      instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
        data.duration / 60
      )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;

      // Adding or updating route layer on map
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
    }

    // Event listener for map load
    map.on('load', () => {
      getRoute(start);

      // Adding start point marker on map
      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be'
        }
      });
    });

    // Event listener for map click
    map.on('click', (event) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
      // Setting start or end position based on mode
      if (setStartMode) {
        setStartPosition(coords);
        setSetStartMode(false);
      }
      if (setEndMode) {
        setEndPosition(coords);
        setSetEndMode(false);
      }
      if (setStartMode || setEndMode) {
        return;
      }
      // Adding or updating end point marker on map
      const end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }
        ]
      };
      if (map.getLayer('end')) {
        map.getSource('end').setData(end);
      } else {
        map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: end
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        });
      }
      getRoute(coords);
    });

    // Function to add marker on map
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

    // Function to remove marker from map
    function removeMarker(markerId) {
      const markerToRemove = markers.current[markerId];
      if (markerToRemove) {
        markerToRemove.remove();
        delete markers.current[markerId];
      }
    }

    // Cleanup function to remove event listeners and destroy map instance
    return () => {
      map.off('click', addMarker);
      map.remove();
    };
  }, [startPosition, setStartMode, setEndMode]);

  // Function to handle setting start mode
  const handleSetStart = () => {
    setSetStartMode(true);
    setSetEndMode(false);
  };

  // Rendering component
  return (
    <div>
      {/* Button to set start mode */}
      <button onClick={handleSetStart}>Set Start</button>
      {/* Map container */}
      <div ref={mapContainer} style={{ width: '100%', height: '80vh' }} />
      {/* Container for route instructions */}
      <div id="instructions"></div>
    </div>
  );
};

export default MapImage;