import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 40.440624,
  lng: -79.995888
};

function MapComponent() {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });
  const navigate = useNavigate();

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

  const handleAssign = async (requestCount) => {
    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
  
      const response = await fetch(`http://localhost:4000/help_requests/${requestCount}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completion_status: true, accepted_by_user: user_id})
      });
  
      if (!response.ok) {
        throw new Error('Failed to assign marker');
      }
  
      const updatedMarker = await response.json();
      setMarkers(markers.map(marker => marker.request_count === requestCount ? updatedMarker : marker));
      setSelected(updatedMarker);
  
      // Navigate to messages page after assignment
      navigate(`/messages/${updatedMarker.request_count}`);
    } catch (error) {
      console.error('Error assigning marker:', error);
    }
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
            key={marker.request_count}
            position={{
              lat: parseFloat(marker.latitude),
              lng: parseFloat(marker.longitude),
            }}
            onClick={() => setSelected(marker)}
          />
        ))}
        {selected && (
          <InfoWindow
            position={{
              lat: parseFloat(selected.latitude),
              lng: parseFloat(selected.longitude),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ maxWidth: 200 }}>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              <p>Latitude: {selected.latitude}</p>
              <p>Longitude: {selected.longitude}</p>
              <button onClick={() => handleAssign(selected.request_count)}>Assign to Me</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>List of Markers:</h2>
        <ul>
          {markers.map(marker => (
            <li key={marker.request_count}>
              {marker.title} - Lat: {marker.latitude}, Lng: {marker.longitude}
              <button style={{ marginLeft: '10px' }} onClick={() => handleAssign(marker.request_count)}>Assign to Me</button>
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
