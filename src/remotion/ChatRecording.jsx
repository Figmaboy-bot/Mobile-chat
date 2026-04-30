import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       '#06080b',
  header:   'rgba(10,13,17,0.95)',
  outBg:    '#f1f1f1',
  outText:  '#06080b',
  inBg:     '#1f2937',
  inText:   '#ffffff',
  border:   'rgba(255,255,255,0.10)',
  subtext:  'rgba(255,255,255,0.40)',
  dot:      'rgba(255,255,255,0.50)',
}

// ─── Conversation script ──────────────────────────────────────────────────────
// Each entry: frame it appears, direction, text
const MESSAGES = [
  { at: 32,  dir: 'out', text: 'Hey! Check this out 👀' },
  { at: 115, dir: 'in',  text: 'Oh wow 😄' },
  { at: 138, dir: 'in',  text: 'This looks really clean! Are you using AI for the design?' },
  { at: 182, dir: 'out', text: 'Yeah, built it with React + Tailwind 🔥' },
  { at: 265, dir: 'in',  text: "That's seriously cool 💯" },
]

// Typing indicator windows [startFrame, endFrame]
const TYPING = [
  [55,  115],
  [205, 265],
]

// Input bar typing animation
const INPUT_ANIM = [
  { start: 14, end: 28, text: 'Hey! Check this out 👀',          clearAt: 30 },
  { start: 162, end: 176, text: 'Yeah, built it with React + Tailwind 🔥', clearAt: 179 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useFadeIn(startFrame, config = {}) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = frame - startFrame
  const opacity    = spring({ frame: f, fps, config: { damping: 200, ...config }, from: 0, to: 1 })
  const translateY = spring({ frame: f, fps, config: { damping: 60, stiffness: 180, ...config }, from: 14, to: 0 })
  return { opacity: f < 0 ? 0 : opacity, transform: `translateY(${f < 0 ? 14 : translateY}px)` }
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <img
      src={staticFile('img/statusbar.svg')}
      style={{ width: '100%', display: 'block', flexShrink: 0 }}
    />
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
      background: C.header, borderBottom: `1px solid ${C.border}`,
      borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 24,
    }}>
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
        {/* Back + avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src={staticFile('img/avatar.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* green dot */}
            <div style={{
              position: 'absolute', bottom: 0, left: 28, width: 12, height: 12,
              borderRadius: '50%', background: '#22c55e',
              border: `2px solid ${C.bg}`,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 16, letterSpacing: -0.7 }}>Sulaimon Odeniran</span>
              <span style={{ color: '#6b717c', fontSize: 14, fontWeight: 500 }}>Online now</span>
            </div>
          </div>
        </div>
        {/* dots menu */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="8"  cy="16" r="2" fill="white"/>
          <circle cx="16" cy="16" r="2" fill="white"/>
          <circle cx="24" cy="16" r="2" fill="white"/>
        </svg>
      </div>
    </div>
  )
}

// ─── Message bubbles ──────────────────────────────────────────────────────────
function OutBubble({ children, startFrame }) {
  const style = useFadeIn(startFrame)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, ...style }}>
      <div style={{
        background: C.outBg, borderRadius: 16, padding: '8px 12px', maxWidth: 280,
      }}>
        <p style={{ color: C.outText, fontSize: 16, fontWeight: 500, lineHeight: '20px', letterSpacing: -0.7, margin: 0 }}>
          {children}
        </p>
      </div>
    </div>
  )
}

