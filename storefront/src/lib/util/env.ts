export function getBaseURL() {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL?.split(",")[0] || "http://localhost:8000";
}