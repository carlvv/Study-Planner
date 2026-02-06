import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetch_backend_auth } from "../../../utils/helper"
import type { Todo } from "../../../types"


export function useTodos() {
    const { data, isLoading } = useQuery({
        queryKey: ["todo-data"],
        queryFn: async () => {
            const res = await fetch_backend_auth("/todos")
            return res.json() as unknown as Todo[]
        },
        refetchOnMount: "always"
    })
    const queryClient = useQueryClient()
    const createMutation = useMutation({
        mutationFn: async ({title, desc}: {title: string, desc: string}) => {
            const res = await fetch_backend_auth("/todo_add", { method: "POST", body: JSON.stringify({title, desc}) })
             if (!res.ok) {
                const err = await res.json()
                throw new Error(err ?? 'Unbekannter Fehler')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todo-data"],
            })
        }
    })


    return { todos: data!, addTodo: createMutation.mutate,  isLoading }
}