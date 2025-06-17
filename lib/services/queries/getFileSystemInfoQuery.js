import { useQuery } from "@tanstack/react-query";
import { getFileSystemInfo } from "../api";

export const useGetFileSystemInfo = () => {
    return useQuery({
        queryKey: ["getFileSystemInfo"],
        queryFn: () => getFileSystemInfo(),
        retry: 3,
        retryDelay: 3000,
    })
};