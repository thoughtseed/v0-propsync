"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ComingSoonOverlayProps {
  className?: string
  title?: string
  description?: string
}

export function ComingSoonOverlay({ 
  className,
  title = "Coming Soon",
  description = "This feature is currently under development and will be available soon."
}: ComingSoonOverlayProps) {
  const router = useRouter()
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "backdrop-blur-md bg-white/30",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent",
      "after:absolute after:inset-0 after:bg-gradient-to-tl after:from-blue-500/10 after:to-transparent",
      className
    )}>
      {/* Glassmorphism card */}
      <div className="relative z-10 mx-4 max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-50" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-sm flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
            </div>
          </div>
          
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            {title}
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          {/* Animated dots */}
          <div className="mt-6 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-blue-500/60 animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
          
          {/* Go back button */}
          <div className="mt-8">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}