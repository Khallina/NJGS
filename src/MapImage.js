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

    const start = [-120.656, 35.305];

    // create a function to make a directions request
    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
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

            // get the sidebar and add the instructions
      const instructions = document.getElementById('instructions');
      const steps = data.legs[0].steps;

      let tripInstructions = '';
      for (const step of steps) {
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
      }
      instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
        data.duration / 60
      )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;

      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
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
      // add turn instructions here at the end
    }

    map.on('load', () => {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start);

      // Add starting point to the map
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
      // this is where the code from the next step will go
    });

    map.on('click', (event) => { // gets route
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
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

    map.on('click', addMarker);

    return () => {
      map.off('click', addMarker);
      map.remove();
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
}

export default MapImage;
