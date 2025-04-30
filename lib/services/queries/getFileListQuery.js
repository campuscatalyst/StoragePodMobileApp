import { useQuery } from "@tanstack/react-query";
import { getFileList } from "../api";

export const useGetFileListQuery = (path = "") => {
    return useQuery({
        queryKey: ["getFileList", path],
        queryFn: () => getFileList(path),
        retry: 3,
        retryDelay: 3000,
        enabled: !!path
    })
};