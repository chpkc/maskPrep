import { useState } from 'react'
import { Plus, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { Subject, Topic } from '../types'

interface DashboardProps {
  subjects: Subject[]
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
}

export default function Dashboard({ subjects, setSubjects }: DashboardProps) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)
  const [newTopicName, setNewTopicName] = useState('')
  const [addingToSubject, setAddingToSubject] = useState<string | null>(null)

  const calculateProgress = (subject: Subject) => {
    if (subject.topics.length === 0) return 0
    const knownCount = subject.topics.filter(t => t.known).length
    return Math.round((knownCount / subject.topics.length) * 100)
  }

  const toggleTopic = (subjectId: string, topicId: string) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id !== subjectId) return subject
      return {
        ...subject,
        topics: subject.topics.map(topic =>
          topic.id === topicId ? { ...topic, known: !topic.known } : topic
        )
      }
    }))
  }

  const addTopic = (subjectId: string) => {
    if (!newTopicName.trim()) return
    const newTopic: Topic = { id: Date.now().toString(), name: newTopicName.trim(), known: false }
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId ? { ...subject, topics: [...subject.topics, newTopic] } : subject
    ))
    setNewTopicName('')
    setAddingToSubject(null)
  }

  const deleteTopic = (subjectId: string, topicId: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId ? { ...subject, topics: subject.topics.filter(t => t.id !== topicId) } : subject
    ))
  }

  const overallProgress = Math.round(subjects.reduce((acc, s) => acc + calculateProgress(s), 0) / subjects.length)

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-stone-800 dark:text-stone-100">Общий прогресс</h2>
          <span className="text-2xl font-light text-stone-800 dark:text-stone-100">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div className="h-full bg-stone-800 dark:bg-stone-200 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
          {subjects.reduce((acc, s) => acc + s.topics.filter(t => t.known).length, 0)} из {subjects.reduce((acc, s) => acc + s.topics.length, 0)} тем изучено
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const progress = calculateProgress(subject)
          const isExpanded = expandedSubject === subject.id
          return (
            <div key={subject.id} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600">
              <button onClick={() => setExpandedSubject(isExpanded ? null : subject.id)} className="w-full p-6 text-left transition-all duration-300 ease-out hover:bg-stone-50 dark:hover:bg-stone-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100">{subject.name}</h3>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-stone-500 dark:text-stone-400">{subject.topics.length} тем</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-600 dark:bg-stone-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 border-t border-stone-100 dark:border-stone-700">
                  <div className="pt-4 space-y-2">
                    {subject.topics.map((topic, index) => (
                      <div key={topic.id} className="flex items-center gap-3 group animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                        <button onClick={() => toggleTopic(subject.id, topic.id)} className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${topic.known ? 'bg-stone-800 dark:bg-stone-200 border-stone-800 dark:border-stone-200' : 'border-stone-300 dark:border-stone-500 hover:border-stone-400'}`}>
                          {topic.known && <Check className="w-3 h-3 text-stone-50 dark:text-stone-800" />}
                        </button>
                        <span className={`flex-grow text-sm ${topic.known ? 'text-stone-400 line-through' : 'text-stone-700 dark:text-stone-300'}`}>{topic.name}</span>
                        <button onClick={() => deleteTopic(subject.id, topic.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-all">
                          <Trash2 className="w-4 h-4 text-stone-400" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {addingToSubject === subject.id ? (
                    <div className="mt-4 flex gap-2 animate-fadeIn">
                      <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTopic(subject.id)} placeholder="Название темы" className="flex-grow px-3 py-2 text-sm bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-stone-800 dark:text-stone-100 transition-all duration-200" autoFocus />
                      <button onClick={() => addTopic(subject.id)} className="p-2 bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-800 rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95"><Check className="w-4 h-4" /></button>
                      <button onClick={() => { setAddingToSubject(null); setNewTopicName('') }} className="p-2 border border-stone-200 dark:border-stone-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-all duration-200"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingToSubject(subject.id)} className="mt-4 flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-all duration-200 hover:translate-x-1">
                      <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" /> Добавить тему
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
