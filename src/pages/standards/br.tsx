import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function BRDevicesPage() {
  return (
    <DeviceListingPage
      title="BR Devices - ESPHome Devices"
      description="Browse devices for BR electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'BR Devices' }
      ]}
      path="/standards/br"
      filterType="standards"
      filterValue="br"
      displayName="BR Devices"
      filterLabel="Electrical Standard"
    />
  );
}
