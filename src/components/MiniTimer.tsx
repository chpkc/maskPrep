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
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700 p-4 animate-fadeIn sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" className="stroke-stone-200 dark:stroke-stone-700 fill-none" strokeWidth="3" />
              <circle 
                cx="24" cy="24" r="20" 
                className={`${modeColors[mode]} fill-none transition-all duration-1000`} 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeDasharray={`${2 * Math.PI * 20}`} 
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-stone-800 dark:text-stone-100 font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{modeNames[mode]}</span>
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-stone-400'}`} />
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              {isRunning ? 'В процессе' : 'На паузе'}
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <button 
            onClick={toggleTimer}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              isRunning 
                ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300' 
                : 'bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button 
            onClick={resetTimer}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
