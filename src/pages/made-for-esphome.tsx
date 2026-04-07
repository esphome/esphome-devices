import React from 'react';
import Link from '@docusaurus/Link';
import DeviceListingPage from '../components/DeviceListingPage';

export default function MadeForESPHomePage() {
  return (
    <DeviceListingPage
      title="Made for ESPHome - ESPHome Devices"
      description="Browse devices officially made for ESPHome"
      breadcrumbs={[{ label: 'Made for ESPHome' }]}
      path="/made-for-esphome"
      filterType="made-for-esphome"
      filterValue="true"
      displayName="Made for ESPHome"
      filterLabel="Category"
    >
      <div className="made-for-esphome-logo-container">
        <Link to="https://esphome.io/guides/made_for_esphome/">
          <div className="made-for-esphome-logo-image" />
        </Link>
      </div>
      <p className="made-for-esphome-description">
        The following devices are designed to work with ESPHome and are preflashed with the firmware. This means you can easily integrate them into your smart home without any additional setup. Their configurations{' '}
        <Link to="https://esphome.io/guides/made_for_esphome.html">meet requirements</Link>
        {' '}as set out by the ESPHome project.
      </p>
    </DeviceListingPage>
  );
}
