import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase env vars missing!')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
})

const PLAN_ORDER = ['free', 'pro', 'builder', 'architect']
export function hasAccess(userPlan, requiredPlan) {
  return PLAN_ORDER.indexOf(userPlan || 'free') >= PLAN_ORDER.indexOf(requiredPlan || 'free')
}

export async function registerUser(tgUser) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      telegram_id: tgUser.id,
      name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
      last_active: new Date().toISOString()
    }, { onConflict: 'telegram_id' })
    .select()
    .single()
  if (error) { console.error('registerUser error:', error); return null }
  return data
}

export async function getAllLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('is_published', true)
    .order('level')
    .order('order_num')
  if (error) { console.error('getAllLessons error:', error); return [] }
  return data || []
}

export async function getUserProgress(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('getUserProgress error:', error); return [] }
  return data || []
}

export async function markLessonComplete(userId, lessonId) {
  if (!userId || !lessonId) return null
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'completed',
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,lesson_id' })
    .select()
    .single()
  if (error) { console.error('markLessonComplete error:', error); return null }
  return data
}
