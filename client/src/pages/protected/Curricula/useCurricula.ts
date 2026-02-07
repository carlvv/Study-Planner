import { useQuery } from "@tanstack/react-query";
import { fetch_backend_auth } from "../../../utils/helper";
import type { Module } from "../../../types";

interface Data {
    name: string,
    stats: number[]
    modules: Module[]
}
export const useCurricula = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["curricula-data"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/curricula");
            return res.json() as unknown as Data;
        },
        staleTime: Infinity,
        refetchOnMount: "always",
    });
    if (isLoading) {
        return { isLoading }
    }
    console.log(data)


    return { name: data?.name ?? "", modules: data?.modules ?? [], stats: data?.stats ?? [], isLoading }
}