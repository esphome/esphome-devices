import React, {useMemo, useState, useCallback} from 'react';
import Link from '@docusaurus/Link';
import DocPageLayout from './DocPageLayout';
import deviceMetadata from '../data/device-metadata.json';
import '../pages/type/styles.css';
import DeviceListItem from './DeviceListItem';
import {RawDeviceMetadata, splitValues, slugify} from '../utils/deviceUtils';

type FilterType = 'type' | 'standards' | 'board' | 'made-for-esphome';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DeviceListingPageProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  path: string;
  filterType: FilterType;
  filterValue: string;
  displayName: string;
  filterLabel: string;
  emptyMessage?: string;
  children?: React.ReactNode;
}

const matchesFilter = (device: RawDeviceMetadata, filterType: FilterType, filterValue: string): boolean => {
  const normalized = filterValue.toLowerCase();

  switch (filterType) {
    case 'type':
      return (device.type ?? '').toLowerCase() === normalized;
    case 'standards':
      return splitValues(device.standard).some(entry => slugify(entry) === normalized);
    case 'board':
      return splitValues(device.board).some(entry => slugify(entry) === normalized);
    case 'made-for-esphome':
      return String(device['made-for-esphome'] ?? '').toLowerCase() === normalized;
    default:
      return false;
  }
};

const DeviceListingPage: React.FC<DeviceListingPageProps> = React.memo(({
  title,
  description,
  breadcrumbs = [],
  path,
  filterType,
  filterValue,
  displayName,
  filterLabel,
  emptyMessage = 'No devices found.',
  children,
}) => {
  const [sortBy, setSortBy] = useState<'title' | 'date'>('title');

  const devices = useMemo(() => {
    // First filter devices
    const filtered = Object.entries(deviceMetadata)
      .filter(([, device]) => matchesFilter(device as RawDeviceMetadata, filterType, filterValue))
      .map(([key, device]) => ({
        id: key,
        path: `/devices/${key}/`,
        ...(device as RawDeviceMetadata),
      }));

    // Then sort the filtered results
    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }

      const dateA = new Date(a['date-published']);
      const dateB = new Date(b['date-published']);
      const isValidA = !isNaN(dateA.getTime());
      const isValidB = !isNaN(dateB.getTime());

      if (!isValidA && !isValidB) {
        return 0;
      }
      if (!isValidA) {
        return 1;
      }
      if (!isValidB) {
        return -1;
      }
      return dateB.getTime() - dateA.getTime();
    });
  }, [filterType, filterValue, sortBy]);

  // Memoize sort handlers to prevent unnecessary re-renders
  const handleSortByTitle = useCallback(() => setSortBy('title'), []);
  const handleSortByDate = useCallback(() => setSortBy('date'), []);

  return (
    <DocPageLayout
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      path={path}
    >
      <h1>{displayName}</h1>
      {children}
      <div className="pageHeader">
        <p>
          <strong>{devices.length}</strong> devices
        </p>

        <div className="sortControls">
          <span className="sortLabel">Sort by:</span>
          <button
            className={`sortButton ${sortBy === 'title' ? 'sortButton--active' : ''}`}
            onClick={handleSortByTitle}
          >
            Title (A-Z)
          </button>
          <button
            className={`sortButton ${sortBy === 'date' ? 'sortButton--active' : ''}`}
            onClick={handleSortByDate}
          >
            Date Published
          </button>
        </div>
      </div>

      <ul className="deviceList">
        {devices.map(device => (
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

      {devices.length === 0 && (
        <div className="text--center">
          <p>{emptyMessage}</p>
        </div>
      )}
    </DocPageLayout>
  );
});

DeviceListingPage.displayName = 'DeviceListingPage';

export default DeviceListingPage;
