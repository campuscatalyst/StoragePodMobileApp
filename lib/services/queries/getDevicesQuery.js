import { useQuery } from "@tanstack/react-query";
import { getDevices, getDevice } from "~/lib/db/api";

export const useGetDevicesQuery = () => {
  return useQuery({
    queryKey: ["getDevices"],
    queryFn: () => getDevices(),
    retry: 3,
    retryDelay: 3000,
  });
};

export const useGetDeviceQuery = (ip) => {
  return useQuery({
    queryKey: ["getDevice", ip],
    queryFn: () => getDevice(ip),
    retry: 3,
    retryDelay: 3000,
  });
};
