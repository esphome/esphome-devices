import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function EUDevicesPage() {
  return (
    <DeviceListingPage
      title="EU Devices - ESPHome Devices"
      description="Browse devices for EU electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'EU Devices' }
      ]}
      path="/standards/eu"
      filterType="standards"
      filterValue="eu"
      displayName="EU Devices"
      filterLabel="Electrical Standard"
    />
  );
}
