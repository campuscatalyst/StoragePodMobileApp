import { useQuery } from "@tanstack/react-query";
import { getFileExplorerMetrics } from "../api";

export const useGetFileExplorerMetrics = () => {
    return useQuery({
        queryKey: ["getFileExplorerMetrics"],
        queryFn: () => getFileExplorerMetrics(),
        retry: 3,
        retryDelay: 3000
    })
};