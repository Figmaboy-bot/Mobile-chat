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

// ─── Status Bar ──────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div className="h-16 w-full flex items-end px-3 pb-1">
      {/* Time */}
      <div className="flex-1 flex items-center pl-1">
        <span className="text-white text-[17px] font-semibold tracking-[-0.32px] leading-none">9:41</span>
      </div>
      {/* Dynamic Island */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="bg-black w-[120px] h-[34px] rounded-full" />
      </div>
      {/* Status icons */}
      <div className="flex-1 flex items-center justify-end gap-[6px] pr-1">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.8" fill="white"/>
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill="white"/>
          <rect x="9" y="3" width="3" height="9" rx="0.8" fill="white"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="white"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 3C10.2 3 12.2 3.9 13.6 5.4L15 4C13.2 2.1 10.7 1 8 1C5.3 1 2.8 2.1 1 4L2.4 5.4C3.8 3.9 5.8 3 8 3Z" fill="white"/>
          <path d="M8 6C9.5 6 10.8 6.6 11.8 7.6L13.2 6.2C11.8 4.8 9.9 4 8 4C6.1 4 4.2 4.8 2.8 6.2L4.2 7.6C5.2 6.6 6.5 6 8 6Z" fill="white"/>
          <circle cx="8" cy="11" r="1.5" fill="white"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
          <path d="M23 4.5v3a1.5 1.5 0 000-3z" fill="white" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  )
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

// ─── Message Bubbles ─────────────────────────────────────────────────────────

function OutBubble({ children }) {
  return (
    <div className="chat-bubble bg-[#f1f1f1] rounded-[16px] px-3 py-2 flex-shrink-0">
      <p className="text-[#06080b] text-base font-medium leading-5 tracking-[-0.7px]">
        {children}
      </p>
    </div>
  )
}

