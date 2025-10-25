import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function RTL87xxDevicesPage() {
  return (
    <DeviceListingPage
      title="RTL87xx Devices - ESPHome Devices"
      description="Browse RTL87xx microcontroller devices"
      breadcrumbs={[
        { label: 'Microcontrollers' },
        { label: 'RTL87xx Devices' }
      ]}
      path="/board/rtl87xx"
      filterType="board"
      filterValue="rtl87xx"
      displayName="RTL87xx Devices"
      filterLabel="Microcontroller"
    />
  );
}
