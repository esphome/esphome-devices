import React from 'react';
import DocPageLayout from '../components/DocPageLayout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

export default function Home() {
  return (
    <DocPageLayout
      title="ESPHome Devices - Home"
      description="Browse ESPHome device configurations and documentation"
    >
      <HomepageFeatures />
    </DocPageLayout>
  );
}
