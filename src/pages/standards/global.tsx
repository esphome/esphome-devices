import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function GlobalDevicesPage() {
  return (
    <DeviceListingPage
      title="Global Devices - ESPHome Devices"
      description="Browse devices for global electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'Global Devices' }
      ]}
      path="/standards/global"
      filterType="standards"
      filterValue="global"
      displayName="Global Devices"
      filterLabel="Electrical Standard"
    />
  );
}
