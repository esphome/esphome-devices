import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function BK72xxDevicesPage() {
  return (
    <DeviceListingPage
      title="BK72xx Devices - ESPHome Devices"
      description="Browse BK72xx microcontroller devices"
      breadcrumbs={[
        { label: 'Microcontrollers' },
        { label: 'BK72xx Devices' }
      ]}
      path="/board/bk72xx"
      filterType="board"
      filterValue="bk72xx"
      displayName="BK72xx Devices"
      filterLabel="Microcontroller"
    />
  );
}
