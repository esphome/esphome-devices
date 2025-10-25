import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function USDevicesPage() {
  return (
    <DeviceListingPage
      title="US Devices - ESPHome Devices"
      description="Browse devices for US electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'US Devices' }
      ]}
      path="/standards/us"
      filterType="standards"
      filterValue="us"
      displayName="US Devices"
      filterLabel="Electrical Standard"
    />
  );
}
