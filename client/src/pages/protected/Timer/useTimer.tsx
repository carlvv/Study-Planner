import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetch_backend_auth } from "../../../utils/helper"
import type {Time} from "../../../types"

export function useTimer(subjectId: string) {

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["timer-data", subjectId],  // eindeutiger Key
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

    const queryClient = useQueryClient()
    const createMutation = useMutation({
        mutationFn: async ({module_id, duration_in_min, date, owner_id}: {module_id: string, duration_in_min: number, date: Date, owner_id: string}) => {
            const res = await fetch_backend_auth("/timer_add", { method: "POST", body: JSON.stringify({module_id, duration_in_min, date, owner_id}) })
             if (!res.ok) {
                const err = await res.json()
                throw new Error(err ?? 'Unbekannter Fehler')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["timer-data"],
            })
        }
    })

    return { data, create: createMutation.mutate, isLoading, isError, error }
}