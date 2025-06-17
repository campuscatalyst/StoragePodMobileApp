import Toast from "react-native-toast-message";
import { CustomToast } from "./CustomToast";

export const toastConfig = {
  success: (props) => CustomToast(props, 'rgb(34 197 94)'),
  info: (props) => CustomToast(props, 'rgb(59 130 246)'),
  error: (props) => CustomToast(props, 'rgb(239 68 68)'),
  warning: (props) => CustomToast(props, 'rgb(234 179 8)'),
};

export const successNotification = (message) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "top",
    text1Style:{
      fontSize: 15,
      fontWeight: "800",
    },
    text2Style:{
      fontSize: 13,
      fontWeight: "500",
    }
  });
};

export const errorNotification = (message) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "top",
    text1Style:{
      fontSize: 15,
      fontWeight: "800",
    },
    text2Style:{
      fontSize: 13,
      fontWeight: "500",
    }
  });
};

export const warningNotification = (message) => {
  Toast.show({
    type: "warning",
    text1: "Warning",
    text2: message,
    position: "top",
    text1Style:{
      fontSize: 15,
      fontWeight: "800",
    },
    text2Style:{
      fontSize: 13,
      fontWeight: "500",
    }
  });
};

export const infoNotification = (message) => {
  Toast.show({
    type: "info",
    text1: "Info",
    text2: message,
    position: "top",
    text1Style:{
      fontSize: 15,
      fontWeight: "800",
    },
    text2Style:{
      fontSize: 13,
      fontWeight: "500",
    }
  });
};