function InBubble({ children, startFrame, showAvatar }) {
  const style = useFadeIn(startFrame)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, ...style }}>
      {showAvatar ? (
        <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <img src={staticFile('img/avatar.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ width: 32, flexShrink: 0 }} />
      )}
      <div style={{ background: C.inBg, borderRadius: 16, padding: '8px 12px', maxWidth: 260 }}>
        <p style={{ color: C.inText, fontSize: 16, fontWeight: 500, lineHeight: '20px', letterSpacing: -0.7, margin: 0 }}>
          {children}
        </p>
      </div>
    </div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ startFrame }) {
  const frame = useCurrentFrame()
  const fadeStyle = useFadeIn(startFrame)

  const dotY = (i) => {
    const f = frame - startFrame
    if (f < 0) return 0
    const phase = (f * 0.18 + i * 0.8) % (Math.PI * 2)
    return -Math.max(0, Math.sin(phase)) * 5
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, ...fadeStyle }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
        <img src={staticFile('img/avatar.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ color: 'white', fontSize: 16, fontWeight: 500, letterSpacing: -0.7, margin: 0 }}>
          <span style={{ fontWeight: 600 }}>Sulaimon Odeniran</span>
          <span style={{ color: C.subtext, fontWeight: 400 }}> is typing</span>
        </p>
        <div style={{
          background: C.inBg, borderRadius: 20, width: 72, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 16px',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: C.dot,
              transform: `translateY(${dotY(i)}px)`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Input bar ────────────────────────────────────────────────────────────────
function InputBar({ text }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: 'rgba(10,13,17,0.95)',
      borderTop: `1px solid ${C.border}`,
      borderTopLeftRadius: 32, borderTopRightRadius: 32,
      padding: '24px 24px 36px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          flex: 1, background: C.inBg, borderRadius: 999, padding: '18px 20px',
          display: 'flex', alignItems: 'center',
        }}>
          <span style={{ color: text ? 'white' : C.subtext, fontSize: 16, fontWeight: 500, letterSpacing: -0.7 }}>
            {text || 'Send a Message'}
          </span>
          {text && (
            <span style={{
              display: 'inline-block', width: 2, height: 18,
              background: 'white', marginLeft: 1,
              opacity: Math.round(useCurrentFrame() / 15) % 2 === 0 ? 1 : 0,
            }} />
          )}
        </div>
        <div style={{
          background: C.inBg, borderRadius: '50%', width: 56, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {/* home bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <div style={{ width: 134, height: 5, borderRadius: 999, background: 'white' }} />
      </div>
    </div>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────
export function ChatRecording() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Derive which messages to show
  const visibleMessages = MESSAGES.filter(m => frame >= m.at)

  // Typing indicator: find the active window
  const activeTyping = TYPING.find(([start, end]) => frame >= start && frame < end)
  const typingStart  = activeTyping?.[0] ?? null

  // Input text: find the active input animation
  const activeInput = INPUT_ANIM.find(a => frame >= a.start && frame < a.clearAt)
  let inputText = ''
  if (activeInput && frame < activeInput.end) {
    const progress = (frame - activeInput.start) / (activeInput.end - activeInput.start)
    const chars = Math.floor(interpolate(progress, [0, 1], [0, activeInput.text.length]))
    inputText = activeInput.text.slice(0, chars)
  }

  // Whole-scene fade-in
  const sceneOpacity = spring({ frame, fps, config: { damping: 200 }, from: 0, to: 1 })

  // Group consecutive incoming messages so only the last shows the avatar
  const grouped = visibleMessages.map((m, i) => {
    const next = visibleMessages[i + 1]
    const showAvatar = m.dir === 'in' && (!next || next.dir !== 'in')
    return { ...m, showAvatar }
  })

  return (
    <div style={{
      width: 430, height: 932,
      background: C.bg,
      borderRadius: 44,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
      opacity: sceneOpacity,
    }}>
      <Header />

      {/* Scroll area */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          padding: '160px 24px 140px',
        }}>
          {grouped.map((msg) =>
            msg.dir === 'out' ? (
              <div key={msg.at} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <OutBubble startFrame={msg.at}>{msg.text}</OutBubble>
              </div>
            ) : (
              <InBubble key={msg.at} startFrame={msg.at} showAvatar={msg.showAvatar}>
                {msg.text}
              </InBubble>
            )
          )}

          {typingStart !== null && (
            <TypingIndicator startFrame={typingStart} />
          )}
        </div>
      </div>

      <InputBar text={inputText} />
    </div>
  )
}
