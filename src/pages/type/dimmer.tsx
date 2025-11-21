import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function DimmerDevicesPage() {
  return (
    <DeviceListingPage
      title="Dimmers - ESPHome Devices"
      description="Browse dimmer devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Dimmers' }
      ]}
      path="/type/dimmer"
      filterType="type"
      filterValue="dimmer"
      displayName="Dimmers"
      filterLabel="Device Type"
    />
  );
}
