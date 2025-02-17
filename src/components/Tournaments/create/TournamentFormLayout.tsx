import { AlertCircle } from "lucide-react"

interface TournamentFormLayoutProps {
    children: React.ReactNode
    error?: string
  }
  
  export function TournamentFormLayout({ children, error }: TournamentFormLayoutProps) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
  
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }