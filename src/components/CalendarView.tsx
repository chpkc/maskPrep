import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2, Check } from 'lucide-react'
import type { Subject, StudyPlan } from '../types'

interface CalendarViewProps {
  studyPlans: StudyPlan[]
  setStudyPlans: React.Dispatch<React.SetStateAction<StudyPlan[]>>
  subjects: Subject[]
}

export default function CalendarView({ studyPlans, setStudyPlans, subjects }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPlan, setNewPlan] = useState({ subjectId: '', topic: '' })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const getPlansForDate = (dateStr: string) => studyPlans.filter(p => p.date === dateStr)

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setShowAddModal(true)
  }

  const addPlan = () => {
    if (!newPlan.topic.trim() || !selectedDate) return
    const plan: StudyPlan = { id: Date.now().toString(), date: selectedDate, subjectId: newPlan.subjectId || undefined, topic: newPlan.topic.trim(), completed: false }
    setStudyPlans(prev => [...prev, plan])
    setNewPlan({ subjectId: '', topic: '' })
    setShowAddModal(false)
  }

  const togglePlan = (planId: string) => {
    setStudyPlans(prev => prev.map(p => p.id === planId ? { ...p, completed: !p.completed } : p))
  }

  const deletePlan = (planId: string) => {
    setStudyPlans(prev => prev.filter(p => p.id !== planId))
  }

  const getSubjectName = (id?: string) => id ? subjects.find(s => s.id === id)?.name : null

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-stone-800 dark:text-stone-100">{monthNames[month]} {year}</h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">Сегодня</button>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => <div key={day} className="text-center text-xs font-medium text-stone-500 py-2">{day}</div>)}
          {Array.from({ length: (firstDay + 6) % 7 }, (_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const plans = getPlansForDate(dateStr)
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
            return (
              <button key={day} onClick={() => handleDateClick(day)} className={`aspect-square p-2 rounded-xl text-left transition-all duration-300 ease-out hover:bg-stone-100 dark:hover:bg-stone-700 hover:scale-105 active:scale-95 ${isToday ? 'ring-2 ring-stone-800 dark:ring-stone-200 bg-stone-50 dark:bg-stone-800' : ''}`}>
                <span className={`text-sm font-medium ${isToday ? 'text-stone-800 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}>{day}</span>
                {plans.length > 0 && (
                  <div className="mt-1">
                    <div className={`h-1.5 w-1.5 rounded-full mx-auto ${plans.some(p => !p.completed) ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <span className="text-[10px] text-stone-400 block text-center mt-0.5">{plans.filter(p => p.completed).length}/{plans.length}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6 animate-slideIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100">
              {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </h3>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"><Plus className="w-4 h-4 transition-transform duration-300" />Добавить</button>
          </div>

          <div className="space-y-3">
            {getPlansForDate(selectedDate).length === 0 ? (
              <p className="text-center text-stone-500 py-8">Нет планов на этот день</p>
            ) : (
              getPlansForDate(selectedDate).map(plan => (
                <div key={plan.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ease-out hover:shadow-sm hover:scale-[1.01] ${plan.completed ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-700' : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'}`}>
                  <button onClick={() => togglePlan(plan.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${plan.completed ? 'bg-stone-800 dark:bg-stone-200 border-stone-800 dark:border-stone-200 scale-110' : 'border-stone-300 dark:border-stone-500 hover:border-stone-500'}`}>
                    {plan.completed && <Check className="w-3 h-3 text-stone-50 dark:text-stone-800" />}
                  </button>
                  <div className="flex-grow">
                    <p className={`text-sm font-medium ${plan.completed ? 'text-stone-400 line-through' : 'text-stone-800 dark:text-stone-100'}`}>{plan.topic}</p>
                    {getSubjectName(plan.subjectId) && <p className="text-xs text-stone-500">{getSubjectName(plan.subjectId)}</p>}
                  </div>
                  <button onClick={() => deletePlan(plan.id)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"><Trash2 className="w-4 h-4 text-stone-400 transition-colors hover:text-red-500" /></button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-md animate-scaleIn shadow-2xl">
            <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100 mb-4">Добавить план</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-stone-500 mb-1">Предмет (опционально)</label>
                <select value={newPlan.subjectId} onChange={(e) => setNewPlan(prev => ({ ...prev, subjectId: e.target.value }))} className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg text-stone-800 dark:text-stone-100">
                  <option value="">Заметка (без предмета)</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-stone-500 mb-1">Тема / Заметка</label>
                <input type="text" value={newPlan.topic} onChange={(e) => setNewPlan(prev => ({ ...prev, topic: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addPlan()} placeholder="Что будете изучать или заметка..." className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg text-stone-800 dark:text-stone-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-stone-200 dark:border-stone-600 rounded-lg text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all duration-200 hover:scale-105 active:scale-95">Отмена</button>
                <button onClick={addPlan} className="flex-1 py-2 bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 rounded-lg font-medium hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
