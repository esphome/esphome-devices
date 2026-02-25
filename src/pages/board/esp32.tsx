import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function ESP32DevicesPage() {
  return (
    <DeviceListingPage
      title="ESP32 Devices - ESPHome Devices"
      description="Browse ESP32 microcontroller devices"
      breadcrumbs={[
        { label: 'Microcontrollers' },
        { label: 'ESP32 Devices' }
      ]}
      path="/board/esp32"
      filterType="board"
      filterValue="esp32"
      displayName="ESP32 Devices"
      filterLabel="Microcontroller"
    />
  );
}
