import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetch_backend_auth } from "../../../utils/helper"
import type { Task, Todo } from "../../../types"

export function useTask(id: string) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["todo-data", id],  // eindeutiger Key
        queryFn: async () => {
            const res = await fetch_backend_auth("/todo/" + id)
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Fehler beim Laden des Todos")
            }
            return res.json() as unknown as Todo
        },
        staleTime: 1000 * 60 * 5,
    })

    const queryClient = useQueryClient()
    const updateMutation = useMutation({
        mutationFn: async ({ title, desc, aufgaben }: { title: string, desc: string, aufgaben: Task[] }) => {
            console.log({ title, desc, aufgaben })
            const res = await fetch_backend_auth("/todo_update/" + id, { method: "POST", body: JSON.stringify({ title, desc, aufgaben }) })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err ?? 'Unbekannter Fehler')
            }
            console.log(await res.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todo-data", id],
            })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch_backend_auth("/todo_delete/" + id, {method: "DELETE"})
            if(!res.ok) {
                const err = await res.json()
                throw new Error(err ?? 'Unbekannter Fehler')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todo-data", id],
            })
        }
    })


    return { todo: data, update: updateMutation.mutate, deleteTodo: deleteMutation.mutateAsync, isLoading, isError, error }
}
