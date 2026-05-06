import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function DeadlineCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const deadline = new Date('2026-05-15T00:00:00')
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = deadline.getTime() - now.getTime()
      
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
      
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
      <AlertCircle className="w-4 h-4 text-stone-600 dark:text-stone-400" />
      <div className="text-sm">
        <span className="text-stone-500 dark:text-stone-400">До экзамена:</span>
        <span className="ml-2 font-medium text-stone-800 dark:text-stone-100">
          {timeLeft.days}д {timeLeft.hours}ч
        </span>
      </div>
    </div>
  )
}
