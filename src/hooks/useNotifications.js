import { useState, useEffect, useCallback, useRef } from 'react';

export default function useNotifications() {
  const [permission, setPermission] = useState('default');
  const [swRegistration, setSwRegistration] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const swReady = useRef(false);

  // Check support & current permission
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Register service worker
  useEffect(() => {
    if (!isSupported || swReady.current) return;
    swReady.current = true;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        setSwRegistration(registration);
        console.log('[SW] Registered:', registration.scope);
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  }, [isSupported]);

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'unsupported';

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error('[Notification] Permission error:', err);
      return 'denied';
    }
  }, [isSupported]);

  // Send notification via service worker (works even when tab is in background)
  const sendNotification = useCallback(
    async ({ title, body, tag, url, actions }) => {
      if (permission !== 'granted') {
        const result = await requestPermission();
        if (result !== 'granted') return false;
      }

      // Prefer service worker notification (works in background)
      if (swRegistration?.active) {
        swRegistration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          tag,
          url,
          actions,
        });
        return true;
      }

      // Fallback to direct Notification API
      try {
        new Notification(title || 'MedFlow', {
          body,
          icon: '/logo192.png',
          tag: tag || 'medflow-fallback',
        });
        return true;
      } catch (err) {
        console.error('[Notification] Failed:', err);
        return false;
      }
    },
    [permission, swRegistration, requestPermission]
  );

  return {
    isSupported,
    permission,
    swRegistration,
    requestPermission,
    sendNotification,
  };
}
