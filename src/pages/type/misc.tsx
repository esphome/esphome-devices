import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function MiscDevicesPage() {
  return (
    <DeviceListingPage
      title="Miscellaneous Devices - ESPHome Devices"
      description="Browse miscellaneous devices for ESPHome"
      breadcrumbs={[
        { label: 'Device Types' },
        { label: 'Miscellaneous Devices' }
      ]}
      path="/type/misc"
      filterType="type"
      filterValue="misc"
      displayName="Miscellaneous Devices"
      filterLabel="Device Type"
    />
  );
}
