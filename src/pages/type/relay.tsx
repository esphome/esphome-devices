import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function RelayDevicesPage() {
  return (
    <DeviceListingPage
      title="Relays - ESPHome Devices"
      description="Browse relay devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Relays' }
      ]}
      path="/type/relay"
      filterType="type"
      filterValue="relay"
      displayName="Relays"
      filterLabel="Device Type"
    />
  );
}
