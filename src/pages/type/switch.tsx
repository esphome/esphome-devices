import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function SwitchDevicesPage() {
  return (
    <DeviceListingPage
      title="Switches - ESPHome Devices"
      description="Browse switch devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Switches' }
      ]}
      path="/type/switch"
      filterType="type"
      filterValue="switch"
      displayName="Switches"
      filterLabel="Device Type"
    />
  );
}
