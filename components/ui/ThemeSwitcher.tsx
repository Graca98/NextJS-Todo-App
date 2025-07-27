'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'
  const tooltipText = isDark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded hover:bg-muted transition"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-sm">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
