// MapPage.jsx - Fixed Version
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocations } from '../hooks/useLocations';
import styles from './MapPage.module.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapPage() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  
  const { locations, loading, error, getLocations } = useLocations();
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/outdoors-v12');
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [-122.4194, 37.7749], // San Francisco default
      zoom: 10
    });

    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    
  const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: false,  
  showUserHeading: false     
});
    
    map.current.addControl(geolocate, 'top-right');
    
    // Track user location
    geolocate.on('geolocate', (e) => {
      setUserLocation({
        lng: e.coords.longitude,
        lat: e.coords.latitude
      });
    });
    
    // Map loaded event
    map.current.on('load', () => {
      setMapLoaded(true);
      geolocate.trigger();
    });
  }, []);

  // Fetch all locations on mount with error handling
  useEffect(() => {
    // Fetch all locations without pagination for map view
    if (getLocations) {
      getLocations({}, 1, 1000).catch(err => {
        console.error('Failed to fetch locations:', err);
        // Map will still work without locations
      });
    }
  }, [getLocations]);

  // Update map style
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle, mapLoaded]);

  // Add markers for locations
  useEffect(() => {
    if (!map.current || !mapLoaded || !locations) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Track valid locations for bounds fitting
    const validLocations = [];
    
    locations.forEach(location => {
      if (!location.coordinates) {
        console.log('Skipping location without coordinates:', location.name);
        return;
      }

      const lng = parseFloat(location.coordinates.longitude);
      const lat = parseFloat(location.coordinates.latitude);
      
      // Skip invalid coordinates
      if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        console.log('Skipping location with invalid coordinates:', location.name, { lng, lat });
        return;
      }

      // Add to valid locations for bounds
      validLocations.push({ lng, lat });

      // Create marker element
      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.width = '35px';
      el.style.height = '35px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.transition = 'transform 0.2s';
      
      // Set color based on photography style
      const styleColors = {
        landscape: '#4CAF50',
        portrait: '#FF6B6B',
        wildlife: '#8B4513',
        architecture: '#9E9E9E',
        street: '#FF9800',
        macro: '#9C27B0',
        aerial: '#00BCD4',
        nature: '#4CAF50'
      };
      
      const primaryStyle = location.photographyStyles?.[0] || 'landscape';
      el.style.backgroundColor = styleColors[primaryStyle] || '#2196F3';
      
      // Add photo thumbnail if available
      if (location.samplePhotoUrl) {
        el.style.backgroundImage = `url(${location.samplePhotoUrl})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      }

      // Create popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        maxWidth: '300px'
      }).setHTML(`
        <div class="${styles.popup}">
          ${location.samplePhotoUrl ? 
            `<img src="${location.samplePhotoUrl}" alt="${location.name}" class="${styles.popupImage}" />` 
            : ''
          }
          <h3 class="${styles.popupTitle}">${location.name}</h3>
          <p class="${styles.popupCity}"> ${location.city || 'Unknown location'}</p>
          <div class="${styles.popupTags}">
            ${location.bestTimeOfDay?.map(time => 
              `<span class="${styles.tag}">${time}</span>`
            ).join('') || ''}
          </div>
          <div class="${styles.popupInfo}">
            <span> ${location.photographyStyles?.join(', ') || 'Various'}</span><br/>
            <span> ${location.difficulty || 'Moderate'}</span><br/>
            <span> ${location.accessibility || 'Moderate'}</span>
          </div>
          ${location.seasons?.length > 0 ? 
            `<div class="${styles.popupSeasons}">
               Best in: ${location.seasons.join(', ')}
            </div>` : ''
          }
          <button class="${styles.viewBtn}" data-id="${location._id}">View Details</button>
        </div>
      `);

      // Create marker
      try {
       const marker = new mapboxgl.Marker(el)
  .setLngLat([lng, lat])
  .setPopup(popup)
  .addTo(map.current);

        // Handle popup button click
        popup.on('open', () => {
          setTimeout(() => {
            const viewBtn = document.querySelector(`.${styles.viewBtn}[data-id="${location._id}"]`);
            if (viewBtn) {
              viewBtn.onclick = () => {
                navigate(`/locations/${location._id}`);
              };
            }
          }, 0);
        });

        markers.current.push(marker);
      } catch (err) {
        console.error('Error adding marker for location:', location.name, err);
      }
    });

    // Fit map to show all valid markers if we have any
    if (validLocations.length > 0 && validLocations.length < 50) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        
        // Only add valid locations to bounds
        validLocations.forEach(({ lng, lat }) => {
          bounds.extend([lng, lat]);
        });
        
        // Check if bounds are valid before fitting
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, { 
            padding: { top: 100, bottom: 100, left: 50, right: 50 },
            maxZoom: 15
          });
        }
      } catch (err) {
        console.error('Error fitting bounds:', err);
        // Keep map at default position if bounds fitting fails
      }
    }
  }, [locations, navigate, mapLoaded]);

  // Toggle map style
  const toggleMapStyle = () => {
    const styles = [
      { id: 'mapbox://styles/mapbox/outdoors-v12', name: 'Outdoors' },
      { id: 'mapbox://styles/mapbox/satellite-streets-v12', name: 'Satellite' },
      { id: 'mapbox://styles/mapbox/light-v11', name: 'Light' },
      { id: 'mapbox://styles/mapbox/dark-v11', name: 'Dark' }
    ];
    const currentIndex = styles.findIndex(s => s.id === mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(styles[nextIndex].id);
  };

  // Find nearby locations
  const findNearbyLocations = () => {
    if (!userLocation || !map.current) return;
    
    map.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
      essential: true
    });
  };

  // Get style name for display
  const getStyleName = () => {
    const styleMap = {
      'mapbox://styles/mapbox/outdoors-v12': 'Outdoors',
      'mapbox://styles/mapbox/satellite-streets-v12': 'Satellite',
      'mapbox://styles/mapbox/light-v11': 'Light',
      'mapbox://styles/mapbox/dark-v11': 'Dark'
    };
    return styleMap[mapStyle] || 'Outdoors';
  };

  return (
    <div className={styles.mapPage}>
      {/* Map Controls Bar */}
      <div className={styles.controlBar}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backBtn}
        >
          ← Back
        </button>
        
        <div className={styles.mapInfo}>
          <span className={styles.locationCount}>
             {locations?.length || 0} locations
          </span>
        </div>
        
        <div className={styles.mapControls}>
          {userLocation && (
            <button 
              onClick={findNearbyLocations}
              className={styles.nearbyBtn}
              title="Show nearby locations"
            >
              Nearby
            </button>
          )}
          
          <button 
            onClick={toggleMapStyle}
            className={styles.styleBtn}
            title="Toggle Map Style"
          >
            {getStyleName()}
          </button>
          
          <button 
            onClick={() => navigate('/locations')}
            className={styles.listBtn}
          >
            List View
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className={styles.mapContainer} />

      {/* Legend */}
      <div className={styles.legend}>
        <h4>Photography Styles</h4>
        <div className={styles.legendItems}>
          <span><span className={styles.dot} style={{backgroundColor: '#4CAF50'}}></span>Landscape/Nature</span>
          <span><span className={styles.dot} style={{backgroundColor: '#FF6B6B'}}></span>Portrait</span>
          <span><span className={styles.dot} style={{backgroundColor: '#8B4513'}}></span>Wildlife</span>
          <span><span className={styles.dot} style={{backgroundColor: '#9E9E9E'}}></span>Architecture</span>
          <span><span className={styles.dot} style={{backgroundColor: '#FF9800'}}></span>Street</span>
          <span><span className={styles.dot} style={{backgroundColor: '#9C27B0'}}></span>Macro</span>
          <span><span className={styles.dot} style={{backgroundColor: '#00BCD4'}}></span>Aerial</span>
        </div>
      </div>

      {/* Location Counter */}
      <div className={styles.counter}>
        <div className={styles.counterContent}>
          <strong>{locations?.length || 0}</strong> photography spots discovered
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Loading photography locations...
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <strong>Error loading locations:</strong> {error}
          <button onClick={() => window.location.reload()} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}