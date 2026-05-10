import { useState, useEffect, useCallback } from 'react'
import { registerUser, getAllLessons, getUserProgress, markLessonComplete } from '../lib/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const tg = window.Telegram?.WebApp
        const tgUser = tg?.initDataUnsafe?.user
        if (tgUser) {
          const u = await registerUser(tgUser)
          setUser(u)
        } else if (import.meta.env.DEV) {
          setUser({ id: 'dev-id', telegram_id: 123, name: 'Dev User', plan: 'pro' })
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return { user, loading }
}

export function useLessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllLessons().then(setLessons).finally(() => setLoading(false))
  }, [])

  const getLessonsByLevel = (lvl) => lessons.filter(l => l.level === lvl)
  return { lessons, loading, getLessonsByLevel }
}

export function useProgress(userId) {
  const [progress, setProgress] = useState([])

  const fetch = useCallback(async () => {
    if (!userId) return
    const data = await getUserProgress(userId)
    setProgress(data)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const getLessonStatus = (lessonId) =>
    progress.find(p => p.lesson_id === lessonId)?.status || 'not_started'

  const complete = async (lessonId) => {
    await markLessonComplete(userId, lessonId)
    await fetch()
  }

  const completedCount = progress.filter(p => p.status === 'completed').length

  return { progress, getLessonStatus, complete, completedCount, refetch: fetch }
}
