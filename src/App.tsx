import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Clock, Moon, Sun, Target } from 'lucide-react'
import { TimerProvider } from './context/TimerContext'
import Dashboard from './components/Dashboard'
import CalendarView from './components/CalendarView'
import PomodoroTimer from './components/PomodoroTimer'
import MiniTimer from './components/MiniTimer'
import DeadlineCountdown from './components/DeadlineCountdown'
import type { Subject, StudyPlan } from './types'

const defaultSubjects: Subject[] = [
  { id: '1', name: 'Математика', topics: [] },
  { id: '2', name: 'Физика', topics: [] },
  { id: '3', name: 'Русский язык', topics: [] },
  { id: '4', name: 'Казахский язык', topics: [] },
  { id: '5', name: 'История Казахстана', topics: [] },
]

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('mesk-subjects')
    return saved ? JSON.parse(saved) : defaultSubjects
  })
  
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('mesk-plans')
    return saved ? JSON.parse(saved) : []
  })
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'timer' | 'mini-timer'>('dashboard')

  useEffect(() => {
    localStorage.setItem('mesk-subjects', JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem('mesk-plans', JSON.stringify(studyPlans))
  }, [studyPlans])

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <TimerProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-800 dark:bg-stone-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-stone-50 dark:text-stone-800" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100">MESK Prep</h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">Подготовка к экзаменам</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DeadlineCountdown />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-all duration-300 hover:scale-110 active:scale-95 active:rotate-12"
                aria-label={darkMode ? 'Включить светлую тему' : 'Включить темную тему'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                activeTab === 'dashboard'
                  ? 'bg-stone-800 text-stone-50 dark:bg-stone-100 dark:text-stone-800'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Предметы</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                activeTab === 'calendar'
                  ? 'bg-stone-800 text-stone-50 dark:bg-stone-100 dark:text-stone-800'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Календарь</span>
            </button>
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                activeTab === 'timer'
                  ? 'bg-stone-800 text-stone-50 dark:bg-stone-100 dark:text-stone-800'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Помодоро</span>
            </button>
            <button
              onClick={() => setActiveTab('mini-timer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
                activeTab === 'mini-timer'
                  ? 'bg-stone-800 text-stone-50 dark:bg-stone-100 dark:text-stone-800'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Мини</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && (
            <Dashboard subjects={subjects} setSubjects={setSubjects} />
          )}
          {activeTab === 'calendar' && (
            <CalendarView studyPlans={studyPlans} setStudyPlans={setStudyPlans} subjects={subjects} />
          )}
          {activeTab === 'timer' && <PomodoroTimer />}
        {activeTab === 'mini-timer' && <MiniTimer />}
        </div>
      </main>
    </div>
    </TimerProvider>
  )
}

export default App
