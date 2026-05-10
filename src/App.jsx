import { useState, useEffect } from 'react'
import { useAuth, useLessons, useProgress } from './hooks/index.js'
import { hasAccess } from './lib/supabase.js'
import ReactMarkdown from 'react-markdown'

const C = {
  bg:'#080808', text:'#f5f0e8', accent:'#c8f060',
  accent2:'#60c8f0', accent3:'#f06090',
  border:'rgba(245,240,232,0.08)', glass:'rgba(245,240,232,0.04)'
}
const LC = ['#a0a0a0','#60c8f0','#c8f060','#f0c060','#c060f0','#f06060']
const LN = ['AI Literacy','AI User','AI Professional','AI Builder','AI Architect','Anthropic Level']
const mono = "'JetBrains Mono','Courier New',monospace"
const serif = 'Georgia,serif'

function Bar({ value, color = C.accent, h = 3 }) {
  return (
    <div style={{ height:h, background:'rgba(245,240,232,0.08)', borderRadius:2, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${value}%`, background:color, borderRadius:2, transition:'width 0.6s' }} />
    </div>
  )
}

function Paywall({ onClose }) {
  const plans = [
    { name:'Pro', price:'$29/мес', color:C.accent, desc:'Уровни 0–3 + сообщество' },
    { name:'Builder', price:'$79/мес', color:C.accent2, desc:'Уровни 0–4 + менторство' },
    { name:'Architect', price:'$199/мес', color:'#c060f0', desc:'Все уровни + живые сессии' },
  ]
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(8,8,8,0.97)', zIndex:200, display:'flex', flexDirection:'column', padding:24, fontFamily:mono }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <div>
          <div style={{ fontSize:10, color:C.accent, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:6 }}>Требуется подписка</div>
          <div style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:C.text }}>Открой следующий уровень</div>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(245,240,232,0.4)', fontSize:22, cursor:'pointer' }}>✕</button>
      </div>
      {plans.map(p => (
        <div key={p.name} style={{ padding:'16px 20px', border:`1px solid ${p.color}30`, background:`${p.color}06`, marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:serif, fontSize:16, fontWeight:700, color:p.color, marginBottom:4 }}>{p.name}</div>
            <div style={{ fontSize:11, color:'rgba(245,240,232,0.45)' }}>{p.desc}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontFamily:serif, fontSize:18, fontWeight:700, color:p.color }}>{p.price}</span>
            <button style={{ padding:'8px 14px', border:`1px solid ${p.color}`, background:'transparent', color:p.color, fontFamily:mono, fontSize:10, cursor:'pointer' }}>→</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function LessonPage({ lesson, userId, onComplete, onBack }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!lesson?.notion_url) { setLoading(false); return }
    const pageId = lesson.notion_url.split('/').pop()
    fetch(`/api/lesson-content?pageId=${pageId}`)
      .then(r => r.ok ? r.json() : null)
      .then(setContent)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lesson])

  const handleComplete = async () => {
    setSaving(true)
    await onComplete(lesson.id)
    onBack()
  }

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:mono, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', borderBottom:`1px solid ${C.border}`, background:'rgba(8,8,8,0.96)', position:'sticky', top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'rgba(245,240,232,0.4)', fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ fontSize:9, color:LC[lesson.level], letterSpacing:'0.15em', textTransform:'uppercase' }}>Модуль {lesson.module_id}</div>
          <div style={{ fontFamily:serif, fontSize:15, fontWeight:700 }}>{lesson.title}</div>
        </div>
      </div>
      <div style={{ flex:1, padding:'24px 20px', overflowY:'auto' }}>
        {loading ? (
          <div style={{ color:'rgba(245,240,232,0.4)', fontSize:12, textAlign:'center', paddingTop:40 }}>Загружаем урок...</div>
        ) : content?.content ? (
          <div style={{ fontSize:13, lineHeight:1.8, color:'rgba(245,240,232,0.85)' }}>
            <ReactMarkdown components={{
              h1:({children})=><h1 style={{fontFamily:serif,fontSize:22,fontWeight:700,margin:'24px 0 12px',color:C.text}}>{children}</h1>,
              h2:({children})=><h2 style={{fontFamily:serif,fontSize:18,fontWeight:700,margin:'20px 0 10px',color:LC[lesson.level]}}>{children}</h2>,
              p:({children})=><p style={{margin:'0 0 14px',lineHeight:1.8}}>{children}</p>,
              code:({inline,children})=>inline
                ?<code style={{background:'rgba(200,240,96,0.1)',color:C.accent,padding:'2px 6px',fontSize:12}}>{children}</code>
                :<pre style={{background:'rgba(245,240,232,0.04)',border:`1px solid ${C.border}`,padding:16,overflow:'auto',margin:'12px 0'}}><code style={{fontSize:12,color:'rgba(245,240,232,0.8)'}}>{children}</code></pre>,
            }}>{content.content}</ReactMarkdown>
          </div>
        ) : (
          <div>
            <div style={{ padding:20, border:`1px solid ${C.border}`, background:C.glass, marginBottom:16, fontSize:12, color:'rgba(245,240,232,0.5)', lineHeight:1.8 }}>
              Контент загружается из Notion. Добавь NOTION_TOKEN в переменные окружения Vercel.
            </div>
            <a href={lesson.notion_url} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', border:`1px solid ${C.border}`, background:C.glass, color:C.accent2, textDecoration:'none', fontSize:12 }}>
              📖 Открыть урок в Notion →
            </a>
          </div>
        )}
      </div>
      <div style={{ padding:'16px 20px', borderTop:`1px solid ${C.border}` }}>
        <button onClick={handleComplete} disabled={saving}
          style={{ width:'100%', padding:14, background:saving?'rgba(200,240,96,0.5)':C.accent, color:C.bg, border:'none', fontFamily:mono, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', cursor:saving?'not-allowed':'pointer', fontWeight:700 }}>
          {saving ? 'Сохраняем...' : '✓ Урок завершён'}
        </button>
      </div>
    </div>
  )
}

function Home({ user, getLessonsByLevel, getLessonStatus, onLesson }) {
  const [expanded, setExpanded] = useState(0)
  const [paywall, setPaywall] = useState(false)

  return (
    <div style={{ paddingBottom:80 }}>
      {paywall && <Paywall onClose={() => setPaywall(false)} />}
      <div style={{ padding:'20px 20px 16px' }}>
        <div style={{ fontSize:10, color:C.accent, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:8 }}>Твой путь</div>
        <div style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:C.text }}>Привет, {user?.name?.split(' ')[0] || 'студент'} 👋</div>
        <div style={{ fontSize:11, color:'rgba(245,240,232,0.4)', marginTop:4 }}>Тариф: <span style={{ color:C.accent }}>{(user?.plan||'free').toUpperCase()}</span></div>
      </div>
      {[0,1,2,3,4,5].map(level => {
        const lvl = getLessonsByLevel(level)
        if (!lvl.length) return null
        const done = lvl.filter(l => getLessonStatus(l.id) === 'completed').length
        const pct = Math.round((done/lvl.length)*100)
        const color = LC[level]
        const isOpen = expanded === level
        return (
          <div key={level}>
            <div onClick={() => setExpanded(isOpen ? null : level)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', borderTop:`1px solid ${C.border}`, background:isOpen?'rgba(245,240,232,0.06)':C.glass, cursor:'pointer', borderLeft:isOpen?`3px solid ${color}`:'3px solid transparent', transition:'all 0.2s' }}>
              <div style={{ fontFamily:serif, fontSize:36, fontWeight:700, color, opacity:0.25, lineHeight:1, minWidth:32 }}>{level}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9, color, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:4 }}>{LN[level]}</div>
                <Bar value={pct} color={color} />
              </div>
              <div style={{ textAlign:'right', marginRight:8 }}>
                <div style={{ fontFamily:serif, fontSize:16, fontWeight:700, color }}>{done}/{lvl.length}</div>
              </div>
              <div style={{ fontSize:16, color:isOpen?color:'rgba(245,240,232,0.2)', transform:isOpen?'rotate(45deg)':'none', transition:'all 0.2s' }}>+</div>
            </div>
            {isOpen && lvl.map(lesson => {
              const status = getLessonStatus(lesson.id)
              const locked = !hasAccess(user?.plan, lesson.plan_required)
              const done = status === 'completed'
              return (
                <div key={lesson.id} onClick={() => locked ? setPaywall(true) : onLesson(lesson)}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px 12px 36px', borderBottom:`1px solid ${C.border}`, background:done?`${color}08`:'transparent', cursor:locked?'not-allowed':'pointer', opacity:locked?0.4:1 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', border:`1px solid ${done?color:'rgba(245,240,232,0.2)'}`, background:done?color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:done?C.bg:'transparent', flexShrink:0, fontWeight:700 }}>✓</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, color, letterSpacing:'0.1em', marginBottom:2 }}>Модуль {lesson.module_id}</div>
                    <div style={{ fontSize:12, color:done?C.text:'rgba(245,240,232,0.7)' }}>{lesson.title}</div>
                  </div>
                  <span style={{ fontSize:12, color:'rgba(245,240,232,0.25)' }}>{locked?'🔒':done?'':' →'}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function Progress({ lessons, getLessonsByLevel, getLessonStatus, completedCount }) {
  const total = lessons.length
  const pct = total ? Math.round((completedCount/total)*100) : 0
  return (
    <div style={{ padding:'24px 20px 80px' }}>
      <div style={{ fontSize:10, color:C.accent, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:4 }}>02</div>
      <div style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:C.text, marginBottom:24 }}>Прогресс</div>
      <div style={{ padding:20, border:`1px solid ${C.border}`, background:C.glass, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:11, color:'rgba(245,240,232,0.5)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Общий</span>
          <span style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:C.accent }}>{pct}%</span>
        </div>
        <Bar value={pct} />
        <div style={{ fontSize:10, color:'rgba(245,240,232,0.3)', marginTop:6 }}>{completedCount} из {total} уроков</div>
      </div>
      <div style={{ border:`1px solid ${C.border}`, background:C.glass }}>
        {[0,1,2,3,4,5].map(level => {
          const lvl = getLessonsByLevel(level)
          if (!lvl.length) return null
          const done = lvl.filter(l => getLessonStatus(l.id) === 'completed').length
          const p = Math.round((done/lvl.length)*100)
          return (
            <div key={level} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, minWidth:110, color:'rgba(245,240,232,0.6)' }}>{LN[level]}</div>
              <div style={{ flex:1 }}><Bar value={p} color={LC[level]} /></div>
              <div style={{ fontFamily:serif, fontSize:13, fontWeight:700, color:LC[level], minWidth:36, textAlign:'right' }}>{p}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Cabinet({ user }) {
  return (
    <div style={{ padding:'24px 20px 80px' }}>
      <div style={{ fontSize:10, color:C.accent, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:4 }}>03</div>
      <div style={{ fontFamily:serif, fontSize:22, fontWeight:700, color:C.text, marginBottom:24 }}>Кабинет</div>
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:20, border:`1px solid ${C.border}`, background:C.glass, marginBottom:2 }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent},${C.accent2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:C.bg, fontFamily:serif }}>{user?.name?.[0]||'?'}</div>
        <div>
          <div style={{ fontFamily:serif, fontSize:18, fontWeight:700, color:C.text }}>{user?.name||'Студент'}</div>
          <div style={{ fontSize:10, color:C.accent, letterSpacing:'0.15em', textTransform:'uppercase', marginTop:4 }}>{(user?.plan||'free').toUpperCase()}</div>
        </div>
      </div>
      <div style={{ border:`1px solid ${C.border}`, background:C.glass, padding:'4px 16px' }}>
        {[['Telegram ID', user?.telegram_id||'—'], ['Тариф', (user?.plan||'free').toUpperCase()], ['Статус', 'Активен ✓']].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:11, color:'rgba(245,240,232,0.4)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{k}</span>
            <span style={{ fontSize:12, color:C.text }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()
  const { lessons, getLessonsByLevel } = useLessons()
  const { getLessonStatus, complete, completedCount, refetch } = useProgress(user?.id)
  const [tab, setTab] = useState(0)
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) { tg.ready(); tg.expand() }
  }, [])

  if (loading) return (
    <div style={{ background:C.bg, color:C.text, fontFamily:mono, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ fontFamily:serif, fontSize:48, fontWeight:700, color:C.accent }}>AI</div>
      <div style={{ fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(245,240,232,0.4)' }}>Загрузка...</div>
    </div>
  )

  if (lesson) return (
    <LessonPage lesson={lesson} userId={user?.id} onComplete={async (id) => { await complete(id); await refetch() }} onBack={() => setLesson(null)} />
  )

  return (
    <div style={{ background:C.bg, color:C.text, fontFamily:mono, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:`1px solid ${C.border}`, background:'rgba(8,8,8,0.96)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ fontFamily:serif, fontWeight:700, fontSize:13, letterSpacing:'0.1em', textTransform:'uppercase', color:C.text }}>AI <span style={{ color:C.accent }}>MASTERY</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:10, padding:'3px 10px', border:`1px solid ${C.accent}`, color:C.accent, letterSpacing:'0.1em' }}>{(user?.plan||'FREE').toUpperCase()}</div>
          <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.accent},${C.accent2})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:C.bg }}>{user?.name?.[0]||'?'}</div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        {tab===0 && <Home user={user} getLessonsByLevel={getLessonsByLevel} getLessonStatus={getLessonStatus} onLesson={setLesson} />}
        {tab===1 && <Progress lessons={lessons} getLessonsByLevel={getLessonsByLevel} getLessonStatus={getLessonStatus} completedCount={completedCount} />}
        {tab===2 && <Cabinet user={user} />}
      </div>
      <div style={{ display:'flex', borderTop:`1px solid ${C.border}`, background:'rgba(8,8,8,0.96)', position:'sticky', bottom:0, zIndex:50 }}>
        {[['📚','Учиться'],['📊','Прогресс'],['👤','Кабинет']].map(([icon,label],i) => (
          <button key={i} onClick={() => setTab(i)} style={{ flex:1, padding:'12px 4px', background:'none', border:'none', color:tab===i?C.accent:'rgba(245,240,232,0.3)', cursor:'pointer', fontFamily:mono, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:18 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  )
}
