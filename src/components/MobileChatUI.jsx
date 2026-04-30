import { useRef, useEffect, useState } from 'react'
import './MobileChatUI.css'

const AVATAR = '/img/avatar.jpg'
const LANDSCAPE1 = '/img/landscape1.jpg'
const LANDSCAPE2 = '/img/landscape2.jpg'
const LANDSCAPE3 = '/img/landscape1.jpg'

// Waveform bar heights (from design) — used as the full-scale template
const BARS = [8, 8, 24, 24, 14, 14, 10, 10, 8, 8, 12, 12, 24, 14, 24, 16, 16, 8]

// Scale both bar count and height so short clips look short
function scaleBars(duration) {
  const FULL_SECS = 30  // at 30s+ you get all 18 bars at full height
  const ratio = Math.min(duration / FULL_SECS, 1)

  const count = Math.max(4, Math.round(BARS.length * ratio))
  const heightScale = 0.25 + 0.75 * ratio

  // Sample evenly across the pattern so the shape stays natural
  const step = (BARS.length - 1) / Math.max(count - 1, 1)
  const sampled = Array.from({ length: count }, (_, i) => BARS[Math.round(i * step)])

  return sampled.map(h => Math.max(4, Math.round(h * heightScale)))
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose, onChangeIndex }) {
  const startX = useRef(null)
  const didSwipe = useRef(false)
  const [dir, setDir] = useState('fade')
  const [offset, setOffset] = useState(0)

  const go = (next) => {
    setDir(next > index ? 'right' : 'left')
    onChangeIndex(next)
    setOffset(0)
  }

  const startDrag = (x) => { startX.current = x }

  const moveDrag = (x) => {
    if (startX.current === null) return
    setOffset(x - startX.current)
  }

  const endDrag = (x) => {
    if (startX.current === null) return
    const delta = x - startX.current
    startX.current = null
    setOffset(0)
    if (Math.abs(delta) < 30) return
    didSwipe.current = true
    if (delta < 0 && index < images.length - 1) go(index + 1)
    if (delta > 0 && index > 0)                 go(index - 1)
  }

  const handleClick = () => {
    if (didSwipe.current) { didSwipe.current = false; return }
    onClose()
  }

  return (
    <div
      className="lightbox"
      onClick={handleClick}
      onMouseDown={(e) => startDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={(e) => endDrag(e.clientX)}
      onMouseLeave={(e) => endDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
    >
      <img
        key={index}
        src={images[index]}
        alt=""
        className={offset === 0 ? `lb-enter-${dir}` : ''}
        style={offset !== 0 ? { transform: `translateX(${offset}px)`, transition: 'none' } : {}}
      />
      {images.length > 1 && (
        <div className="lb-dots">
          {images.map((_, i) => (
            <div key={i} className={`lb-dot${i === index ? ' active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconBack() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDots() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="8" cy="16" r="2" fill="white" />
      <circle cx="16" cy="16" r="2" fill="white" />
      <circle cx="24" cy="16" r="2" fill="white" />
    </svg>
  )
}


function IconMic() {
  return <img src="/img/mic-02.svg" alt="" width="24" height="24" />
}

function IconImage() {
  return <img src="/img/image-02.svg" alt="" width="24" height="24" />
}

function IconSend() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M21 1L10 12M21 1L14 21L10 12M21 1L1 8L10 12" stroke="#06080b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconNavigate() {
  return <img src="/img/Send.svg" alt="" width="24" height="24" />
}

function IconCopy() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="white" strokeWidth="1.6"/>
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function IconReply() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 14L4 9l5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconForward() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 14l5-5-5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconDeleteAction() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" stroke="rgb(251,92,85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Status Bar ──────────────────────────────────────────────────────────────

function StatusBar() {
  return <img src="/img/statusbar.svg" alt="" className="w-full" draggable={false} />
}

// ─── Chat Header ─────────────────────────────────────────────────────────────

function ChatHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-[rgba(6,8,11,0.4)] border-b border-white/10 flex flex-col items-center gap-4 pb-6 rounded-bl-[32px] rounded-br-[32px]">
      <StatusBar />
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center text-white">
            <IconBack />
          </button>
          <div className="relative flex items-center gap-[10px]">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0b0e10] flex-shrink-0">
              <img src={AVATAR} alt="Sulaimon" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-7 w-3 h-3 rounded-full bg-[#22c55e] ring-2 ring-[#06080b]" />
            <div className="flex flex-col gap-[2px]">
              <span className="text-white font-medium text-base leading-5 tracking-[-0.7px]">
                Sulaimon Odeniran
              </span>
              <span className="text-[#6b717c] text-sm leading-[18px] font-medium">
                Online now
              </span>
            </div>
          </div>
        </div>
        <button className="text-white">
          <IconDots />
        </button>
      </div>
    </div>
  )
}

// ─── Reply block (inside a bubble) ───────────────────────────────────────────

function ReplyBlock({ senderName, text }) {
  return (
    <div className="bg-[#1f2937] rounded-[8px] px-3 py-2 mb-2 w-full">
      <p className="text-white/60 text-[12px] leading-4 font-medium tracking-[-0.5px]">{senderName}</p>
      <p className="text-white text-[12px] leading-4 font-medium tracking-[-0.5px] line-clamp-1">{text}</p>
    </div>
  )
}

// ─── Message Bubbles ─────────────────────────────────────────────────────────

function OutBubble({ children, onHold, reaction, onRemoveReaction, replyTo }) {
  const timer = useRef(null)
  const startPress = () => { timer.current = setTimeout(() => onHold?.(), 420) }
  const cancelPress = () => clearTimeout(timer.current)
  return (
    <div className="relative flex-shrink-0">
      <div
        className="chat-bubble bg-[#f1f1f1] rounded-[16px] px-3 py-2 select-none"
        onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
        onTouchStart={startPress} onTouchEnd={cancelPress} onTouchMove={cancelPress}
      >
        {replyTo && <ReplyBlock senderName={replyTo.senderName} text={replyTo.text} />}
        <p className="text-[#06080b] text-base font-medium leading-5 tracking-[-0.7px]">
          {children}
        </p>
      </div>
      {reaction && <ReactionBadge emoji={reaction} outgoing onRemove={onRemoveReaction} />}
    </div>
  )
}

function InBubble({ children, onHold, reaction, onRemoveReaction }) {
  const timer = useRef(null)
  const startPress = () => { timer.current = setTimeout(() => onHold?.(), 420) }
  const cancelPress = () => clearTimeout(timer.current)
  return (
    <div className="relative flex-shrink-0 self-start">
      <div
        className="chat-bubble bg-[#1f2937] rounded-[16px] px-3 py-2 select-none"
        onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
        onTouchStart={startPress} onTouchEnd={cancelPress} onTouchMove={cancelPress}
      >
        <p className="text-white text-base font-medium leading-5 tracking-[-0.7px]">
          {children}
        </p>
      </div>
      {reaction && <ReactionBadge emoji={reaction} onRemove={onRemoveReaction} />}
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0b0e10] flex-shrink-0">
      <img src={AVATAR} alt="" className="w-full h-full object-cover" />
    </div>
  )
}

function ReactionBadge({ emoji, outgoing, onRemove }) {
  return (
    <div
      className={`absolute -bottom-[8px] w-7 h-7 rounded-full flex items-center justify-center text-sm z-10 border-2 cursor-pointer active:scale-90 transition-transform select-none ${
        outgoing
          ? '-left-[8px] bg-white border-[#f1f1f1]'
          : '-right-[8px] bg-[#2a3a4a] border-[#1f2937]'
      }`}
      onClick={(e) => { e.stopPropagation(); onRemove?.() }}
    >
      {emoji}
    </div>
  )
}

// ─── Specific Messages ───────────────────────────────────────────────────────

function StackedImages({ onOpen, onHold, reaction, onRemoveReaction }) {
  const timer = useRef(null)
  const startPress = () => { timer.current = setTimeout(() => onHold?.(), 420) }
  const cancelPress = () => clearTimeout(timer.current)
  return (
    <div className="flex flex-col items-end gap-2">
      <div
        className="stacked-images relative h-[240px] w-[260px] select-none"
        onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
        onTouchStart={startPress} onTouchEnd={cancelPress} onTouchMove={cancelPress}
      >
        <div className="chat-img-back cursor-pointer" onClick={() => onOpen([LANDSCAPE1, LANDSCAPE2], 0)}>
          <img src={LANDSCAPE1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="chat-img-front cursor-pointer" onClick={() => onOpen([LANDSCAPE1, LANDSCAPE2], 1)}>
          <img src={LANDSCAPE2} alt="" className="w-full h-full object-cover" />
        </div>
        {reaction && <ReactionBadge emoji={reaction} outgoing onRemove={onRemoveReaction} />}
      </div>
      <OutBubble>Check this out  🔥🔥</OutBubble>
    </div>
  )
}

function IncomingCluster1({ time, onHold, reactions = {}, onRemoveReaction, hiddenIds = new Set() }) {
  const show1a = !hiddenIds.has('si-1a')
  const show1b = !hiddenIds.has('si-1b')
  if (!show1a && !show1b) return null
  return (
    <div className="flex items-end gap-2.5">
      <UserAvatar />
      <div className="flex flex-col gap-1.5">
        {show1a && (
          <InBubble
            onHold={() => onHold?.({ text: 'Oh wow 😄', msgId: 'si-1a' })}
            reaction={reactions['si-1a']}
            onRemoveReaction={() => onRemoveReaction?.('si-1a')}
          >Oh wow 😄</InBubble>
        )}
        {show1b && (
          <InBubble
            onHold={() => onHold?.({ text: 'Those pictures are so beautiful! Are you using AI tools for these too?', msgId: 'si-1b' })}
            reaction={reactions['si-1b']}
            onRemoveReaction={() => onRemoveReaction?.('si-1b')}
          >
            Those pictures are so beautiful! Are you using AI tools for these too?
          </InBubble>
        )}
        {time && <Ts time={time} align="left" />}
      </div>
    </div>
  )
}

function IncomingCluster2({ onOpen, time, onHold, reactions = {}, onRemoveReaction, hiddenIds = new Set() }) {
  const show2a = !hiddenIds.has('si-2a')
  const show2b = !hiddenIds.has('si-2b')
  if (!show2a && !show2b) return null
  return (
    <div className="flex items-end gap-2.5">
      <UserAvatar />
      <div className="flex flex-col gap-1.5">
        {show2a && (
          <InBubble
            onHold={() => onHold?.({ text: "Wait I'll show you something", msgId: 'si-2a' })}
            reaction={reactions['si-2a']}
            onRemoveReaction={() => onRemoveReaction?.('si-2a')}
          >Wait I'll show you something</InBubble>
        )}
        {show2b && (
          <InBubble
            onHold={() => onHold?.({ text: "I generated this yesterday when I couldn't sleep 😅", msgId: 'si-2b' })}
            reaction={reactions['si-2b']}
            onRemoveReaction={() => onRemoveReaction?.('si-2b')}
          >
            I generated this yesterday when I couldn't sleep 😅
          </InBubble>
        )}
        <div
          className="w-[164px] h-[200px] rounded-[20px] overflow-hidden cursor-pointer"
          onClick={() => onOpen([LANDSCAPE3], 0)}
        >
          <img src={LANDSCAPE3} alt="" className="w-full h-full object-cover" />
        </div>
        {time && <Ts time={time} align="left" />}
      </div>
    </div>
  )
}

function VoiceMessage({ onHold, reaction, onRemoveReaction }) {
  return <VoiceBubble duration={20} onHold={onHold} reaction={reaction} onRemoveReaction={onRemoveReaction} />
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <UserAvatar />
      <div className="flex flex-col gap-1.5">
        <p className="text-base leading-5 tracking-[-0.7px]">
          <span className="text-white font-semibold">Sulaimon Odeniran</span>
          <span className="text-white"> </span>
          <span className="text-white/60 font-normal">is typing</span>
        </p>
        <div className="bg-[#1f2937] rounded-[20px] w-[72px] h-9 flex items-center justify-center gap-1.5 px-4">
          <div className="w-2 h-2 rounded-full bg-white/50 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-white/50 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-white/50 typing-dot" />
        </div>
      </div>
    </div>
  )
}

const REC_BAR_COUNT = 36
const REC_H = [6, 8, 10, 12, 14, 16, 20, 24]
const MAX_REC_SECS = 60

function randomRecHeights() {
  return Array.from({ length: REC_BAR_COUNT }, () => REC_H[Math.floor(Math.random() * REC_H.length)])
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m} : ${String(s).padStart(2, '0')}`
}

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function Ts({ time, align = 'right' }) {
  return (
    <span className={`text-[10px] font-medium text-white/30 tracking-wide px-1 ${align === 'right' ? 'self-end' : 'self-start'}`}>
      {time}
    </span>
  )
}

const SPEED_STEPS = [1, 1.5, 2]

function VoiceBubble({ duration, onHold, reaction, onRemoveReaction }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(0)
  const pressTimer = useRef(null)
  const startPress = () => { pressTimer.current = setTimeout(() => onHold?.(), 420) }
  const cancelPress = () => clearTimeout(pressTimer.current)

  const speed = SPEED_STEPS[speedIdx]

  // Restart interval whenever play state or speed changes
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setPlaybackTime(t => {
        if (t >= duration - 1) {
          setIsPlaying(false)
          return 0
        }
        return t + 1
      })
    }, Math.round(1000 / speed))
    return () => clearInterval(id)
  }, [isPlaying, speed, duration])

  const handleToggle = () => setIsPlaying(p => !p)
  const handleCycleSpeed = () => setSpeedIdx(i => (i + 1) % SPEED_STEPS.length)

  const progress = playbackTime / Math.max(duration, 1)
  const remaining = duration - playbackTime

  const speedLabel = speed === 1 ? '1x' : speed === 1.5 ? '1.5x' : '2x'
  const bars = scaleBars(duration)

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="relative flex-shrink-0">
      <div
        className="bg-[#f1f1f1] rounded-[16px] px-3 py-2 flex items-center gap-2 select-none"
        onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
        onTouchStart={startPress} onTouchEnd={cancelPress} onTouchMove={cancelPress}
      >
        <button
          onClick={handleToggle}
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-[#1f2937]"
        >
          {isPlaying ? (
            <div className="w-[10px] h-[10px] bg-white rounded-[2px]" />
          ) : (
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
              <path d="M1 1L8 5.5L1 10V1Z" fill="white" />
            </svg>
          )}
        </button>
        <div className="flex items-center gap-[2.4px]">
          {bars.map((h, i) => {
            const filled = isPlaying && i / bars.length >= progress
            return (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className={`w-[5px] rounded-[9.6px] voice-bar ${filled ? 'filled' : isPlaying ? 'unfilled' : ''}`}
              />
            )
          })}
        </div>
        <span className="text-[rgba(6,8,11,0.6)] text-base font-medium tracking-[-0.7px] whitespace-nowrap">
          {isPlaying ? formatTime(remaining) : formatTime(duration)}
        </span>
      </div>
      {reaction && <ReactionBadge emoji={reaction} outgoing onRemove={onRemoveReaction} />}
      </div>
      {isPlaying && (
        <button
          onClick={handleCycleSpeed}
          className="bg-[#f1f1f1] rounded-[16px] px-3 py-1.5 flex-shrink-0 speed-btn-enter"
        >
          <span className="text-[rgba(6,8,11,0.6)] text-base font-medium tracking-[-0.7px]">{speedLabel}</span>
        </button>
      )}
    </div>
  )
}

function SentVoiceBubble({ duration, onHold, reaction, onRemoveReaction }) {
  return <VoiceBubble duration={duration} onHold={onHold} reaction={reaction} onRemoveReaction={onRemoveReaction} />
}

// ─── Sent image message ───────────────────────────────────────────────────────

const SPREAD_TOTAL_W = 340
const SPREAD_GAP     = 8

function SentImageMessage({ images, onOpen, onHold, reaction, onRemoveReaction }) {
  const [hovered, setHovered] = useState(false)
  const pressTimer = useRef(null)
  const startPress = () => { pressTimer.current = setTimeout(() => onHold?.(), 420) }
  const cancelPress = () => clearTimeout(pressTimer.current)
  const n = images.length

  if (n === 1) {
    return (
      <div className="relative flex-shrink-0">
        <div
          className="w-[164px] h-[200px] rounded-[20px] overflow-hidden cursor-pointer select-none"
          onClick={() => onOpen(images, 0)}
          onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
          onTouchStart={startPress} onTouchEnd={cancelPress} onTouchMove={cancelPress}
        >
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        </div>
        {reaction && <ReactionBadge emoji={reaction} outgoing onRemove={onRemoveReaction} />}
      </div>
    )
  }

  // Always render at most 3 cards; extras are shown via badge
  const renderCount = Math.min(n, 3)
  const shown       = images.slice(0, renderCount)
  const extras      = Math.max(0, n - 3)

  // ── Spread (hover) geometry — 3 images max ──
  const sImgW = Math.floor((SPREAD_TOTAL_W - (renderCount - 1) * SPREAD_GAP) / renderCount)
  const sImgH = Math.round(sImgW * 200 / 164)
  const sW    = sImgW * renderCount + SPREAD_GAP * (renderCount - 1)
  const sH    = sImgH + 20

  // ── Stack (default) geometry ──
  const stackW = 260
  const stackH = 240

  const stackPos = (i) => {
    if (renderCount === 2) {
      if (i === 0) return { transform: 'rotate(-17.5deg)', top: 20, left: 12,  width: 164, height: 200 }
      return               { transform: 'rotate(0deg)',    top: 20, left: 96,  width: 164, height: 200 }
    }
    if (i === 0) return { transform: 'rotate(-17.5deg)', top: 20, left: 12,  width: 164, height: 200 }
    if (i === 1) return { transform: 'rotate(-8deg)',    top: 16, left: 48,  width: 164, height: 200 }
    return               { transform: 'rotate(0deg)',    top: 20, left: 96,  width: 164, height: 200 }
  }

  const spreadPos = (i) => ({
    transform: 'rotate(0deg)',
    top:   10,
    left:  i * (sImgW + SPREAD_GAP),
    width:  sImgW,
    height: sImgH,
  })

  const stackZ = (i) => {
    if (i === 0) return 1
    if (i === 1 && renderCount === 3) return 2
    return 3
  }

  const frontIdx = renderCount - 1

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width:  hovered ? sW : stackW,
        height: hovered ? sH : stackH,
        transition: 'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), height 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); cancelPress() }}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {shown.map((url, i) => (
        <div
          key={i}
          className="absolute rounded-[20px] overflow-hidden cursor-pointer"
          style={{
            ...(hovered ? spreadPos(i) : stackPos(i)),
            zIndex: hovered ? i + 1 : stackZ(i),
            transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
          onClick={() => onOpen(images, i)}
        >
          <img src={url} alt="" className="w-full h-full object-cover" />
          {i === frontIdx && extras > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">+{extras}</span>
            </div>
          )}
        </div>
      ))}
      {reaction && <ReactionBadge emoji={reaction} outgoing onRemove={onRemoveReaction} />}
    </div>
  )
}

// ─── Message context menu ────────────────────────────────────────────────────

const REACTIONS = ['🔥', '😭', '🙈', '❤️', '😄', '🙏', '💪']

function MessageContextMenu({ message, onClose, onReact, onReply, onDelete }) {
  const handleCopy = () => {
    if (message.text) navigator.clipboard?.writeText(message.text)
    onClose()
  }

  const handleReply = () => {
    const text = message.type === 'voice'
      ? '🎤 Voice message'
      : message.type === 'images'
        ? '📷 Photo'
        : message.text
    const senderName = message.isOutgoing ? 'You' : 'Sulaimon Odeniran'
    onReply?.({ text, senderName })
    onClose()
  }

  return (
    <>
      <div className="absolute inset-0 z-30 backdrop-blur-[3px] bg-[rgba(251,251,251,0.08)]" onClick={onClose} />
      <div className="absolute bottom-6 left-6 right-6 z-40 bg-[#06080b] rounded-[32px] px-5 pt-4 pb-6 flex flex-col gap-5 context-sheet-enter">

        <div className="flex justify-center pt-1">
          <div className="w-10 h-[6px] bg-white/20 rounded-full" />
        </div>

        {/* message preview */}
        <div className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}>
          {message.type === 'text' && (
            <div className={`rounded-[16px] px-3 py-2 max-w-[250px] ${message.isOutgoing ? 'bg-[#f1f1f1]' : 'bg-[#1f2937]'}`}>
              <p className={`text-base font-medium leading-5 tracking-[-0.7px] ${message.isOutgoing ? 'text-[#06080b]' : 'text-white'}`}>
                {message.text}
              </p>
            </div>
          )}
          {message.type === 'voice' && (
            <div className="bg-[#f1f1f1] rounded-[16px] px-3 py-2">
              <p className="text-[rgba(6,8,11,0.6)] text-base font-medium tracking-[-0.7px]">🎤 Voice message · {message.duration}s</p>
            </div>
          )}
          {message.type === 'images' && (
            <div className="bg-[#f1f1f1] rounded-[16px] px-3 py-2">
              <p className="text-[rgba(6,8,11,0.6)] text-base font-medium tracking-[-0.7px]">📷 Photo</p>
            </div>
          )}
        </div>

        {/* emoji reactions */}
        <div className="flex flex-col gap-[10px]">
          <span className="text-white/60 text-sm font-medium tracking-[-0.7px]">React</span>
          <div className="flex gap-3 overflow-x-auto scrollbar-hidden pb-1">
            {REACTIONS.map(emoji => (
              <button
                key={emoji}
                className="text-[28px] flex-shrink-0 transition-transform active:scale-125"
                onClick={() => onReact(emoji, message.msgId)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-col">
          <button onClick={handleCopy} className="flex items-center justify-between py-3 border-b border-white/[0.06]">
            <span className="text-white text-sm font-medium tracking-[-0.7px]">Copy</span>
            <IconCopy />
          </button>
          <button onClick={handleReply} className="flex items-center justify-between py-3 border-b border-white/[0.06]">
            <span className="text-white text-sm font-medium tracking-[-0.7px]">Reply</span>
            <IconReply />
          </button>
          <button onClick={onClose} className="flex items-center justify-between py-3 border-b border-white/[0.06]">
            <span className="text-white text-sm font-medium tracking-[-0.7px]">Forward</span>
            <IconForward />
          </button>
          <button onClick={() => { onDelete?.(); onClose() }} className="flex items-center justify-between py-3">
            <span className="text-[#fb5c55] text-sm font-medium tracking-[-0.7px]">Delete</span>
            <IconDeleteAction />
          </button>
        </div>

      </div>
    </>
  )
}

// ─── Input Bar ───────────────────────────────────────────────────────────────

// ─── Delete confirmation bottom sheet ────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <>
      <div className="absolute inset-0 z-50 backdrop-blur-[3px] bg-[rgba(251,251,251,0.08)]" onClick={onCancel} />
      <div className="absolute bottom-6 left-6 right-6 z-50 bg-[#06080b] rounded-[32px] px-5 pt-4 pb-6 flex flex-col gap-5 context-sheet-enter">
        <div className="flex justify-center pt-1">
          <div className="w-10 h-[6px] bg-white/20 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-white font-semibold text-[17px] tracking-[-0.5px]">Delete message?</p>
          <p className="text-white/40 text-sm font-medium tracking-[-0.4px] text-center">This message will be removed from the conversation.</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-[rgba(251,92,85,0.12)] rounded-[20px] text-[#fb5c55] font-semibold text-base tracking-[-0.5px]"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 bg-[#1f2937] rounded-[20px] text-white font-medium text-base tracking-[-0.5px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Undo toast ───────────────────────────────────────────────────────────────

function UndoToast({ onUndo }) {
  return (
    <div className="absolute bottom-[130px] left-0 right-0 z-40 flex justify-center px-6 pointer-events-none">
      <div className="backdrop-blur-[10px] bg-[rgba(255,255,255,0.1)] rounded-full pl-3 pr-1 py-1 flex items-center gap-8 msg-enter pointer-events-auto">
        <span className="text-white text-[12px] font-medium leading-4 tracking-[-0.044rem] whitespace-nowrap">Message deleted</span>
        <button
          onClick={onUndo}
          className="bg-[rgba(78,216,130,0.2)] active:bg-[rgba(78,216,130,0.3)] transition-colors px-3 py-2 rounded-full flex-shrink-0"
        >
          <span className="text-[#4ED882] text-[14px] font-medium leading-[18px] tracking-[-0.044rem]">Undo</span>
        </button>
      </div>
    </div>
  )
}

// ─── Input Bar ───────────────────────────────────────────────────────────────

function InputBar({ value, onChange, onSend, isRecording, isPaused, isPlayingBack, onToggleRecording, onPauseResume, onPlayback, onDeleteRecording, recordingTime, onImagePick, replyTo, onCancelReply }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const [recHeights, setRecHeights] = useState(randomRecHeights)

  useEffect(() => {
    if (!isRecording || isPaused) return
    const id = setInterval(() => setRecHeights(randomRecHeights()), 80)
    return () => clearInterval(id)
  }, [isRecording, isPaused])

  const filledCount = Math.min(
    Math.round((recordingTime / MAX_REC_SECS) * REC_BAR_COUNT),
    REC_BAR_COUNT
  )

  const hasText = value.trim().length > 0

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-xl bg-[rgba(6,8,11,0.4)] border-t border-white/10 pt-6 flex flex-col items-center gap-4 rounded-tl-[32px] rounded-tr-[32px]">
      {replyTo && !isRecording && (
        <div className="w-full px-6 -mb-1 flex items-center gap-3">
          <div className="flex-1 bg-[#1f2937] rounded-[12px] px-3 py-2 border-l-2 border-white/30 min-w-0">
            <p className="text-white/60 text-[11px] font-medium leading-4 tracking-[-0.4px]">{replyTo.senderName}</p>
            <p className="text-white text-[12px] font-medium leading-4 tracking-[-0.4px] truncate">{replyTo.text}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-white/40 flex-shrink-0 active:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
      <div className="w-full px-6">

        {isRecording ? (
          /* ── Recording mode: pill on top, action buttons below ── */
          <div className="flex flex-col gap-5">

            {/* Waveform pill */}
            <div className="bg-[#1f2937] rounded-full px-5 h-14 flex items-center gap-3 rec-enter">
              {isPaused && (
                <button
                  onClick={onPlayback}
                  className="flex-shrink-0 flex items-center justify-center w-4"
                >
                  {isPlayingBack ? (
                    <div className="flex gap-[3px]">
                      <div className="w-[3px] h-[13px] bg-white rounded-full" />
                      <div className="w-[3px] h-[13px] bg-white rounded-full" />
                    </div>
                  ) : (
                    <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                      <path d="M1 1.5l8 5-8 5v-10z" fill="white"/>
                    </svg>
                  )}
                </button>
              )}
              <div className="flex-1 flex items-center gap-[2.4px] min-w-0">
                {recHeights.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px`, transition: isPaused ? 'none' : 'height 0.08s ease' }}
                    className={`flex-1 min-w-0 rounded-[9.6px] ${
                      i < filledCount ? 'bg-[#f1f1f1]' : 'bg-[rgba(241,241,241,0.2)]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[rgba(255,255,255,0.5)] text-sm font-medium tracking-[-0.7px] whitespace-nowrap flex-shrink-0">
                {formatTime(recordingTime)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between rec-enter" style={{ animationDelay: '0.06s' }}>
              {/* Delete */}
              <button
                onClick={onDeleteRecording}
                className="bg-[rgba(251,92,85,0.1)] rounded-full p-4 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" stroke="rgb(251,92,85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Pause (mic) / Resume (square) */}
              <button
                onClick={onPauseResume}
                className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center"
              >
                {isPaused ? (
                  <div className="w-5 h-5 bg-white rounded-[6px]" />
                ) : (
                  <IconMic />
                )}
              </button>

              {/* Send */}
              <button
                onClick={onToggleRecording}
                className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center"
              >
                <IconNavigate />
              </button>
            </div>

          </div>
        ) : (
          /* ── Default mode ── */
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#1f2937] rounded-full px-5 py-[18px] min-w-0 ring-1 ring-transparent focus-within:ring-white transition-shadow duration-200">
              <input
                className="chat-input"
                placeholder="Send a Message"
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasText ? (
                <button
                  onClick={onSend}
                  className="bg-white rounded-full p-4 flex items-center justify-center btn-appear"
                >
                  <IconSend />
                </button>
              ) : (
                <>
                  <button
                    onClick={onToggleRecording}
                    className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center btn-appear"
                  >
                    <IconMic />
                  </button>
                  <button
                    onClick={onImagePick}
                    className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center btn-appear"
                    style={{ animationDelay: '0.05s' }}
                  >
                    <IconImage />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
      <div className="h-9 flex items-end justify-center pb-2 w-full">
        <div className="w-[134px] h-[5px] rounded-full bg-white" />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const RESPONSES = [
  ["Hey! 😊", "What's on your mind?"],
  ["That's really cool! 🔥"],
  ["Haha, I love that 😂"],
  ["Really? Tell me more 👀"],
  ["I was literally just thinking about that 😅"],
  ["Wow, didn't see that coming 😮"],
  ["Facts! 💯"],
  ["You always know what to say 😄"],
  ["Okay okay, I see you 👌"],
  ["That actually makes a lot of sense 🤔"],
]

export default function MobileChatUI() {
  const scrollRef        = useRef(null)
  const timerRef         = useRef(null)
  const fileInputRef     = useRef(null)
  const undoTimerRef     = useRef(null)
  const scriptTimers     = useRef([])
  const responseIndex    = useRef(0)
  const stripRef         = useRef(null)
  const stripDrag        = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })
  const mediaRecorderRef = useRef(null)
  const audioChunksRef   = useRef([])
  const streamRef        = useRef(null)
  const recordingBlobUrl = useRef(null)
  const audioPlayerRef   = useRef(null)
  const recordingTimeRef = useRef(0)

  const [inputValue,    setInputValue]    = useState('')
  const [messages,      setMessages]      = useState([])
  const [isTyping,      setIsTyping]      = useState(false)
  const [isRecording,   setIsRecording]   = useState(false)
  const [isPaused,      setIsPaused]      = useState(false)
  const [isPlayingBack, setIsPlayingBack] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [lightbox,      setLightbox]      = useState(null)
  const [pendingImages, setPendingImages] = useState(null)
  const [heldMessage,   setHeldMessage]   = useState(null)
  const [reactions,     setReactions]     = useState({})
  const [replyTo,       setReplyTo]       = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [undoData,      setUndoData]      = useState(null)

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }

  useEffect(() => { scrollToBottom() }, [])
  useEffect(() => { scrollToBottom() }, [messages, isTyping])
  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(undoTimerRef.current) }, [])

  const triggerResponse = () => {
    const idx = responseIndex.current % RESPONSES.length
    responseIndex.current++
    const texts = RESPONSES[idx]

    scriptTimers.current.forEach(clearTimeout)
    scriptTimers.current = []
    const push = (fn, d) => { scriptTimers.current.push(setTimeout(fn, d)) }

    push(() => setIsTyping(true), 800)
    push(() => {
      setIsTyping(false)
      const time = nowTime()
      setMessages(prev => [
        ...prev,
        ...texts.map((text, i) => ({
          id: `r-${Date.now()}-${i}`,
          type: 'text',
          text,
          isOutgoing: false,
          time,
        })),
      ])
    }, 2800)
  }

  const handleReact = (emoji, msgId) => {
    if (msgId) setReactions(prev => ({ ...prev, [msgId]: emoji }))
    setHeldMessage(null)
  }

  const removeReaction = (msgId) => setReactions(prev => {
    const next = { ...prev }
    delete next[msgId]
    return next
  })

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    setMessages(prev => [...prev, {
      id: `m-${Date.now()}`, type: 'text', text, isOutgoing: true, time: nowTime(), replyTo,
    }])
    setInputValue('')
    setReplyTo(null)
    triggerResponse()
  }

  const stopPlayback = () => {
    audioPlayerRef.current?.pause()
    audioPlayerRef.current = null
    setIsPlayingBack(false)
  }

  const handleToggleRecording = async () => {
    if (isRecording) {
      // ── Stop & send ──
      clearInterval(timerRef.current)
      stopPlayback()
      const capturedTime  = recordingTimeRef.current
      const capturedReply = replyTo
      const mr = mediaRecorderRef.current
      if (mr && mr.state !== 'inactive') {
        mr.onstop = () => {
          const blob     = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          const audioUrl = URL.createObjectURL(blob)
          setMessages(prev => [...prev, {
            id: `m-${Date.now()}`, type: 'voice', duration: capturedTime,
            audioUrl, isOutgoing: true, time: nowTime(), replyTo: capturedReply,
          }])
          streamRef.current?.getTracks().forEach(t => t.stop())
          triggerResponse()
        }
        mr.stop()
      } else {
        setMessages(prev => [...prev, {
          id: `m-${Date.now()}`, type: 'voice', duration: capturedTime,
          isOutgoing: true, time: nowTime(), replyTo: capturedReply,
        }])
        triggerResponse()
      }
      setReplyTo(null)
      setIsRecording(false)
      setIsPaused(false)
      setRecordingTime(0)
      recordingTimeRef.current = 0
      if (recordingBlobUrl.current) { URL.revokeObjectURL(recordingBlobUrl.current); recordingBlobUrl.current = null }
    } else {
      // ── Start ──
      audioChunksRef.current = []
      recordingTimeRef.current = 0
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const mr = new MediaRecorder(stream)
        mediaRecorderRef.current = mr
        mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
        mr.start(200)
      } catch {
        mediaRecorderRef.current = null
      }
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(t => { recordingTimeRef.current = t + 1; return t + 1 })
      }, 1000)
    }
  }

  const handlePauseResume = () => {
    if (isPaused) {
      stopPlayback()
      const mr = mediaRecorderRef.current
      if (mr?.state === 'paused') mr.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingTime(t => { recordingTimeRef.current = t + 1; return t + 1 })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      const mr = mediaRecorderRef.current
      if (mr?.state === 'recording') mr.pause()
      // snapshot blob for playback
      if (audioChunksRef.current.length > 0) {
        if (recordingBlobUrl.current) URL.revokeObjectURL(recordingBlobUrl.current)
        recordingBlobUrl.current = URL.createObjectURL(new Blob(audioChunksRef.current, { type: 'audio/webm' }))
      }
      setIsPaused(true)
    }
  }

  const handlePlayback = () => {
    if (!recordingBlobUrl.current) return
    if (isPlayingBack) {
      stopPlayback()
    } else {
      const audio = new Audio(recordingBlobUrl.current)
      audioPlayerRef.current = audio
      audio.onended = () => setIsPlayingBack(false)
      audio.play().catch(() => {})
      setIsPlayingBack(true)
    }
  }

  const handleDeleteRecording = () => {
    clearInterval(timerRef.current)
    stopPlayback()
    const mr = mediaRecorderRef.current
    if (mr && mr.state !== 'inactive') {
      mr.onstop = () => streamRef.current?.getTracks().forEach(t => t.stop())
      mr.stop()
    }
    audioChunksRef.current = []
    if (recordingBlobUrl.current) { URL.revokeObjectURL(recordingBlobUrl.current); recordingBlobUrl.current = null }
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    recordingTimeRef.current = 0
  }

  const handleImagePick = () => fileInputRef.current?.click()

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setPendingImages(files.map(f => URL.createObjectURL(f)))
    e.target.value = ''
  }

  const handleConfirmImages = () => {
    setMessages(prev => [...prev, {
      id: `m-${Date.now()}`, type: 'images', urls: pendingImages, isOutgoing: true, time: nowTime(),
    }])
    setPendingImages(null)
    triggerResponse()
  }

  const handleCancelImages = () => {
    pendingImages?.forEach(url => URL.revokeObjectURL(url))
    setPendingImages(null)
  }

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(pendingImages[index])
    const updated = pendingImages.filter((_, i) => i !== index)
    if (updated.length === 0) setPendingImages(null)
    else setPendingImages(updated)
  }

  const onStripMouseDown = (e) => {
    if (!stripRef.current) return
    stripDrag.current = { active: true, startX: e.clientX, scrollLeft: stripRef.current.scrollLeft, moved: false }
  }
  const onStripMouseMove = (e) => {
    if (!stripDrag.current.active || !stripRef.current) return
    const dx = e.clientX - stripDrag.current.startX
    if (Math.abs(dx) > 4) stripDrag.current.moved = true
    stripRef.current.scrollLeft = stripDrag.current.scrollLeft - dx
  }
  const onStripEnd = () => { stripDrag.current.active = false }

  // Group consecutive same-direction messages so incoming share one avatar
  const messageGroups = []
  let gi = 0
  while (gi < messages.length) {
    const isOut = messages[gi].isOutgoing
    const group = []
    while (gi < messages.length && messages[gi].isOutgoing === isOut) {
      group.push(messages[gi])
      gi++
    }
    messageGroups.push({ isOutgoing: isOut, messages: group })
  }

  return (
    <div className="relative w-full h-dvh bg-[#06080b] overflow-hidden md:w-[430px] md:h-[932px] md:rounded-[44px] md:shadow-2xl">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChangeIndex={(i) => setLightbox(lb => ({ ...lb, index: i }))}
        />
      )}

      {heldMessage && (
        <MessageContextMenu
          message={heldMessage}
          onClose={() => setHeldMessage(null)}
          onReact={handleReact}
          onReply={(r) => setReplyTo(r)}
          onDelete={() => setDeleteTarget(heldMessage)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const msgId = deleteTarget.msgId
            setDeleteTarget(null)
            if (!msgId) return
            const savedReaction = reactions[msgId]
            clearTimeout(undoTimerRef.current)
            undoTimerRef.current = setTimeout(() => setUndoData(null), 4000)

            const idx = messages.findIndex(m => m.id === msgId)
            if (idx !== -1) {
              const msg = messages[idx]
              setMessages(prev => prev.filter((_, i) => i !== idx))
              setReactions(r => { const n = { ...r }; delete n[msgId]; return n })
              setUndoData({ msg, index: idx, reaction: savedReaction })
            }
          }}
        />
      )}

      {undoData && (
        <UndoToast
          onUndo={() => {
            clearTimeout(undoTimerRef.current)
            setMessages(prev => {
              const next = [...prev]
              next.splice(undoData.index, 0, undoData.msg)
              return next
            })
            if (undoData.reaction) setReactions(prev => ({ ...prev, [undoData.msg.id]: undoData.reaction }))
            setUndoData(null)
          }}
        />
      )}

      {/* Image confirmation sheet */}
      {pendingImages && (
        <div className="absolute bottom-0 left-0 right-0 z-40 photo-panel bg-[#06080b] border-t border-white/[0.08] rounded-t-[32px] pt-6 pb-10 flex flex-col gap-5">
          <div className="flex items-center justify-between px-6">
            <span className="text-white font-semibold text-[17px] tracking-[-0.5px]">
              {pendingImages.length} photo{pendingImages.length !== 1 ? 's' : ''} selected
            </span>
            <button onClick={handleCancelImages} className="text-white text-sm font-semibold tracking-[-0.3px]">
              Cancel
            </button>
          </div>

          <div
            ref={stripRef}
            className="flex gap-[10px] overflow-x-auto px-6 scrollbar-hidden select-none"
            style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
            onMouseDown={onStripMouseDown}
            onMouseMove={onStripMouseMove}
            onMouseUp={onStripEnd}
            onMouseLeave={onStripEnd}
          >
            {pendingImages.map((url, i) => (
              <div key={i} className="relative flex-shrink-0">
                <div className="w-[90px] h-[118px] rounded-[18px] overflow-hidden pointer-events-none">
                  <img src={url} alt="" className="w-full h-full object-cover" draggable={false} />
                </div>
                <button
                  onClick={() => { if (!stripDrag.current.moved) handleRemoveImage(i) }}
                  className="absolute top-[7px] right-[7px] w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1L1 9" stroke="#06080b" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="px-6">
            <button
              onClick={handleConfirmImages}
              className="w-full bg-white text-[#06080b] font-semibold text-base rounded-full py-4 tracking-[-0.5px]"
            >
              Send {pendingImages.length > 1 ? `${pendingImages.length} photos` : 'photo'}
            </button>
          </div>
        </div>
      )}

      <ChatHeader />

      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto scrollbar-hidden chat-scroll">
        <div className="flex flex-col gap-4 px-6 py-4">

          {messageGroups.map((group, groupIdx) => {
            if (group.isOutgoing) {
              return (
                <div key={`og-${groupIdx}`} className="flex flex-col gap-2">
                  {group.messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col items-end gap-1 msg-enter">
                      {msg.type === 'voice' ? (
                        <>
                          {msg.replyTo && (
                            <div className="bg-[#1f2937] rounded-[10px] px-3 py-2 border-l-2 border-white/30 max-w-[220px]">
                              <p className="text-white/60 text-[11px] font-medium leading-4">{msg.replyTo.senderName}</p>
                              <p className="text-white text-[11px] font-medium leading-4 truncate">{msg.replyTo.text}</p>
                            </div>
                          )}
                          <SentVoiceBubble
                            duration={msg.duration}
                            onHold={() => setHeldMessage({ type: 'voice', duration: msg.duration, isOutgoing: true, msgId: msg.id })}
                            reaction={reactions[msg.id]}
                            onRemoveReaction={() => removeReaction(msg.id)}
                          />
                        </>
                      ) : msg.type === 'images' ? (
                        <>
                          {msg.replyTo && (
                            <div className="bg-[#1f2937] rounded-[10px] px-3 py-2 border-l-2 border-white/30 max-w-[220px]">
                              <p className="text-white/60 text-[11px] font-medium leading-4">{msg.replyTo.senderName}</p>
                              <p className="text-white text-[11px] font-medium leading-4 truncate">{msg.replyTo.text}</p>
                            </div>
                          )}
                          <SentImageMessage
                            images={msg.urls}
                            onOpen={(imgs, idx) => setLightbox({ images: imgs, index: idx })}
                            onHold={() => setHeldMessage({ type: 'images', isOutgoing: true, msgId: msg.id })}
                            reaction={reactions[msg.id]}
                            onRemoveReaction={() => removeReaction(msg.id)}
                          />
                        </>
                      ) : (
                        <OutBubble
                          onHold={() => setHeldMessage({ type: 'text', text: msg.text, isOutgoing: true, msgId: msg.id })}
                          reaction={reactions[msg.id]}
                          onRemoveReaction={() => removeReaction(msg.id)}
                          replyTo={msg.replyTo}
                        >
                          {msg.text}
                        </OutBubble>
                      )}
                      <Ts time={msg.time} />
                    </div>
                  ))}
                </div>
              )
            } else {
              return (
                <div key={`ig-${groupIdx}`} className="flex items-end gap-2.5 msg-enter">
                  <UserAvatar />
                  <div className="flex flex-col gap-1.5">
                    {group.messages.map(msg => (
                      <InBubble
                        key={msg.id}
                        onHold={() => setHeldMessage({ type: 'text', text: msg.text, isOutgoing: false, msgId: msg.id })}
                        reaction={reactions[msg.id]}
                        onRemoveReaction={() => removeReaction(msg.id)}
                      >
                        {msg.text}
                      </InBubble>
                    ))}
                    <Ts time={group.messages[group.messages.length - 1].time} align="left" />
                  </div>
                </div>
              )
            }
          })}

          {isTyping && (
            <div className="msg-enter">
              <TypingIndicator />
            </div>
          )}

        </div>
      </div>

      <InputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        isRecording={isRecording}
        isPaused={isPaused}
        isPlayingBack={isPlayingBack}
        onToggleRecording={handleToggleRecording}
        onPauseResume={handlePauseResume}
        onPlayback={handlePlayback}
        onDeleteRecording={handleDeleteRecording}
        recordingTime={recordingTime}
        onImagePick={handleImagePick}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  )
}
