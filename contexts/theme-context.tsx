"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem("luxury-dashboard-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("luxury-dashboard-theme", theme)

      // Aplicar clase al documento
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const value = {
    theme,
    toggleTheme,
    setTheme,
  }

  // Evitar hidration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
