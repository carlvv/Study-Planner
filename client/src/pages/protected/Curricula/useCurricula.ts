import { useQuery } from "@tanstack/react-query";
import { fetch_backend_auth } from "../../../utils/helper";

export const useCurricula = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["curricula-data"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/curricula");
            return res.json() ;
        },
        staleTime: Infinity,
        refetchOnMount: "always",
    });
    if (isLoading) {
        return { isLoading }
    }
    console.log(data)


    return { name: data.name, modules: data.modules, stats: data.stats, isLoading }
}