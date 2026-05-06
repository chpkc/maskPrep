import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import type { TimerMode } from '../types'

const DEFAULT_TIMES = { work: 25, shortBreak: 5, longBreak: 15 }

interface TimerContextType {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  customTimes: typeof DEFAULT_TIMES
  soundEnabled: boolean
  completedSessions: number
  showSettings: boolean
  toggleTimer: () => void
  resetTimer: () => void
  switchMode: (newMode: TimerMode) => void
  setCustomTimes: (times: typeof DEFAULT_TIMES | ((prev: typeof DEFAULT_TIMES) => typeof DEFAULT_TIMES)) => void
  setSoundEnabled: (enabled: boolean) => void
  setShowSettings: (show: boolean) => void
  formatTime: (seconds: number) => string
  progress: number
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [customTimes, setCustomTimes] = useState(DEFAULT_TIMES)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
  }, [])

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [soundEnabled])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      playSound()
      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1)
        setMode(completedSessions % 4 === 3 ? 'longBreak' : 'shortBreak')
        setTimeLeft((completedSessions % 4 === 3 ? customTimes.longBreak : customTimes.shortBreak) * 60)
      } else {
        setMode('work')
        setTimeLeft(customTimes.work * 60)
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, timeLeft, mode, customTimes, completedSessions, playSound])

  const toggleTimer = () => setIsRunning(!isRunning)
  
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(customTimes[mode] * 60)
  }

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(customTimes[newMode] * 60)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((customTimes[mode] * 60 - timeLeft) / (customTimes[mode] * 60)) * 100

  return (
    <TimerContext.Provider value={{
      mode,
      timeLeft,
      isRunning,
      customTimes,
      soundEnabled,
      completedSessions,
      showSettings,
      toggleTimer,
      resetTimer,
      switchMode,
      setCustomTimes,
      setSoundEnabled,
      setShowSettings,
      formatTime,
      progress
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
