import { useQuery } from "@tanstack/react-query";
import { fetch_backend } from "../../../utils/helper";

interface Curricula {
    name: string,
    version: string,
}

interface Data {
    true: Curricula[]
    false: Curricula[]
}

export function usePrograms() {
    const {
        data,  
        isLoading,
        error,
    } = useQuery({
        queryKey: ["programm-data"],
        queryFn: async () => {
            const res = await fetch_backend("/get_all_programs");
            return res.json() as unknown as Data;
        },
        staleTime: Infinity,
        refetchOnMount: "always",
    });
    return { data ,isLoading, error } 
}