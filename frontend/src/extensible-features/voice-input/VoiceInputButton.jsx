import { useEffect, useMemo, useRef, useState } from 'react'

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export default function VoiceInputButton({
  disabled = false,
  onText,
  onError,
}) {
  const Rec = useMemo(() => getSpeechRecognition(), [])
  const recRef = useRef(null)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop?.()
      } catch {
        // ignore
      }
    }
  }, [])

  const supported = !!Rec

  const start = () => {
    if (!supported) {
      onError?.('Voice input is not supported in this browser.')
      return
    }
    if (disabled) return

    try {
      const rec = new Rec()
      rec.lang = 'en-US'
      rec.interimResults = true
      rec.continuous = true

      rec.onstart = () => setListening(true)
      rec.onend = () => setListening(false)
      rec.onerror = (e) => {
        const msg =
          e?.error === 'not-allowed'
            ? 'Microphone permission denied. Please allow microphone access in your browser settings.'
            : e?.error === 'no-speech'
              ? 'No speech detected. Try again.'
              : 'Microphone error. Please try again.'
        onError?.(msg)
      }
      rec.onresult = (event) => {
        let finalText = ''
        let interimText = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i]
          const t = res?.[0]?.transcript || ''
          if (res.isFinal) finalText += t
          else interimText += t
        }
        const text = (finalText || interimText || '').trim()
        if (text) onText?.(text, { isFinal: !!finalText })
      }

      recRef.current = rec
      rec.start()
    } catch {
      onError?.('Unable to start microphone. Please check browser permissions.')
    }
  }

  const stop = () => {
    try {
      recRef.current?.stop?.()
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      className={`mic-btn ${listening ? 'on' : ''}`}
      disabled={disabled}
      onClick={() => (listening ? stop() : start())}
      aria-label={listening ? 'Stop microphone' : 'Start microphone'}
      title={supported ? (listening ? 'Stop' : 'Start') : 'Not supported'}
    >
      <span className="mic-ico" aria-hidden="true">
        {listening ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 11a7 7 0 01-14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="mic-lbl">{listening ? 'Stop' : 'Mic'}</span>
    </button>
  )
}

