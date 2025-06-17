import { Platform } from "react-native";
import { useDeviceDiscoveryStore } from "./store";

export const NAV_THEME = {
  light: {
    background: "hsl(228 100% 98%)", // background
    border: "hsl(220 13% 91%)", // border
    card: "hsl(0 0% 99%)", // card
    notification: "hsl(3 100% 50%)", // destructive
    primary: "hsl(229 100% 62%)", // primary
    text: "hsl(229 63% 4%)", // foreground
  },
  dark: {
    background: "hsl(224 50% 13%)", // background
    border: "hsl(215 27.9% 16.9%)", // border
    card: "hsl(229 41% 5%)", // card
    notification: "hsl(3 89% 54%)", // destructive
    primary: "hsl(229 100% 62%)", // primary
    text: "hsl(229 23% 99%)", // foreground
  },
};

/**
 * Constants
 * Global View padding - 4
 * Page Title size - 4xl
 */

export const baseURL = () => {
  const selectedDomain = useDeviceDiscoveryStore.getState().selectedDomain;
  if (selectedDomain === "storagepod.local") {
    //this will be a local communication
    return Platform.select({
      ios: "http://storagepod.local:8080/api/v1",
      android: "http://storagepod.local:8080/api/v1",
    });
  }

  if (selectedDomain?.includes("campuscatalyst.info")) {
    return Platform.select({
      // "http://10.0.2.2:8000/api/v1" -> dev on host
      // "http://192.168.0.3:8000/api/v1"  -> to test on local android phone
      // "http://10.130.100.53:8000/api/v1" -> to test on rasphberry-pi
      //  https://192.168.0.200
      // "https://nas.campuscatalyst.info/api/v1",

      ios: `https://${selectedDomain}/api/v1`,
      android: `https://${selectedDomain}/api/v1`,
    });
  }


  //TODO if nothing - defualt we need to check
  return Platform.select({
      ios: "https://nas.campuscatalyst.info/api/v1",
      android: "https://nas.campuscatalyst.info/api/v1",
    });
};

export const toolsAvailable = [
  {
    id: 1,
    title: "File Explorer",
    subtitle: "Easily browse, organize, and manage all your files in one place.",
  },
  /*{
    id: 2,
    title: "VPN",
    subtitle: "Secure your connection and protect your privacy with one tap.",
  },*/
  {
    id: 3,
    title: "Media Player",
    subtitle: "Enjoy seamless playback of your favorite videos anytime.",
  },
];
