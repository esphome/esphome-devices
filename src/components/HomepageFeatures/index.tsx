import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';
import deviceMetadata from '../../data/device-metadata.json';
import DeviceListItem from '../DeviceListItem';
import {RawDeviceMetadata} from '../../utils/deviceUtils';
import '../../pages/type/styles.css';

interface DeviceEntry extends RawDeviceMetadata {
  id: string;
  path: string;
}

function LatestDevices(): React.JSX.Element {
  const allDeviceDocs = useMemo(() => {
    return Object.entries(deviceMetadata)
      .map(([key, device]) => ({
        id: key,
        path: `/devices/${key.replace('/index', '')}/`,
        ...(device as RawDeviceMetadata),
      }))
      .filter(device => Boolean(device['date-published']));
  }, []);

  const totalDeviceCount = Object.entries(deviceMetadata).length;

  const deviceDocs = useMemo(() => {
    return allDeviceDocs
      .slice()
      .sort((a, b) => new Date(b['date-published']).getTime() - new Date(a['date-published']).getTime())
      .slice(0, 10);
  }, [allDeviceDocs]);

  return (
    <section>
      <div className="container">
        <div className="margin-bottom--lg">
          <h1>ESPHome Device Configuration Repository</h1>
          <p>
            This website is a repository of device configuration templates and setup guides for devices running{' '}
            <Link to="https://esphome.io/">ESPHome</Link> firmware.
          </p>
          <p>
            The goal is to document all devices capable of running the firmware along with a basic configuration yaml that can be easily copied and uploaded which restores the device back to its original functionality. Additionaly, more advanced configuration of devices could also be documented.
          </p>
          <p>
            There are currently <strong>{totalDeviceCount}</strong> devices documented in the repository.
          </p>
        </div>
        <div>
          <h2>Recently Added Devices</h2>
        </div>
        <ul className="deviceList">
          {deviceDocs.map(device => (
            <DeviceListItem
              key={device.id}
              id={device.id}
              title={device.title}
              path={device.path}
              type={device.type}
              board={device.board}
              standard={device.standard}
            />
          ))}
        </ul>
        <div>
          <h2>Contributing</h2>
          <p>
            This repository relies on the community to keep it up-to-date and accurate. If you identify and errors or find a device that is not added please consider contributing.
          </p>
          <ul>
            <li>
              <Link to="/devices/adding-devices">Adding Devices</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function HomepageFeatures(): React.JSX.Element {
  return (
    <div>
      <LatestDevices />
    </div>
  );
}
