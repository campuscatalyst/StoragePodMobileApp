import { Platform } from "react-native";

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

export const baseURl = Platform.select({
  ios: "http://localhost:8000/api/v1",
  android: "http://192.168.0.3:8000/api/v1" // "http://10.0.2.2:8000/api/v1" 
})

export const toolsAvailable = [
  {
    id: 1,
    title: "File Explorer",
    subtitle: "Easily browse, organize, and manage all your files in one place.",
  },
  {
    id: 2,
    title: "VPN",
    subtitle: "Secure your connection and protect your privacy with one tap.",
  },
  {
    id: 3,
    title: "Media Player",
    subtitle: "Enjoy seamless playback of your favorite videos anytime.",
  },
];
