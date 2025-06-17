import { useQuery } from "@tanstack/react-query";
import { getDisksInfo } from "../api";

export const useGetDisksInfoQuery = () => {
    return useQuery({
        queryKey: ["getDisksInfo"],
        queryFn: () => getDisksInfo(),
        retry: 3,
        retryDelay: 3000,
    })
};