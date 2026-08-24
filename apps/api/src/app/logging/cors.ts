// Allowed origins for CORS
export const allowedOrigins: string[] = [
  "http://localhost:3000",
  // Add common development origins
  "http://127.0.0.1:3000",
  // Local backend preview ports for static test pages
  "http://localhost:5000",
  "http://localhost:5001",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5001",
  // Dev server alternate ports
  "http://localhost:5003",
  "http://127.0.0.1:5003",
  "http://localhost:5005",
  "http://127.0.0.1:5005"
];

export const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // allow non-browser clients (Postman/mobile)
  if (allowedOrigins.includes(origin)) return true;

  // Allow local network origins in development (10.x.x.x, 192.168.x.x, 172.x.x.x)
  if (process.env.NODE_ENV === "development") {
    if (
      origin.startsWith("http://10.") ||
      origin.startsWith("https://10.") ||
      origin.startsWith("http://192.168.") ||
      origin.startsWith("https://192.168.") ||
      origin.startsWith("http://172.") ||
      origin.startsWith("https://172.")
    ) {
      return true;
    }
  }

  return false;
};
