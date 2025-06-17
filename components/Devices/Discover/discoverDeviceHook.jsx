import { useCallback, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Zeroconf from "react-native-zeroconf";
import * as Location from "expo-location";

const zeroconf = new Zeroconf();

/**
 * Custom hook for device discovery using Zeroconf
 *
 * @param {Object} options - Configuration options
 * @param {string} options.serviceType - The service type to scan for (default: 'dlna')
 * @param {string} options.protocol - The protocol (default: 'tcp')
 * @param {string} options.domain - The domain to scan in (default: 'local.')
 * @param {string} options.deviceNameFilter - String to filter device names (default: 'storagepod')
 * @param {number} options.scanTimeout - Timeout for scanning in ms (default: 10000)
 * @param {boolean} options.autoScan - Whether to scan automatically on mount (default: false)
 */
export default function useDiscoverDevice(options = {}) {
  // Default options
  const { serviceType = "dlna", protocol = "tcp", domain = "local.", deviceNameFilter = "storagepod", scanTimeout = 10000, autoScan = false } = options;

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState(null);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    // Set up event listeners
    zeroconf.on("resolved", handleResolvedService);
    zeroconf.on("error", handleError);

    // Clean up on unmount
    return () => {
      stopScan();
      zeroconf.removeListener("resolved", handleResolvedService);
      zeroconf.removeListener("error", handleError);
    };
  }, []);

  // Handle resolved service
  const handleResolvedService = useCallback(
    (service) => {
      //console.error("Found service:", service);

      // Check if this service matches our filter
      const matchesFilter = !deviceNameFilter || (service.name && service.name.toLowerCase().includes(deviceNameFilter.toLowerCase()));

      if (matchesFilter) {
        // Create a device object with relevant info
        const device = {
          id: service.host,
          name: service.name,
          host: service.host,
          addresses: service.addresses || [],
          ip: service.addresses?.[0] || null,
          port: service.port,
          serviceType: service.type,
          txtRecord: service.txtRecord,
          discoveredAt: new Date().toISOString(),
        };

        // Add to discovered devices list, avoiding duplicates
        setDiscoveredDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === device.id);
          if (!exists) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    },
    [deviceNameFilter]
  );

  const handleError = useCallback((error) => {
    console.error("Zeroconf error:", error);
    setError(error.message || "Unknown error occurred");
    setIsScanning(false);
    setScanComplete(true);
  }, []);

  useEffect(() => {
    if (autoScan) {
      startScan();
    }
  }, [autoScan]);

  const requestLocationPermission = useCallback(async () => {
    try {
      // For Android & iOS - request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        console.log("Location permission granted");
        return true;
      } else {
        console.log("Location permission denied");
        // Optionally set an error state if needed
        // setError('Location permission denied');
        return false;
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      // setError('Failed to request location permission');
      return false;
    }
  }, []);

  const startScan = useCallback(async () => {
    // Clear previous state
    setError(null);
    setDiscoveredDevices([]);
    setScanComplete(false);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return;
    }

    try {
      setIsScanning(true);
      zeroconf.stop();

      zeroconf.scan("dlna", protocol, domain);
    } catch (error) {
      setError(error);
      setIsScanning(false);
      setScanComplete(true);
    }
  }, [serviceType, protocol, domain, scanTimeout]);

  // Stop scanning
  const stopScan = useCallback(() => {
    if (isScanning) {
      zeroconf.stop();
      setIsScanning(false);
      setScanComplete(true);
    }
  }, [isScanning]);

  return {
    // State
    isScanning,
    scanComplete,
    error,
    discoveredDevices,

    // Actions
    startScan,
    stopScan,
  };
}
