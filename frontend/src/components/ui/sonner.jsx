import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: "white",
          color: "#1e40af",
          border: "1px solid #93c5fd",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "1rem",
          fontSize: "0.875rem",
        },
        className: "transform-gpu transition-all duration-300 ease-in-out",
      }}
    />
  )
}

