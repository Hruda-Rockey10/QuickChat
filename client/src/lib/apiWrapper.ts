import { Env } from "./env";

export const apiWrapper = async <T>(url: string, init?: RequestInit ): Promise<T> => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
        ...init?.headers,
    };

    // Handle relative URLs by appending backend URL
    const fullUrl = url.startsWith("http") ? url : `${Env.NEXT_PUBLIC_BACKEND_URL}${url}`;

    const res = await fetch(fullUrl, {
        ...init,
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "An API error occurred");
    }

    return res.json() as Promise<T>;
};
