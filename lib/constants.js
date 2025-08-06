import { Platform } from "react-native";
import { useDeviceDiscoveryStore } from "./store";

/**
 * export const NAV_THEME = {
  light: {
    background: "hsl(20 5.8824% 90%)", // background
    border: "hsl(24 5.7471% 82.9412%)", // border
    card: "hsl(60 4.7619% 95.8824%)", // card
    notification: "hsl(0 84.2365% 60.1961%)", // destructive
    primary: "hsl(238.7324 83.5294% 66.6667%)", // primary
    text: "hsl(217.2414 32.5843% 17.451%)", // foreground
  },
  dark: {
    background: "hsl(30 11.1111% 10.5882%)", // background
    border: "hsl(25.7143 6.422% 21.3725%)", // border
    card: "hsl(25.7143 8.642% 15.8824%)", // card
    notification: "hsl(0 84.2365% 60.1961%)", // destructive
    primary: "hsl(234.4538 89.4737% 73.9216%)", // primary
    text: "hsl(214.2857 31.8182% 91.3725%)", // foreground
  },
};
 */


export const NAV_THEME = {
  light: {
    background: "hsl(20 5.8824% 90%)", // background
    border: "hsl(24 5.7471% 82.9412%)", // border
    card: "hsl(60 4.7619% 95.8824%)", // card
    notification: "hsl(0 84.2365% 60.1961%)", // destructive
    primary: "hsl(238.7324 83.5294% 66.6667%)", // primary
    text: "hsl(217.2414 32.5843% 17.451%)", // foreground
  },
  dark: {
    background: "hsl(30 11.1111% 10.5882%)", // background
    border: "hsl(25.7143 6.422% 21.3725%)", // border
    card: "hsl(25.7143 8.642% 15.8824%)", // card
    notification: "hsl(0 84.2365% 60.1961%)", // destructive
    primary: "hsl(234.4538 89.4737% 73.9216%)", // primary
    text: "hsl(214.2857 31.8182% 91.3725%)", // foreground
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
