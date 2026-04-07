import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function ESP8266DevicesPage() {
  return (
    <DeviceListingPage
      title="ESP8266 Devices - ESPHome Devices"
      description="Browse ESP8266 microcontroller devices"
      breadcrumbs={[
        { label: 'Microcontrollers' },
        { label: 'ESP8266 Devices' }
      ]}
      path="/board/esp8266"
      filterType="board"
      filterValue="esp8266"
      displayName="ESP8266 Devices"
      filterLabel="Microcontroller"
    />
  );
}
