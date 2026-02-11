import { useQuery } from "@tanstack/react-query"
import { fetch_backend_auth } from "../../../utils/helper"
import type { WeeklyData } from "./WeeklyDiagramm";

interface ModuleStatistic {
  name: string;
  totalTime: number;
  sessionCount: number;
  last_session: string;
}

interface Data {
    stats: {
        daily: number
        weekly: number
        avg: number
        total: number
    }
    weeklyDistribution: WeeklyData
    modules: ModuleStatistic[]   
}

export const useDashboard = () => {
    return useQuery({
        queryKey: [],
        queryFn: async () => {
            const res = await fetch_backend_auth("/statistics")
            if (!res.ok) {
                new Error("Daten konnten nicht geladen werden.")
            }
            
            return await res.json() as unknown as Data
        },
        refetchOnMount: "always"
    })
}