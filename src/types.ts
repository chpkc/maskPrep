export interface Topic {
  id: string
  name: string
  known: boolean
}

export interface Subject {
  id: string
  name: string
  topics: Topic[]
}

export interface StudyPlan {
  id: string
  date: string
  subjectId?: string
  topic: string
  completed: boolean
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'
