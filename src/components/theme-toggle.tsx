"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevenir hidratación incorrecta
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-16 h-8 rounded-full">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                dark:from-indigo-600 dark:to-purple-700 p-[2px] transition-colors duration-200
                hover:from-blue-600 hover:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-800"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-0 dark:opacity-50 transition-opacity duration-200" />
      </div>
      
      <div className="relative h-full w-full rounded-full bg-white dark:bg-gray-900 
                    transition-colors duration-200">
        <span className={`absolute top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center 
                       rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 
                       dark:from-blue-400 dark:to-indigo-500 transition-all duration-500 
                       ${theme === 'dark' ? 'left-[calc(100%-1.75rem)]' : 'left-1'}`}>
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-white rotate-0 scale-100 transition-all" />
          ) : (
            <Sun className="h-4 w-4 text-white rotate-0 scale-100 transition-all" />
          )}
        </span>
      </div>
    </Button>
  )
} 