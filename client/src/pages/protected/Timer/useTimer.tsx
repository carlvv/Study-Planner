import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetch_backend_auth } from "../../../utils/helper"
import type { Module, Time } from "../../../types"

export type TimerModulesResponse = {
    active_modules: Module[]
    all_modules: Module[]
}

export function useTimer(subjectId: string) {

    const queryClient = useQueryClient()

    const { data: recentData, isLoading: recentIsLoading, isError: recentIsError, error: recentError } = useQuery({
        queryKey: ["recent-timer-data"], 
        queryFn: async () => {
            const res = await fetch_backend_auth("/timer_recent")
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Fehler beim Laden der Lernzeiten")
            }
            return res.json() as unknown as Time[]
        },
    })
    
    const { 
        data: modulesData, 
        isLoading: modulesIsLoading, 
        isError: modulesIsError, 
        error: modulesError 
        } = useQuery({
        queryKey: ["modules-data"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/timer_get_modules")
            if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error ?? "Fehler beim Laden der Module")
            }

            const data = await res.json() as TimerModulesResponse

            const uniqueActiveModules = Array.from(
            new Map(
                data.active_modules.map(m => [m.module_id, m])
            ).values()
            )

            return {
            ...data,
            active_modules: uniqueActiveModules
            }
        },
        staleTime: 1000 * 60 * 5,
    })


    const createMutation = useMutation({
        mutationFn: async ({ module_id, duration_in_min, date }: { module_id: string, duration_in_min: number, date: Date }) => {
            const res = await fetch_backend_auth("/timer_add", { method: "POST", body: JSON.stringify({ module_id, duration_in_min, date }) })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err ?? 'Unbekannter Fehler')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recent-timer-data"],
            })
        }
    })

    return {recentData, recentIsLoading, recentIsError, recentError, create: createMutation.mutate, modulesData, modulesIsLoading, modulesIsError, modulesError }
}