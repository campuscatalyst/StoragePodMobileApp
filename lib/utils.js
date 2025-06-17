import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LocalAuthentication from "expo-local-authentication";
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';
import dayjs from "dayjs";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

//rating is number
export const getRatingColor = (rating) => {
  switch (rating) {
    case 1:
      return "#f44336";
    case 2:
      return "#ff9800";
    case 3:
      return "#ffeb3b";
    case 4:
      return "#2196f3";
    case 5:
      return "#4caf50";
    default:
      return "#7c3aed";
  }
};

//rating - number
export const getFeedbackOptions = (rating) => {
  if (rating <= 2) {
    return [
      { id: 1, feedback: "Slow upload/download speeds" },
      { id: 2, feedback: "Difficulty connecting to the Storagepod" },
      { id: 3, feedback: "Uploading/Downloading challenges" },
      { id: 4, feedback: "Technical glitches" },
      { id: 5, feedback: "Unintuitive interface" },
      { id: 6, feedback: "Slow performance" },
      { id: 7, feedback: "Poor video quality" },
      { id: 8, feedback: "Didn't meet expectations" },
      { id: 9, feedback: "Complexity of use" },
    ];
  } else if (rating === 3) {
    return [
      { id: 1, feedback: "Some features work well" },
      { id: 2, feedback: "Room for improvement" },
      { id: 3, feedback: "Consistent but not exceptional" },
      { id: 4, feedback: "Average performance" },
      { id: 5, feedback: "Potential new features" },
    ];
  } else {
    return [
      { id: 1, feedback: "Ease of use" },
      { id: 2, feedback: "Upload/downloading files" },
      { id: 3, feedback: "Easy connections with the Storagepod" },
      { id: 4, feedback: "Consistent performance" },
      { id: 5, feedback: "Multiple useful features" },
      { id: 6, feedback: "Responsive assistance" },
      { id: 7, feedback: "Minimal technical issues" },
    ];
  }
};

//rating - number
export const getFeedbackOptionsTitleSubtitle = (rating) => {
  if (rating <= 2) {
    return {
      title: "Areas for Improvement",
      subtitle: "Help us understand where we can do better"
    };
  } else if (rating === 3) {
    return {
      title: "Room for Growth",
      subtitle: "Your insights can help us improve"
    };
  } else {
    return {
      title: "What We're Doing Right",
      subtitle: "We appreciate your positive feedback"
    };
  }
}

/**
 *
 * @param {*} filterEnabled Boolean to check if we need to filter or not
 * @param {*} items This will be an array of all the files, where we need to filter with names starting with "."
 */
export const filterHiddenItems = (filterEnabled, items) => {
  if (!filterEnabled && items) {
    //we need to remove the files which are starting with "."
    return items.filter((item) => !item.name?.startsWith("."));
  }

  return items;
};

export const getPath = (data) => {
  return data?.length ? data.join("/").replace(/\/+/g, "/") : null;
};

export const getFolderTitle = (data) => {
  const title = data?.length ? data[data.length - 1] : null;
  return title === "/" ? "Home" : title;
};

export const isMediaMimeType = (mimeType) => {
  return mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType.startsWith("audio/");
}

export const getMimeType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  const mimeTypes = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/vnd.microsoft.icon",
    tif: "image/tiff",
    tiff: "image/tiff",
    avif: "image/avif",

    // Videos
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    wmv: "video/x-ms-wmv",
    flv: "video/x-flv",
    mkv: "video/x-matroska",
    webm: "video/webm",
    "3gp": "video/3gpp",
    "3g2": "video/3gpp2",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    ogv: "video/ogg",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    flac: "audio/flac",
    ogg: "audio/ogg",
    opus: "audio/opus",
    aac: "audio/aac",
    wma: "audio/x-ms-wma",
    amr: "audio/amr",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    rtf: "application/rtf",
    csv: "text/csv",
    html: "text/html",
    htm: "text/html",
    xml: "application/xml",
    json: "application/json",
    md: "text/markdown",
    yaml: "text/yaml",
    yml: "text/yaml",

    // Archives & Compressed Files
    zip: "application/zip",
    tar: "application/x-tar",
    gz: "application/gzip",
    rar: "application/vnd.rar",
    "7z": "application/x-7z-compressed",
    bz2: "application/x-bzip2",
    xz: "application/x-xz",
    iso: "application/x-iso9660-image",
    dmg: "application/x-apple-diskimage",

    // Applications / Executables
    exe: "application/vnd.microsoft.portable-executable",
    dll: "application/vnd.microsoft.portable-executable",
    bin: "application/octet-stream",
    deb: "application/vnd.debian.binary-package",
    rpm: "application/x-rpm",
    jar: "application/java-archive",
    war: "application/java-archive",

    //fonts
    ttf: "font/ttf",
    otf: "font/otf",
    woff: "font/woff",
    woff2: "font/woff2",

    // Miscellaneous
    epub: "application/epub+zip",
    mobi: "application/x-mobipocket-ebook",
    azw: "application/vnd.amazon.ebook",
    azw3: "application/vnd.amazon.ebook",
    pkpass: "application/vnd.apple.pkpass",
    ics: "text/calendar",
    glb: "model/gltf-binary",
    gltf: "model/gltf+json",
  };
  return mimeTypes[extension] || "application/octet-stream"; // Fallback MIME type
};

export const localAuthenticateUser = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      console.log("No biometric or device credentials set up.");
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      fallbackLabel: "Use passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false, // set to false to allow fallback to PIN/pattern/password
    });

    console.error(result);
    if (result.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const initialisePinning = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeSslPinning({
        "storagepod.local": {
          publicKeyHashes: [
            "C/8Mp9slkHwZWXLTPHX7bR70RVXGc9aL1L/CbuD7sgI=",
            "ZiNs+omFKeFSk32EPcO3020ZjhblHd6m4nKOyP6OtGw=",
          ]
        }
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export const getGreetingBasedOnTime = () => {
  const time = dayjs();
  if (time >= 0 && time <= 11) {
    return "Good Morning";
  } else if (time > 11 && time < 16) {
    return "Good Afternoon";
  } else if (time >= 16) {
    return "Good Evening";
  }
};
