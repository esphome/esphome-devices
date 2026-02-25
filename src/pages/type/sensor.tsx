import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function SensorDevicesPage() {
  return (
    <DeviceListingPage
      title="Sensors - ESPHome Devices"
      description="Browse sensor devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Sensors' }
      ]}
      path="/type/sensor"
      filterType="type"
      filterValue="sensor"
      displayName="Sensors"
      filterLabel="Device Type"
    />
  );
}
