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

// ── LANDING ───────────────────────────────────────────────
function Landing({ onStart }) {
  const levels = [
    {num:0,name:'AI Literacy',desc:'Токены, LLM, первые шаги',color:'#a0a0a0',free:true},
    {num:1,name:'AI User',desc:'Claude как личный ассистент',color:'#60c8f0',free:true},
    {num:2,name:'AI Professional',desc:'ИИ в маркетинге и бизнесе',color:'#c8f060',free:false},
    {num:3,name:'AI Builder',desc:'Агенты, RAG, автоматизации',color:'#f0c060',free:false},
    {num:4,name:'AI Architect',desc:'Anthropic API, мультиагенты',color:'#c060f0',free:false},
    {num:5,name:'Anthropic Level',desc:'LLM изнутри, fine-tuning',color:'#f06060',free:false},
  ]
  return (
    <div style={{background:C.bg,color:C.text,fontFamily:mono,minHeight:'100vh',overflowY:'auto'}}>
      <div style={{position:'relative',padding:'48px 24px 40px',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(200,240,96,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,240,96,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:-20,right:-10,fontFamily:serif,fontSize:160,fontWeight:700,color:'transparent',WebkitTextStroke:'1px rgba(200,240,96,0.05)',lineHeight:1,pointerEvents:'none',userSelect:'none'}}>AI</div>
        <div style={{position:'relative'}}>
          <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:C.accent,marginBottom:16}}>◈ Образовательная платформа</div>
          <h1 style={{fontFamily:serif,fontSize:38,fontWeight:700,lineHeight:1.05,letterSpacing:'-0.02em',margin:'0 0 16px'}}>
            От нуля<br/><span style={{color:C.accent}}>до Anthropic</span><br/>
            <span style={{WebkitTextStroke:`1px ${C.text}`,color:'transparent'}}>Level</span>
          </h1>
          <p style={{fontSize:13,color:'rgba(245,240,232,0.5)',lineHeight:1.7,margin:'0 0 32px',fontWeight:300}}>
            Изучи ИИ системно — от первого промпта до архитектуры агентных систем и запуска ИИ-компании.
          </p>
          <button onClick={onStart} style={{width:'100%',padding:'15px 24px',background:C.accent,color:C.bg,border:'none',fontFamily:mono,fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontWeight:700}}>
            Начать бесплатно →
          </button>
          <div style={{marginTop:12,fontSize:11,color:'rgba(245,240,232,0.35)',textAlign:'center'}}>Уровень 0 доступен без оплаты</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:2,margin:'0 0 2px'}}>
        {[['6','уровней'],['20+','уроков'],['∞','практики']].map(([n,l])=>(
          <div key={l} style={{padding:'20px 16px',border:`1px solid ${C.border}`,background:C.glass,textAlign:'center'}}>
            <div style={{fontFamily:serif,fontSize:28,fontWeight:700,color:C.accent}}>{n}</div>
            <div style={{fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:'24px 24px 16px'}}>
        <div style={{fontSize:10,color:C.accent,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:16}}>Что получишь</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2}}>
          {[['🧠','6 уровней','От AI Literacy до Anthropic Level'],['⚡','20+ уроков','Практика, задания, проекты'],['🤖','Claude API','Реальные инструменты и агенты'],['🚀','Запуск','От идеи до Series A']].map(([icon,title,desc])=>(
            <div key={title} style={{padding:'18px 16px',border:`1px solid ${C.border}`,background:C.glass}}>
              <div style={{fontSize:22,marginBottom:10}}>{icon}</div>
              <div style={{fontFamily:serif,fontSize:14,fontWeight:700,marginBottom:4}}>{title}</div>
              <div style={{fontSize:11,color:'rgba(245,240,232,0.45)',lineHeight:1.5,fontWeight:300}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'0 24px 24px'}}>
        <div style={{fontSize:10,color:C.accent,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:16}}>Программа</div>
        {levels.map(lvl=>(
          <div key={lvl.num} style={{display:'flex',alignItems:'center',gap:16,padding:'13px 0',borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontFamily:serif,fontSize:26,fontWeight:700,color:lvl.color,opacity:0.3,minWidth:26}}>{lvl.num}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:serif,fontSize:14,fontWeight:700}}>{lvl.name}</div>
              <div style={{fontSize:11,color:'rgba(245,240,232,0.45)',marginTop:2,fontWeight:300}}>{lvl.desc}</div>
            </div>
            {lvl.free
              ?<div style={{fontSize:9,padding:'3px 8px',border:`1px solid ${C.accent}`,color:C.accent,letterSpacing:'0.1em'}}>FREE</div>
              :<div style={{fontSize:14,color:'rgba(245,240,232,0.2)'}}>🔒</div>
            }
          </div>
        ))}
      </div>

      <div style={{padding:'0 24px 48px'}}>
        <button onClick={onStart} style={{width:'100%',padding:'16px',background:C.accent,color:C.bg,border:'none',fontFamily:mono,fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontWeight:700,marginBottom:12}}>
          Начать обучение →
        </button>
        <div style={{fontSize:11,color:'rgba(245,240,232,0.25)',textAlign:'center',lineHeight:1.6}}>
          Уровень 0 бесплатно · Отмена в любое время
        </div>
      </div>
    </div>
  )
}

