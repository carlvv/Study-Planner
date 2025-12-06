
export function fetch_backend(endpoint: string, options?: RequestInit) {
    const baseUrl = "http://localhost:5000"
    return fetch(baseUrl + endpoint, options)
}   
