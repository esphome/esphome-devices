import React from 'react';
import DeviceListingPage from '../../components/DeviceListingPage';

export default function RP2040DevicesPage() {
  return (
    <DeviceListingPage
      title="RP2040 Devices - ESPHome Devices"
      description="Browse RP2040 microcontroller devices"
      breadcrumbs={[
        { label: 'Microcontrollers' },
        { label: 'RP2040 Devices' }
      ]}
      path="/board/rp2040"
      filterType="board"
      filterValue="rp2040"
      displayName="RP2040 Devices"
      filterLabel="Microcontroller"
    />
  );
}
