/** Backend REST API base URL, e.g. http://localhost:8080/api */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

/** Backend origin that serves /uploads/..., e.g. http://localhost:8080 */
export const BACKEND_BASE_URL: string = (
  import.meta.env.VITE_BASE_URL ?? API_BASE_URL.replace(/\/api\/?$/, "")
).replace(/\/$/, "");

/**
 * Turns a stored file path ("/uploads/licence/abc.pdf") into a URL the browser can load.
 * Relative paths must point at the backend, not at the dashboard's own origin.
 */
export function fileUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  return `${BACKEND_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
