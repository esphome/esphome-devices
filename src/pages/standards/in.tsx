import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function INDevicesPage() {
  return (
    <DeviceListingPage
      title="IN Devices - ESPHome Devices"
      description="Browse devices for IN electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'IN Devices' }
      ]}
      path="/standards/in"
      filterType="standards"
      filterValue="in"
      displayName="IN Devices"
      filterLabel="Electrical Standard"
    />
  );
}
