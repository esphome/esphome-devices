import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function LightDevicesPage() {
  return (
    <DeviceListingPage
      title="Lights & LEDs - ESPHome Devices"
      description="Browse light and LED devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Lights & LEDs' }
      ]}
      path="/type/light"
      filterType="type"
      filterValue="light"
      displayName="Lights & LEDs"
      filterLabel="Device Type"
    />
  );
}
