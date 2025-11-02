import React, { useEffect } from 'react';

type RootProps = {
  readonly children: React.ReactNode;
};

const CLEANUP_STORAGE_KEY = 'esphome-devices-sw-cleanup';
const LEGACY_CACHE_PATTERNS = [/gatsby/i, /workbox/i, /precache/i, /app-shell/i, /offline/i];

function markCleanupAttempted(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CLEANUP_STORAGE_KEY, new Date().toISOString());
  } catch (error) {
    console.warn('Unable to persist service worker cleanup marker', error);
  }
}

async function unregisterLegacyServiceWorkers(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(async (registration) => {
          try {
            await registration.unregister();
          } catch (error) {
            console.error('Failed to unregister service worker', error);
          }
        }),
      );
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const legacyCaches = cacheNames.filter((cacheName) =>
        LEGACY_CACHE_PATTERNS.some((pattern) => pattern.test(cacheName)),
      );

      await Promise.all(
        legacyCaches.map(async (cacheName) => {
          try {
            await caches.delete(cacheName);
          } catch (error) {
            console.error(`Failed to delete cache ${cacheName}`, error);
          }
        }),
      );
    }

    markCleanupAttempted();
  } catch (error) {
    console.error('Legacy service worker cleanup failed', error);
  }
}

export default function Root({ children }: RootProps): JSX.Element {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    console.log('unregistering legacy service workers');
    void unregisterLegacyServiceWorkers();
  }, []);

  return <>{children}</>;
}

