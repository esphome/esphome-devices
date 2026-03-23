import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function AUDevicesPage() {
  return (
    <DeviceListingPage
      title="AU Devices - ESPHome Devices"
      description="Browse devices for AU electrical standards"
      breadcrumbs={[
        { label: 'Electrical Standards' },
        { label: 'AU Devices' }
      ]}
      path="/standards/au"
      filterType="standards"
      filterValue="au"
      displayName="AU Devices"
      filterLabel="Electrical Standard"
    />
  );
}
