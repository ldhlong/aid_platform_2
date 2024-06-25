import React, { useState, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px' // Adjusted height to accommodate both map and list
};

const center = {
  lat: 40.440624,
  lng: -79.995888
};

function MapComponent() {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); // Track selected marker ID
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });

  useEffect(() => {
    if (isLoaded) {
      fetchMarkers();
    }
  }, [isLoaded]);

  const fetchMarkers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:4000/help_requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch markers');
      }
      const data = await response.json();
      setMarkers(data);
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  const handleAssign = async (markerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/help_requests/${markerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completion_status: true })
      });
      if (!response.ok) {
        throw new Error('Failed to assign marker');
      }
      const updatedMarker = await response.json();
      setMarkers(markers.map(marker => marker.id === updatedMarker.id ? updatedMarker : marker));
      setSelectedMarker(updatedMarker.id); // Highlight selected marker
    } catch (error) {
      console.error('Error assigning marker:', error);
    }
  };

  const handleListClick = (markerId) => {
    setSelectedMarker(markerId); // Set selected marker ID for highlighting
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={{
              lat: parseFloat(marker.latitude),
              lng: parseFloat(marker.longitude),
            }}
            onClick={() => setSelectedMarker(marker.id)} // Select marker on map click
            icon={{
              url: selectedMarker === marker.id ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        ))}
      </GoogleMap>
      <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>List of Markers:</h2>
        <ul>
          {markers.map(marker => (
            <li
              key={marker.id}
              style={{ cursor: 'pointer', fontWeight: selectedMarker === marker.id ? 'bold' : 'normal' }}
              onClick={() => handleListClick(marker.id)}
            >
              {marker.title} - Lat: {marker.latitude}, Lng: {marker.longitude}
              <button style={{ marginLeft: '10px' }} onClick={() => handleAssign(marker.id)}>Assign to Me</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default React.memo(MapComponent);
