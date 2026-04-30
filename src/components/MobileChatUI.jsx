import { useRef, useEffect, useState } from 'react'
import './MobileChatUI.css'

const AVATAR = '/img/avatar.jpg'
const LANDSCAPE1 = '/img/landscape1.jpg'
const LANDSCAPE2 = '/img/landscape2.jpg'
const LANDSCAPE3 = '/img/landscape1.jpg'

// Waveform bar heights (from design)
const BARS = [8, 8, 24, 24, 14, 14, 10, 10, 8, 8, 12, 12, 24, 14, 24, 16, 16, 8]

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose, onChangeIndex }) {
  const touchStartX = useRef(0)
  const [dir, setDir] = useState('fade')

  const go = (next) => {
    setDir(next > index ? 'right' : 'left')
    onChangeIndex(next)
  }

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < 40) return
    if (delta < 0 && index < images.length - 1) go(index + 1)
    if (delta > 0 && index > 0)                 go(index - 1)
  }

  return (
    <div
      className="lightbox"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        key={index}
        src={images[index]}
        alt=""
        className={`lb-enter-${dir}`}
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
    <img src="/img/statusbar.svg" alt="" className="chat-statusbar" draggable={false} />
  )
}

// ─── Chat Header ─────────────────────────────────────────────────────────────

function ChatHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 backdrop-blur-xl bg-[rgba(6,8,11,0.4)] border-b border-white/10 flex flex-col items-center pb-6">
      <StatusBar />
      <div className="flex items-center justify-between w-full px-6 mt-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center text-white">
            <IconBack />
          </button>
          <div className="relative flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[8.5px] overflow-hidden bg-[#0b0e10] flex-shrink-0">
              <img src={AVATAR} alt="Sulaimon" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-7 w-3 h-3 rounded-full bg-[#22c55e] ring-2 ring-[#06080b]" />
            <div className="flex flex-col gap-0.5">
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
    <div className="w-8 h-8 rounded-[6.5px] overflow-hidden bg-[#0b0e10] flex-shrink-0">
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

function IncomingCluster1() {
  return (
    <div className="flex items-end gap-2.5">
      <UserAvatar />
      <div className="flex flex-col gap-1.5">
        <InBubble>Oh wow 😄</InBubble>
        <InBubble>
          Those pictures are so beautiful! Are you using AI tools for these too?
        </InBubble>
      </div>
    </div>
  )
}

function IncomingCluster2({ onOpen }) {
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

// Recording waveform bar data: 20 grey (8px) + 16 bright (varying heights)
const REC_GREY_COUNT = 20
const REC_BRIGHT_BARS = [12, 12, 12, 12, 24, 24, 14, 14, 24, 24, 16, 16, 16, 16, 8, 8]

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m} : ${String(s).padStart(2, '0')}`
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
          {BARS.map((h, i) => {
            const filled = isPlaying && i / BARS.length >= progress
            return (
              <div
                key={i}
                className={`w-[5px] rounded-[9.6px] bar-h-${h} voice-bar ${filled ? 'filled' : isPlaying ? 'unfilled' : ''}`}
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

// ─── Input Bar ───────────────────────────────────────────────────────────────

function InputBar({ value, onChange, onSend, isRecording, onToggleRecording, recordingTime }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const hasText = value.trim().length > 0

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-xl bg-[rgba(6,8,11,0.4)] border-t border-white/10 pt-6 flex flex-col items-center">
      <div className="flex items-center gap-3 w-full px-6">

        {isRecording ? (
          /* ── Recording mode ── */
          <>
            <div className="flex-1 bg-[#1f2937] rounded-full px-5 h-14 flex items-center gap-3 min-w-0">
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
                <path d="M1 1L8 5.5L1 10V1Z" fill="white" />
              </svg>
              <div className="rec-bars flex-1 flex items-center gap-[2.4px] min-w-0">
                {Array.from({ length: REC_GREY_COUNT }).map((_, i) => (
                  <div key={i} className="flex-1 bar-h-8 min-w-0 rounded-[9.6px] bg-[rgba(241,241,241,0.2)]" />
                ))}
                {REC_BRIGHT_BARS.map((h, i) => (
                  <div key={i} className={`rec-bar flex-1 bar-h-${h} min-w-0 rounded-[9.6px] bg-[#f1f1f1]`} />
                ))}
              </div>
              <span className="text-[rgba(255,255,255,0.5)] text-sm font-medium tracking-[-0.7px] whitespace-nowrap flex-shrink-0">
                {formatTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={onToggleRecording}
              className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center flex-shrink-0"
            >
              <IconNavigate />
            </button>
          </>
        ) : (
          /* ── Default mode ── */
          <>
            <div className="flex-1 bg-[#1f2937] rounded-full px-5 py-[18px] min-w-0">
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
                  <button className="bg-[#1f2937] rounded-full p-4 flex items-center justify-center">
                    <IconImage />
                  </button>
                </>
              )}
            </div>
          </>
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
  const scrollRef = useRef(null)
  const timerRef = useRef(null)
  const [inputValue,    setInputValue]    = useState('')
  const [sentMessages,  setSentMessages]  = useState([])
  const [isRecording,   setIsRecording]   = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [lightbox,      setLightbox]      = useState(null)

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }

  useEffect(() => { scrollToBottom() }, [])
  useEffect(() => { scrollToBottom() }, [sentMessages])
  useEffect(() => () => clearInterval(timerRef.current), [])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return
    setSentMessages(prev => [...prev, { type: 'text', text }])
    setInputValue('')
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      clearInterval(timerRef.current)
      setIsRecording(false)
      setSentMessages(prev => [...prev, { type: 'voice', duration: recordingTime }])
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
    }
  }

  return (
    <div className="relative w-[430px] h-[932px] bg-[#06080b] overflow-hidden rounded-[44px] shadow-2xl">
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onChangeIndex={(i) => setLightbox(lb => ({ ...lb, index: i }))}
        />
      )}
      <ChatHeader />

      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto scrollbar-hidden chat-scroll">
        <div className="flex flex-col gap-8 px-6 py-4">
          <StackedImages onOpen={(images, index) => setLightbox({ images, index })} />
          <IncomingCluster1 />
          <div className="flex justify-end">
            <OutBubble>
              Yeah! I've been playing around with it lately, it's actually super fun to use
            </OutBubble>
          </div>
          <IncomingCluster2 onOpen={(images, index) => setLightbox({ images, index })} />
          <VoiceMessage />
          <TypingIndicator />
          {sentMessages.map((msg, i) =>
            msg.type === 'voice' ? (
              <SentVoiceBubble key={i} duration={msg.duration} />
            ) : (
              <div key={i} className="flex justify-end">
                <OutBubble>{msg.text}</OutBubble>
              </div>
            )
          )}
        </div>
      </div>

      <InputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        isRecording={isRecording}
        onToggleRecording={handleToggleRecording}
        recordingTime={recordingTime}
      />
    </div>
  )
}
