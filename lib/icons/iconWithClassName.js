import { cssInterop } from "nativewind";

export function iconWithClassName(icon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
        height: true,
        width: true,
        size: true,
      },
    },
  });
}
