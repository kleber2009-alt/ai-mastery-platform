import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const PLAN_ORDER = ['free', 'pro', 'builder', 'architect']
export function hasAccess(userPlan, requiredPlan) {
  return PLAN_ORDER.indexOf(userPlan || 'free') >= PLAN_ORDER.indexOf(requiredPlan || 'free')
}

export async function registerUser(tgUser) {
  const { data } = await supabase
    .from('users')
    .upsert({
      telegram_id: tgUser.id,
      name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
      last_active: new Date().toISOString()
    }, { onConflict: 'telegram_id' })
    .select().single()
  return data
}

export async function getAllLessons() {
  const { data } = await supabase
    .from('lessons').select('*')
    .eq('is_published', true)
    .order('level').order('order_num')
  return data || []
}

export async function getUserProgress(userId) {
  const { data } = await supabase
    .from('progress').select('*')
    .eq('user_id', userId)
  return data || []
}

export async function markLessonComplete(userId, lessonId) {
  const { data } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'completed',
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,lesson_id' })
    .select().single()
  return data
}
