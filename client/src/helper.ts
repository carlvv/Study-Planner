import Cookies from "js-cookie";

export function fetch_backend(endpoint: string, options: RequestInit = {}) {
  const baseUrl = "http://localhost:5000";

  return fetch(baseUrl + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export function fetch_backend_auth(
  endpoint: string,
  options: RequestInit = {}
) {
  const baseUrl = "http://localhost:5000";
  const token = Cookies.get("access_token");

  return fetch(baseUrl + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
}