// ── PRICING ───────────────────────────────────────────────
function Pricing({ user, onPay, onSkip }) {
  const plans = [
    {name:'Free',price:'0',per:'',color:'#a0a0a0',levels:'Уровень 0',features:['3 урока — AI Literacy','Промпт-блокнот'],cta:'Продолжить бесплатно',free:true},
    {name:'Pro',price:'29',per:'/мес',color:C.accent,levels:'Уровни 0–3',features:['10 уроков','Сообщество','Шаблоны'],cta:'Выбрать Pro',featured:true},
    {name:'Builder',price:'79',per:'/мес',color:C.accent2,levels:'Уровни 0–4',features:['15 уроков','Менторство 2×/мес','Разбор проектов'],cta:'Выбрать Builder'},
    {name:'Architect',price:'199',per:'/мес',color:'#c060f0',levels:'Все уровни 0–5',features:['20+ уроков','Живые сессии','AI-стратегия'],cta:'Стать Architect'},
  ]
  return (
    <div style={{background:C.bg,color:C.text,fontFamily:mono,minHeight:'100vh',overflowY:'auto'}}>
      <div style={{padding:'32px 24px 24px',borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.accent,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:8}}>Выбери тариф</div>
        <h2 style={{fontFamily:serif,fontSize:28,fontWeight:700,margin:'0 0 8px'}}>Начни учиться сегодня</h2>
        <p style={{fontSize:12,color:'rgba(245,240,232,0.45)',margin:0,fontWeight:300}}>Уровень 0 доступен бесплатно.</p>
      </div>
      <div style={{padding:'16px 24px'}}>
        {plans.map(p=>(
          <div key={p.name} style={{marginBottom:8,padding:'20px',border:p.featured?`1px solid ${p.color}40`:`1px solid ${C.border}`,background:p.featured?`${p.color}06`:C.glass,position:'relative'}}>
            {p.featured&&<div style={{position:'absolute',top:-1,right:20,fontSize:9,padding:'3px 10px',background:C.accent,color:C.bg,letterSpacing:'0.1em',fontWeight:700}}>ПОПУЛЯРНЫЙ</div>}
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
              <div>
                <div style={{fontFamily:serif,fontSize:20,fontWeight:700,color:p.color,marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:10,color:'rgba(245,240,232,0.4)',letterSpacing:'0.1em',textTransform:'uppercase'}}>{p.levels}</div>
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                {p.price!=='0'&&<span style={{fontSize:14,color:p.color}}>$</span>}
                <span style={{fontFamily:serif,fontSize:30,fontWeight:700,color:p.color,lineHeight:1}}>{p.price}</span>
                <span style={{fontSize:11,color:'rgba(245,240,232,0.35)'}}>{p.per}</span>
              </div>
            </div>
            <ul style={{listStyle:'none',margin:'0 0 14px',padding:0}}>
              {p.features.map(f=>(
                <li key={f} style={{fontSize:12,color:'rgba(245,240,232,0.6)',padding:'4px 0',display:'flex',alignItems:'center',gap:8,fontWeight:300}}>
                  <span style={{color:p.color,fontSize:10}}>→</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={()=>p.free?onSkip():onPay(p.name.toLowerCase())}
              style={{width:'100%',padding:'12px',border:p.featured?'none':`1px solid ${p.color}60`,background:p.featured?p.color:'transparent',color:p.featured?C.bg:p.color,fontFamily:mono,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',fontWeight:p.featured?700:400}}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
      <div style={{padding:'0 24px 48px',textAlign:'center'}}>
        <div style={{fontSize:11,color:'rgba(245,240,232,0.25)',lineHeight:1.7}}>Отменить можно в любое время<br/>Оплата через Telegram Stars или карту</div>
      </div>
    </div>
  )
}

function Bar({value,color=C.accent,h=3}){
  return <div style={{height:h,background:'rgba(245,240,232,0.08)',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,value||0)}%`,background:color,borderRadius:2,transition:'width 0.6s'}}/></div>
}

function Paywall({onClose,onPay}){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(8,8,8,0.97)',zIndex:200,display:'flex',flexDirection:'column',padding:24,fontFamily:mono}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
        <div>
          <div style={{fontSize:10,color:C.accent,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:6}}>Требуется подписка</div>
          <div style={{fontFamily:serif,fontSize:22,fontWeight:700,color:C.text}}>Открой следующий уровень</div>
        </div>
        <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(245,240,232,0.4)',fontSize:22,cursor:'pointer'}}>✕</button>
      </div>
      {[{name:'Pro',price:'$29/мес',color:C.accent,desc:'Уровни 0–3 + сообщество'},{name:'Builder',price:'$79/мес',color:C.accent2,desc:'Уровни 0–4 + менторство'},{name:'Architect',price:'$199/мес',color:'#c060f0',desc:'Все уровни + сессии'}].map(p=>(
        <div key={p.name} style={{padding:'16px 20px',border:`1px solid ${p.color}30`,background:`${p.color}06`,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:serif,fontSize:16,fontWeight:700,color:p.color,marginBottom:4}}>{p.name}</div>
            <div style={{fontSize:11,color:'rgba(245,240,232,0.45)'}}>{p.desc}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontFamily:serif,fontSize:18,fontWeight:700,color:p.color}}>{p.price}</span>
            <button onClick={()=>onPay(p.name.toLowerCase())} style={{padding:'8px 14px',border:`1px solid ${p.color}`,background:'transparent',color:p.color,fontFamily:mono,fontSize:10,letterSpacing:'0.1em',cursor:'pointer'}}>→</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function LessonPage({lesson,userId,onComplete,onBack}){
  const [loading,setLoading]=useState(true)
  const [content,setContent]=useState(null)
  const [saving,setSaving]=useState(false)
  useEffect(()=>{
    if(!lesson?.notion_url){setLoading(false);return}
    const pageId=lesson.notion_url.split('/').pop()
    fetch(`/api/lesson-content?pageId=${pageId}`).then(r=>r.ok?r.json():null).then(setContent).catch(()=>{}).finally(()=>setLoading(false))
  },[lesson])
  return (
    <div style={{background:C.bg,color:C.text,fontFamily:mono,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderBottom:`1px solid ${C.border}`,background:'rgba(8,8,8,0.96)',position:'sticky',top:0}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'rgba(245,240,232,0.4)',fontSize:20,cursor:'pointer'}}>←</button>
        <div>
          <div style={{fontSize:9,color:LC[lesson.level],letterSpacing:'0.15em',textTransform:'uppercase'}}>Модуль {lesson.module_id}</div>
          <div style={{fontFamily:serif,fontSize:14,fontWeight:700}}>{lesson.title}</div>
        </div>
      </div>
      <div style={{flex:1,padding:'24px 20px',overflowY:'auto'}}>
        {loading?<div style={{color:'rgba(245,240,232,0.4)',fontSize:12,textAlign:'center',paddingTop:40}}>Загружаем урок...</div>
        :content?.content?<ReactMarkdown components={{
          h1:({children})=><h1 style={{fontFamily:serif,fontSize:22,fontWeight:700,margin:'24px 0 12px',color:C.text}}>{children}</h1>,
          h2:({children})=><h2 style={{fontFamily:serif,fontSize:18,fontWeight:700,margin:'20px 0 10px',color:LC[lesson.level]}}>{children}</h2>,
          p:({children})=><p style={{fontSize:13,margin:'0 0 14px',lineHeight:1.8,color:'rgba(245,240,232,0.85)',fontWeight:300}}>{children}</p>,
          code:({inline,children})=>inline?<code style={{background:'rgba(200,240,96,0.1)',color:C.accent,padding:'2px 6px',fontSize:12}}>{children}</code>:<pre style={{background:'rgba(245,240,232,0.04)',border:`1px solid ${C.border}`,padding:16,overflow:'auto',margin:'12px 0'}}><code style={{fontSize:12,color:'rgba(245,240,232,0.8)'}}>{children}</code></pre>,
        }}>{content.content}</ReactMarkdown>
        :<div><div style={{padding:20,border:`1px solid ${C.border}`,background:C.glass,marginBottom:16,fontSize:12,color:'rgba(245,240,232,0.5)',lineHeight:1.8}}>Контент загружается из Notion.</div><a href={lesson.notion_url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',border:`1px solid ${C.border}`,background:C.glass,color:C.accent2,textDecoration:'none',fontSize:12}}>📖 Открыть в Notion →</a></div>}
      </div>
      <div style={{padding:'16px 20px',borderTop:`1px solid ${C.border}`}}>
        <button onClick={async()=>{setSaving(true);await onComplete(lesson.id);onBack()}} disabled={saving}
          style={{width:'100%',padding:14,background:saving?'rgba(200,240,96,0.5)':C.accent,color:C.bg,border:'none',fontFamily:mono,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',cursor:saving?'not-allowed':'pointer',fontWeight:700}}>
          {saving?'Сохраняем...':'✓ Урок завершён'}
        </button>
      </div>
    </div>
  )
}

function Cabinet({user,onPricing}){
  const {lessons,getLessonsByLevel}=useLessons()
  const {getLessonStatus,complete,completedCount,refetch}=useProgress(user?.id)
  const [tab,setTab]=useState(0)
  const [expanded,setExpanded]=useState(0)
  const [activeLesson,setActiveLesson]=useState(null)
  const [paywall,setPaywall]=useState(false)
  const total=lessons.length
  const pct=total?Math.round((completedCount/total)*100):0

  if(activeLesson) return <LessonPage lesson={activeLesson} userId={user?.id} onComplete={async(id)=>{await complete(id);await refetch()}} onBack={()=>setActiveLesson(null)}/>

  return (
    <div style={{background:C.bg,color:C.text,fontFamily:mono,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      {paywall&&<Paywall onClose={()=>setPaywall(false)} onPay={()=>{setPaywall(false);onPricing()}}/>}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:`1px solid ${C.border}`,background:'rgba(8,8,8,0.96)',position:'sticky',top:0,zIndex:50}}>
        <div style={{fontFamily:serif,fontWeight:700,fontSize:13,letterSpacing:'0.1em',textTransform:'uppercase'}}>AI <span style={{color:C.accent}}>MASTERY</span></div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontSize:10,padding:'3px 10px',border:`1px solid ${C.accent}`,color:C.accent,letterSpacing:'0.1em'}}>{(user?.plan||'FREE').toUpperCase()}</div>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:C.bg}}>{user?.name?.[0]||'?'}</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto'}}>
        {tab===0&&(
          <div style={{paddingBottom:80}}>
            <div style={{padding:'20px 20px 16px'}}>
              <div style={{fontSize:10,color:C.accent,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:8}}>Добро пожаловать</div>
              <div style={{fontFamily:serif,fontSize:22,fontWeight:700}}>Привет, {user?.name?.split(' ')[0]||'студент'} 👋</div>
            </div>
            <div style={{margin:'0 20px 16px',padding:'16px',border:`1px solid ${C.border}`,background:C.glass}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,color:'rgba(245,240,232,0.5)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Прогресс</span>
                <span style={{fontFamily:serif,fontSize:20,fontWeight:700,color:C.accent}}>{pct}%</span>
              </div>
              <Bar value={pct}/>
              <div style={{fontSize:10,color:'rgba(245,240,232,0.3)',marginTop:6}}>{completedCount} из {total} уроков</div>
            </div>
            {[0,1,2,3,4,5].map(level=>{
              const lvl=getLessonsByLevel(level)
              if(!lvl.length) return null
              const done=lvl.filter(l=>getLessonStatus(l.id)==='completed').length
              const p=Math.round((done/lvl.length)*100)
              const color=LC[level]
              const isOpen=expanded===level
              return (
                <div key={level}>
                  <div onClick={()=>setExpanded(isOpen?null:level)} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 20px',borderTop:`1px solid ${C.border}`,background:isOpen?'rgba(245,240,232,0.05)':C.glass,cursor:'pointer',borderLeft:isOpen?`3px solid ${color}`:'3px solid transparent',transition:'all 0.2s'}}>
                    <div style={{fontFamily:serif,fontSize:30,fontWeight:700,color,opacity:0.25,lineHeight:1,minWidth:26}}>{level}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,color,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:4}}>{LN[level]}</div>
                      <Bar value={p} color={color}/>
                    </div>
                    <div style={{textAlign:'right',marginRight:8}}><div style={{fontFamily:serif,fontSize:14,fontWeight:700,color}}>{done}/{lvl.length}</div></div>
                    <div style={{fontSize:16,color:isOpen?color:'rgba(245,240,232,0.2)',transform:isOpen?'rotate(45deg)':'none',transition:'all 0.2s'}}>+</div>
                  </div>
                  {isOpen&&lvl.map(lesson=>{
                    const status=getLessonStatus(lesson.id)
                    const locked=!hasAccess(user?.plan,lesson.plan_required)
                    const isDone=status==='completed'
                    return (
                      <div key={lesson.id} onClick={()=>locked?setPaywall(true):setActiveLesson(lesson)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 20px 12px 36px',borderBottom:`1px solid ${C.border}`,background:isDone?`${color}08`:'transparent',cursor:locked?'not-allowed':'pointer',opacity:locked?0.4:1}}>
                        <div style={{width:20,height:20,borderRadius:'50%',border:`1px solid ${isDone?color:'rgba(245,240,232,0.2)'}`,background:isDone?color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:isDone?C.bg:'transparent',flexShrink:0,fontWeight:700}}>✓</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:9,color,letterSpacing:'0.1em',marginBottom:2}}>Модуль {lesson.module_id}</div>
                          <div style={{fontSize:12,color:isDone?C.text:'rgba(245,240,232,0.7)'}}>{lesson.title}</div>
                        </div>
                        <span style={{fontSize:12,color:'rgba(245,240,232,0.25)'}}>{locked?'🔒':isDone?'':' →'}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
            {(!user?.plan||user.plan==='free')&&(
              <div style={{margin:'16px 20px',padding:'16px 20px',border:'1px solid rgba(200,240,96,0.25)',background:'rgba(200,240,96,0.05)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontSize:10,color:C.accent,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:4}}>Pro доступен</div>
                  <div style={{fontSize:12,color:'rgba(245,240,232,0.55)',fontWeight:300}}>Открой уровни 1–3</div>
                </div>
                <button onClick={onPricing} style={{padding:'8px 16px',background:C.accent,color:C.bg,border:'none',fontFamily:mono,fontSize:10,letterSpacing:'0.1em',cursor:'pointer',fontWeight:700}}>$29/мес</button>
              </div>
            )}
          </div>
        )}

        {tab===1&&(
          <div style={{padding:'24px 20px 80px'}}>
            <div style={{fontFamily:serif,fontSize:22,fontWeight:700,marginBottom:24}}>Прогресс</div>
            <div style={{padding:20,border:`1px solid ${C.border}`,background:C.glass,marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,color:'rgba(245,240,232,0.5)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Общий</span>
                <span style={{fontFamily:serif,fontSize:22,fontWeight:700,color:C.accent}}>{pct}%</span>
              </div>
              <Bar value={pct}/>
              <div style={{fontSize:10,color:'rgba(245,240,232,0.3)',marginTop:6}}>{completedCount} из {total} уроков</div>
            </div>
            <div style={{border:`1px solid ${C.border}`,background:C.glass}}>
              {[0,1,2,3,4,5].map(level=>{
                const lvl=getLessonsByLevel(level)
                if(!lvl.length) return null
                const done=lvl.filter(l=>getLessonStatus(l.id)==='completed').length
                const p=Math.round((done/lvl.length)*100)
                return <div key={level} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontSize:11,minWidth:110,color:'rgba(245,240,232,0.6)'}}>{LN[level]}</div>
                  <div style={{flex:1}}><Bar value={p} color={LC[level]}/></div>
                  <div style={{fontFamily:serif,fontSize:13,fontWeight:700,color:LC[level],minWidth:36,textAlign:'right'}}>{p}%</div>
                </div>
              })}
            </div>
          </div>
        )}

        {tab===2&&(
          <div style={{padding:'24px 20px 80px'}}>
            <div style={{fontFamily:serif,fontSize:22,fontWeight:700,marginBottom:24}}>Кабинет</div>
            <div style={{display:'flex',alignItems:'center',gap:16,padding:20,border:`1px solid ${C.border}`,background:C.glass,marginBottom:8}}>
              <div style={{width:52,height:52,borderRadius:'50%',background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,color:C.bg,fontFamily:serif}}>{user?.name?.[0]||'?'}</div>
              <div>
                <div style={{fontFamily:serif,fontSize:18,fontWeight:700}}>{user?.name||'Студент'}</div>
                <div style={{fontSize:10,color:C.accent,letterSpacing:'0.15em',textTransform:'uppercase',marginTop:4}}>{(user?.plan||'free').toUpperCase()}</div>
              </div>
            </div>
            <div style={{border:`1px solid ${C.border}`,background:C.glass,padding:'4px 16px',marginBottom:16}}>
              {[['Уроков пройдено',completedCount],['Всего уроков',total],['Тариф',(user?.plan||'free').toUpperCase()]].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontSize:11,color:'rgba(245,240,232,0.4)',textTransform:'uppercase',letterSpacing:'0.08em'}}>{k}</span>
                  <span style={{fontSize:12}}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={onPricing} style={{width:'100%',padding:'14px',background:'transparent',border:`1px solid ${C.accent}`,color:C.accent,fontFamily:mono,fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
              Улучшить тариф →
            </button>
          </div>
        )}
      </div>

      <div style={{display:'flex',borderTop:`1px solid ${C.border}`,background:'rgba(8,8,8,0.96)',position:'sticky',bottom:0,zIndex:50}}>
        {[['📚','Учиться'],['📊','Прогресс'],['👤','Кабинет']].map(([icon,label],i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{flex:1,padding:'12px 4px',background:'none',border:'none',color:tab===i?C.accent:'rgba(245,240,232,0.3)',cursor:'pointer',fontFamily:mono,fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
            <span style={{fontSize:18}}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── ROOT: FLOW CONTROLLER ─────────────────────────────────
export default function App() {
  const {user,loading}=useAuth()
  const [screen,setScreen]=useState('landing')

  useEffect(()=>{
    const tg=window.Telegram?.WebApp
    if(tg){tg.ready();tg.expand()}
  },[])

  // Если уже подписан — сразу в кабинет
  useEffect(()=>{
    if(user&&user.plan&&user.plan!=='free'){
      setScreen('cabinet')
    }
  },[user])

  if(loading) return (
    <div style={{background:C.bg,color:C.text,fontFamily:mono,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div style={{fontFamily:serif,fontSize:48,fontWeight:700,color:C.accent}}>AI</div>
      <div style={{fontSize:11,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)'}}>Загрузка...</div>
    </div>
  )

  if(screen==='landing') return <Landing onStart={()=>setScreen('pricing')}/>
  if(screen==='pricing') return <Pricing user={user} onPay={()=>setScreen('cabinet')} onSkip={()=>setScreen('cabinet')}/>
  return <Cabinet user={user} onPricing={()=>setScreen('pricing')}/>
}
