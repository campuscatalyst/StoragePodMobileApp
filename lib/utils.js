import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * 
 * @param {*} filterEnabled Boolean to check if we need to filter or not
 * @param {*} items This will be an array of all the files, where we need to filter with names starting with "."
 */
export const filterHiddenItems = (filterEnabled, items) => {
  if(!filterEnabled && items) {
    //we need to remove the files which are starting with "."
    return items.filter((item) => !item.name?.startsWith("."));
  }

  return items;
}
