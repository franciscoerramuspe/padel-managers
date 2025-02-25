"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 rounded-md border border-gray-200 dark:border-gray-800"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4 text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun className="h-4 w-4 text-gray-800 dark:text-gray-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 