function InBubble({ children }) {
  return (
    <div className="chat-bubble bg-[#1f2937] rounded-[16px] px-3 py-2 flex-shrink-0">
      <p className="text-white text-base font-medium leading-5 tracking-[-0.7px]">
        {children}
      </p>
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

// ─── Specific Messages ───────────────────────────────────────────────────────

function StackedImages({ onOpen }) {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="stacked-images relative h-[240px] w-[260px]">
        <div className="chat-img-back cursor-pointer" onClick={() => onOpen([LANDSCAPE1, LANDSCAPE2], 0)}>
          <img src={LANDSCAPE1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="chat-img-front cursor-pointer" onClick={() => onOpen([LANDSCAPE1, LANDSCAPE2], 1)}>
          <img src={LANDSCAPE2} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <OutBubble>Check this out  🔥🔥</OutBubble>
    </div>
  )
}

function IncomingCluster1({ time }) {
  return (
    <div className="flex items-end gap-2.5">
      <UserAvatar />
      <div className="flex flex-col gap-1.5">
        <InBubble>Oh wow 😄</InBubble>
        <InBubble>
          Those pictures are so beautiful! Are you using AI tools for these too?
        </InBubble>
        {time && <Ts time={time} align="left" />}
      </div>
    </div>
  )
}

function IncomingCluster2({ onOpen, time }) {
  return (
    <div className="flex items-end gap-2.5">
      <UserAvatar />
      <div className="flex flex-col gap-1.5">
        <InBubble>Wait I'll show you something</InBubble>
        <InBubble>
          I generated this yesterday when I couldn't sleep 😅
        </InBubble>
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

function VoiceMessage() {
  return <VoiceBubble duration={20} />
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

function VoiceBubble({ duration }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(0)

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
      <div className="bg-[#f1f1f1] rounded-[16px] px-3 py-2 flex items-center gap-2 flex-shrink-0">
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
      {isPlaying && (
        <button
          onClick={handleCycleSpeed}
          className="bg-[#f1f1f1] rounded-[16px] px-3 py-1.5 flex-shrink-0"
        >
          <span className="text-[rgba(6,8,11,0.6)] text-base font-medium tracking-[-0.7px]">{speedLabel}</span>
        </button>
      )}
    </div>
  )
}

function SentVoiceBubble({ duration }) {
  return <VoiceBubble duration={duration} />
}

// ─── Sent image message ───────────────────────────────────────────────────────

const SPREAD_TOTAL_W = 340
const SPREAD_GAP     = 8

function SentImageMessage({ images, onOpen }) {
  const [hovered, setHovered] = useState(false)
  const n = images.length

  if (n === 1) {
    return (
      <div
        className="w-[164px] h-[200px] rounded-[20px] overflow-hidden cursor-pointer flex-shrink-0"
        onClick={() => onOpen(images, 0)}
      >
        <img src={images[0]} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }

  // ── Spread (hover) geometry ──
  const sImgW = Math.floor((SPREAD_TOTAL_W - (n - 1) * SPREAD_GAP) / n)
  const sImgH = Math.round(sImgW * 200 / 164)
  const sW    = sImgW * n + SPREAD_GAP * (n - 1)
  const sH    = sImgH + 20

  // ── Stack (default) geometry ──
  const stackW = 260
  const stackH = 240

  // Position per image in stacked state
  const stackPos = (i) => {
    if (i === 0)            return { transform: 'rotate(-17.5deg)', top: 20, left: 12,  width: 164, height: 200 }
    if (i === 1 && n >= 3)  return { transform: 'rotate(-8deg)',    top: 16, left: 48,  width: 164, height: 200 }
    return                         { transform: 'rotate(0deg)',     top: 20, left: 96,  width: 164, height: 200 }
  }

  // Position per image in spread state
  const spreadPos = (i) => ({
    transform: 'rotate(0deg)',
    top:   10,
    left:  i * (sImgW + SPREAD_GAP),
    width:  sImgW,
    height: sImgH,
  })

  // Z-index in stacked state
  const stackZ = (i) => {
    if (i === 0) return 1
    if (i === 1 && n >= 3) return 2
    if (i === (n <= 2 ? 1 : 2)) return 3   // visible front card
    return 2                                 // extras hidden behind front
  }

  const frontIdx = n <= 2 ? 1 : 2
  const extras   = n - 3  // cards hidden behind the front in stack view

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width:  hovered ? sW : stackW,
        height: hovered ? sH : stackH,
        transition: 'width 0.4s cubic-bezier(0.25,0.46,0.45,0.94), height 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {images.map((url, i) => (
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
          {/* "+N" badge on front card when extras are hidden in stack */}
          {!hovered && i === frontIdx && extras > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">+{extras}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Input Bar ───────────────────────────────────────────────────────────────

function InputBar({ value, onChange, onSend, isRecording, isPaused, onToggleRecording, onPauseResume, onDeleteRecording, recordingTime, onImagePick }) {
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
      <div className="w-full px-6">

        {isRecording ? (
          /* ── Recording mode: pill on top, action buttons below ── */
          <div className="flex flex-col gap-5">

            {/* Waveform pill */}
            <div className="bg-[#1f2937] rounded-full px-5 h-14 flex items-center gap-3">
              {isPaused && (
                <button
                  onClick={onPauseResume}
                  className="flex-shrink-0 flex items-center justify-center w-3"
                >
                  <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                    <path d="M1 1.5l8 5-8 5v-10z" fill="white"/>
                  </svg>
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
            <div className="flex items-center justify-between">
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
                  className="bg-white rounded-full p-4 flex items-center justify-center"
                >
                  <IconSend />
                </button>
              ) : (
                <>
                  <button
                    onClick={onToggleRecording}
                    className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center"
                  >
                    <IconMic />
                  </button>
                  <button
                    onClick={onImagePick}
                    className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center"
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

export default function MobileChatUI() {
  const scrollRef   = useRef(null)
  const timerRef    = useRef(null)
  const fileInputRef = useRef(null)
  const [inputValue,      setInputValue]      = useState('')
  const [sentMessages,    setSentMessages]    = useState([])
  const [isRecording,     setIsRecording]     = useState(false)
  const [isPaused,        setIsPaused]        = useState(false)
  const [recordingTime,   setRecordingTime]   = useState(0)
  const [lightbox,        setLightbox]        = useState(null)
  const [pendingImages,   setPendingImages]   = useState(null)

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }

  useEffect(() => { scrollToBottom() }, [])
  useEffect(() => { scrollToBottom() }, [sentMessages])
  useEffect(() => () => clearInterval(timerRef.current), [])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    setSentMessages(prev => [...prev, { type: 'text', text, time: nowTime() }])
    setInputValue('')
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      clearInterval(timerRef.current)
      setIsRecording(false)
      setIsPaused(false)
      setSentMessages(prev => [...prev, { type: 'voice', duration: recordingTime, time: nowTime() }])
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    }
  }

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
      setIsPaused(true)
    }
  }

  const handleDeleteRecording = () => {
    clearInterval(timerRef.current)
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const handleImagePick = () => fileInputRef.current?.click()

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setPendingImages(files.map(f => URL.createObjectURL(f)))
    e.target.value = ''
  }

  const handleConfirmImages = () => {
    setSentMessages(prev => [...prev, { type: 'images', urls: pendingImages, time: nowTime() }])
    setPendingImages(null)
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

  return (
    <div className="relative w-[430px] h-[932px] bg-[#06080b] overflow-hidden rounded-[44px] shadow-2xl">

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

      {/* Image confirmation sheet */}
      {pendingImages && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={handleCancelImages} />
          <div className="relative bg-[#0f1318] rounded-t-[32px] px-6 pt-6 pb-10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-base tracking-[-0.5px]">
                {pendingImages.length} photo{pendingImages.length > 1 ? 's' : ''} selected
              </span>
              <button onClick={handleCancelImages} className="text-white/50 text-sm font-medium">Cancel</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hidden">
              {pendingImages.map((url, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-[14px] overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -top-2 -right-2 w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1L1 9" stroke="#06080b" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
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
        <div className="flex flex-col gap-6 px-6 py-4">

          {/* outgoing */}
          <div className="flex flex-col items-end gap-1">
            <StackedImages onOpen={(images, index) => setLightbox({ images, index })} />
            <Ts time="12:28" />
          </div>

          {/* incoming */}
          <IncomingCluster1 time="12:29" />

          {/* outgoing */}
          <div className="flex flex-col items-end gap-1">
            <OutBubble>Yeah! I've been playing around with it lately, it's actually super fun to use</OutBubble>
            <Ts time="12:29" />
          </div>

          {/* incoming */}
          <IncomingCluster2 onOpen={(images, index) => setLightbox({ images, index })} time="12:31" />

          {/* outgoing voice */}
          <div className="flex flex-col items-end gap-1">
            <VoiceMessage />
            <Ts time="12:31" />
          </div>

          <TypingIndicator />

          {/* sent messages — small gap between consecutive same-sender messages */}
          {sentMessages.length > 0 && (
            <div className="flex flex-col gap-2">
              {sentMessages.map((msg, i) => (
                <div key={i} className="flex flex-col items-end gap-1">
                  {msg.type === 'voice' ? (
                    <SentVoiceBubble duration={msg.duration} />
                  ) : msg.type === 'images' ? (
                    <SentImageMessage
                      images={msg.urls}
                      onOpen={(imgs, idx) => setLightbox({ images: imgs, index: idx })}
                    />
                  ) : (
                    <OutBubble>{msg.text}</OutBubble>
                  )}
                  <Ts time={msg.time} />
                </div>
              ))}
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
        onToggleRecording={handleToggleRecording}
        onPauseResume={handlePauseResume}
        onDeleteRecording={handleDeleteRecording}
        recordingTime={recordingTime}
        onImagePick={handleImagePick}
      />
    </div>
  )
}
