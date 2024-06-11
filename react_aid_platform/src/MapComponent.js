import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.440624,
  lng: -79.995888
};

function MyComponent() {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  return (
    <LoadScript
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >

        { /* Child components, such as markers, info windows, etc. */ }
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(MyComponent)
