import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetch_backend_auth } from "../../../utils/helper"
import type { Time } from "../../../types"

export function useTimer(subjectId: string) {

    const queryClient = useQueryClient()

    const { data: recentData, isLoading: recentIsLoading, isError: recentIsError, error: recentError } = useQuery({
        queryKey: ["recent-timer-data", subjectId],  // eindeutiger Key
        queryFn: async () => {
            const res = await fetch_backend_auth("/timer_recent")
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Fehler beim Laden der Lernzeiten")
            }
            return res.json() as unknown as Time[]
        },
        staleTime: 1000 * 60 * 5,
    })
    /*
    const { data: modulesData, isLoading: modulesIsLoading, isError: modulesIsError, error: modulesError } = useQuery({
        queryKey: ["modules-data"],  // eindeutiger Key
        queryFn: async () => {
            const res = await fetch_backend_auth("/get_user_modules")
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Fehler beim Laden der Module")
            }
            return res.json() as unknown as Time[]
        },
        staleTime: 1000 * 60 * 5,
    })
        */

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
                queryKey: ["recent-timer-data", subjectId],
            })
        }
    })

    return {recentData, recentIsLoading, recentIsError, recentError, create: createMutation.mutate /*,modulesData, modulesIsLoading, modulesIsError, modulesError */ }
}