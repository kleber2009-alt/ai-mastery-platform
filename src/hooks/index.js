import { useState, useEffect, useCallback } from 'react'
import { registerUser, getAllLessons, getUserProgress, markLessonComplete } from '../lib/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const tg = window.Telegram?.WebApp
        tg?.ready()
        tg?.expand()

        const tgUser = tg?.initDataUnsafe?.user

        if (tgUser?.id) {
          // Реальный пользователь из Telegram
          const u = await registerUser(tgUser)
          setUser(u)
        } else {
          // Fallback — гостевой режим (для браузера вне Telegram)
          setUser({
            id: null,
            telegram_id: null,
            name: 'Гость',
            plan: 'free'
          })
        }
      } catch(err) {
        console.error('Auth error:', err)
        // Даже при ошибке показываем контент
        setUser({ id: null, name: 'Гость', plan: 'free' })
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
    getAllLessons()
      .then(data => setLessons(data || []))
      .catch(err => {
        console.error('Lessons error:', err)
        setLessons([])
      })
      .finally(() => setLoading(false))
  }, [])

  const getLessonsByLevel = (lvl) => lessons.filter(l => l.level === lvl)
  return { lessons, loading, getLessonsByLevel }
}

export function useProgress(userId) {
  const [progress, setProgress] = useState([])

  const fetch = useCallback(async () => {
    if (!userId) return
    try {
      const data = await getUserProgress(userId)
      setProgress(data || [])
    } catch(err) {
      console.error('Progress error:', err)
    }
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const getLessonStatus = (lessonId) =>
    progress.find(p => p.lesson_id === lessonId)?.status || 'not_started'

  const complete = async (lessonId) => {
    if (!userId) return
    await markLessonComplete(userId, lessonId)
    await fetch()
  }

  const completedCount = progress.filter(p => p.status === 'completed').length

  return { progress, getLessonStatus, complete, completedCount, refetch: fetch }
}
