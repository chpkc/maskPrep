import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react'
import type { TimerMode } from '../types'

const DEFAULT_TIMES = { work: 25, shortBreak: 5, longBreak: 15 }

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [customTimes, setCustomTimes] = useState(DEFAULT_TIMES)
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [completedSessions, setCompletedSessions] = useState(0)
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
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 p-8 animate-scaleIn">
        <div className="flex justify-center gap-2 mb-8">
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
            <button key={m} onClick={() => switchMode(m)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${mode === m ? 'bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 shadow-lg' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'}`}>
              {m === 'work' ? 'Работа' : m === 'shortBreak' ? 'Перерыв' : 'Длинный перерыв'}
            </button>
          ))}
        </div>

        <div className="relative mb-8">
          <svg className="w-48 h-48 mx-auto transform -rotate-90">
            <circle cx="96" cy="96" r="88" className="stroke-stone-200 dark:stroke-stone-700 fill-none" strokeWidth="8" />
            <circle cx="96" cy="96" r="88" className="stroke-stone-800 dark:stroke-stone-200 fill-none transition-all duration-1000" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 88}`} strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-light text-stone-800 dark:text-stone-100 tabular-nums">{formatTime(timeLeft)}</div>
              <div className="mt-2 text-sm text-stone-500">{isRunning ? 'В процессе...' : 'На паузе'}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={toggleTimer} className={`w-14 h-14 rounded-full bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl ${isRunning ? 'animate-pulse-soft' : ''}`}>
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button onClick={resetTimer} className="w-14 h-14 rounded-full border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 flex items-center justify-center transition-all duration-200 hover:bg-stone-100 dark:hover:bg-stone-700 hover:scale-105 active:scale-95">
            <RotateCcw className={`w-5 h-5 transition-transform duration-500 ${isRunning ? '' : 'hover:rotate-180'}`} />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`w-14 h-14 rounded-full border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 flex items-center justify-center transition-all duration-200 hover:bg-stone-100 dark:hover:bg-stone-700 hover:scale-105 active:scale-95 ${showSettings ? 'bg-stone-100 dark:bg-stone-700 rotate-45' : ''}`}>
            <Settings className="w-5 h-5 transition-transform duration-300" />
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-14 h-14 rounded-full border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 flex items-center justify-center transition-all duration-200 hover:bg-stone-100 dark:hover:bg-stone-700 hover:scale-105 active:scale-95">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showSettings ? 'max-h-48 opacity-100 mt-8 pt-6 border-t border-stone-200 dark:border-stone-700' : 'max-h-0 opacity-0'}`}>
          <h4 className="text-sm font-medium text-stone-800 dark:text-stone-100 mb-4">Настройки времени (мин)</h4>
          <div className="grid grid-cols-3 gap-4">
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
              <div key={m}>
                <label className="block text-xs text-stone-500 mb-1">{m === 'work' ? 'Работа' : m === 'shortBreak' ? 'Перерыв' : 'Длинный'}</label>
                <input type="number" value={customTimes[m]} onChange={(e) => setCustomTimes(prev => ({ ...prev, [m]: Math.max(1, parseInt(e.target.value) || 1) }))} className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg text-center text-stone-800 dark:text-stone-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-stone-500">
          Завершено сессий: <span className="font-medium text-stone-800 dark:text-stone-100">{completedSessions}</span>
        </div>
      </div>
    </div>
  )
}
