import { useTimer } from '../context/TimerContext'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function MiniTimer() {
  const { mode, timeLeft, isRunning, toggleTimer, resetTimer, formatTime, progress } = useTimer()

  const modeColors = {
    work: 'bg-blue-500',
    shortBreak: 'bg-green-500', 
    longBreak: 'bg-purple-500'
  }

  const modeNames = {
    work: 'Работа',
    shortBreak: 'Перерыв',
    longBreak: 'Длинный'
  }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6 animate-scaleIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100">Помодоро</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${modeColors[mode]}`}>
          {modeNames[mode]}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" className="stroke-stone-200 dark:stroke-stone-700 fill-none" strokeWidth="4" />
            <circle 
              cx="40" cy="40" r="36" 
              className={`${modeColors[mode]} fill-none transition-all duration-1000`} 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray={`${2 * Math.PI * 36}`} 
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`} 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-mono text-stone-800 dark:text-stone-100">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-sm text-stone-500 dark:text-stone-400 mb-2">
            {isRunning ? 'В процессе...' : 'На паузе'}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleTimer}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                isRunning 
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300' 
                  : 'bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={resetTimer}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-stone-500 dark:text-stone-400">
        Переключайся на вкладку "Помодоро" для настроек
      </div>
    </div>
  )
}
