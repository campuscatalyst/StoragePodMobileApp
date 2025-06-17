import { useQuery } from "@tanstack/react-query";
import { getSystemMetrics } from "../api";

export const useGetSystemMetrics = () => {
    return useQuery({
        queryKey: ["getSystemMetrics"],
        queryFn: () => getSystemMetrics(),
        retry: 3,
        retryDelay: 3000,
    })
};