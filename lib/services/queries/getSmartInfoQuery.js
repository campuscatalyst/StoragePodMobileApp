import { useQuery } from "@tanstack/react-query";
import { getSmartInfo } from "../api";

export const useGetSmartInfoQuery = () => {
    return useQuery({
        queryKey: ["getSmartInfo"],
        queryFn: () => getSmartInfo(),
        retry: 3,
        retryDelay: 3000,
    })
};