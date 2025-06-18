import React, { useState, useEffect, useRef } from 'react';

const GoogleMapComponent = ({ onSelectLocation, initialLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Initialize the map
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    // Default to Colombo, Sri Lanka if no initial location
    const center = initialLocation 
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : { lat: 6.9271, lng: 79.8612 }; // Colombo coordinates
    
    const mapOptions = {
      center: center,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Create initial marker if initialLocation exists
    if (initialLocation) {
      createMarker(center);
      setSelectedLocation({
        lat: center.lat,
        lng: center.lng,
        address: initialLocation.address || ''
      });
    }

    // Set click listener on map
    newMap.addListener('click', (event) => {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      createMarker(clickedLocation);
      getAddressFromCoordinates(clickedLocation);
    });

    // Initialize autocomplete
    const autocompleteInput = document.getElementById('map-search-input');
    if (autocompleteInput) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(autocompleteInput);
      autocompleteInstance.bindTo('bounds', newMap);
      
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (!place.geometry || !place.geometry.location) {
          return;
        }

        // If the place has a geometry, present it on the map
        if (place.geometry.viewport) {
          newMap.fitBounds(place.geometry.viewport);
        } else {
          newMap.setCenter(place.geometry.location);
          newMap.setZoom(17);
        }

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address
        };

        createMarker(location);
        setSelectedLocation(location);
      });
    }
  };

  const createMarker = (location) => {
    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: map,
      animation: window.google.maps.Animation.DROP,
      draggable: true
    });

    // Add drag end listener
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      const newLocation = {
        lat: position.lat(),
        lng: position.lng()
      };
      
      getAddressFromCoordinates(newLocation);
    });

    setMarker(newMarker);
  };

  const getAddressFromCoordinates = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        
        setSelectedLocation({
          lat: location.lat,
          lng: location.lng,
          address: address
        });
      } else {
        setSelectedLocation({
          lat: location.lat,
          lng: location.lng,
          address: `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
        });
      }
    });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
    }
  };

  return (
    <div className="google-map-component">
      <div className="map-search-container">
        <input
          id="map-search-input"
          className="map-search-input"
          type="text"
          placeholder="Search for a location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      
      <div ref={mapRef} className="google-map" style={{ width: '100%', height: '400px' }}></div>
      
      {selectedLocation && (
        <div className="selected-location-info">
          <p>
            <strong>Selected Location:</strong> {selectedLocation.address}
          </p>
          <p>
            <small>Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</small>
          </p>
          <button 
            type="button"
            className="confirm-location-btn"
            onClick={handleConfirmLocation}
          >
            Confirm This Location
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;