import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function LoadingSpinner({ 
  size = "md", 
  showText = false,
  className,
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)} {...props}>
      <div
        className={cn(
          "animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-purple-600 dark:border-t-purple-500",
          sizeClasses[size]
        )}
      />
      {showText && (
        <p className="text-sm text-gray-600 dark:text-gray-300">Cargando...</p>
      )}
    </div>
  )
}