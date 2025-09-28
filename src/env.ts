// Client-side environment variables
export const env = {
  // Only expose NEXT_PUBLIC_ variables to the client
  ...Object.fromEntries(
    Object.entries(process.env)
      .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
  ),
  // Server-side variables (null in browser)
  server: typeof window === 'undefined' ? process.env : null
} as const;
