import { useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "../api";

export const useGetRecentActivityQuery = () => {
    return useQuery({
        queryKey: ["getRecentActivity"],
        queryFn: () => getRecentActivity(),
        retry: 3,
        retryDelay: 3000,
    });
};