import { useQuery } from "@tanstack/react-query";
import { searchItem } from "../api";

export const useSearchItemQuery = (query = "") => {
    return useQuery({
        queryKey: ["getSearchItem", query],
        queryFn: () => searchItem(query),
        retry: 3,
        retryDelay: 3000,
        enabled: !!query
    })
};