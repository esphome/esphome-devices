import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function UKDevicesPage() {
  return (
    <DeviceListingPage
      title="UK Devices - ESPHome Devices"
      description="Browse devices for UK electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'UK Devices' }
      ]}
      path="/standards/uk"
      filterType="standards"
      filterValue="uk"
      displayName="UK Devices"
      filterLabel="Electrical Standard"
    />
  );
}
