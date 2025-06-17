import { useQuery } from "@tanstack/react-query";
import { downloadFile } from "../api";

export const useDownloadFileQuery = (path = "") => {
    return useQuery({
        queryKey: ["getDownloadFile", path],
        queryFn: () => downloadFile(path),
        retry: 3,
        retryDelay: 3000,
        enabled: !!path
    })
};