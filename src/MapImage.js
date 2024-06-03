import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapImage = () => {
  const mapContainer = useRef(null);
  const markers = useRef({});
  const [startPosition, setStartPosition] = useState([-120.656, 35.305]);
  const [endPosition, setEndPosition] = useState(null);
  const [setStartMode, setSetStartMode] = useState(false);
  const [setEndMode, setSetEndMode] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnB0b2xlbnRpbm8iLCJhIjoiY2x2YmduOXo0MDhzdzJqcDc1d2Vxb2EzYyJ9.Q9D-xvTQMnhGgKo8xK7CeA';

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

      const instructions = document.getElementById('instructions');
      const steps = data.legs[0].steps;

      let tripInstructions = '';
      for (const step of steps) {
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
      }
      instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
        data.duration / 60
      )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;

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

    map.on('load', () => {
      getRoute(start);

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

    map.on('click', (event) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
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
            data: {
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
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        });
      }
      getRoute(coords);
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

    

    return () => {
      map.off('click', addMarker);
      map.remove();
    };
  }, [startPosition, setStartMode, setEndMode]);

  const handleSetStart = () => {
    setSetStartMode(true);
    setSetEndMode(false);
  };

  return (
    <div>
      <button onClick={handleSetStart}>Set Start</button>
      <div ref={mapContainer} style={{ width: '100%', height: '80vh' }} />
      <div id="instructions"></div>
    </div>
  );
};

export default MapImage;
