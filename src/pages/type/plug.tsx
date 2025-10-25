import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function PlugDevicesPage() {
  return (
    <DeviceListingPage
      title="Plugs & Sockets - ESPHome Devices"
      description="Browse plug and socket devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Plugs & Sockets' }
      ]}
      path="/type/plug"
      filterType="type"
      filterValue="plug"
      displayName="Plugs & Sockets"
      filterLabel="Device Type"
    />
  );
}
