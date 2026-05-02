import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './TeamChat.module.css'

export default function TeamChat({ messages, teamPresence, currentUserRole, onSend }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input.trim())
    // TODO: Replace with WebSocket event: socket.emit('chat:message', { text: input })
    setInput('')
  }

  const currentMember = teamPresence.find(m => m.role === currentUserRole)

  return (
    <div className={styles.chat}>
      {/* Presence bar */}
      <div className={styles.presenceBar}>
        {teamPresence.map(m => (
          <div key={m.id} className={`${styles.presenceChip} ${m.online ? '' : styles.offline}`}>
            <div
              className={styles.presenceDot}
              style={{ background: m.online ? m.color : '#4a5275', boxShadow: m.online ? `0 0 5px ${m.color}` : 'none' }}
            />
            <span style={{ color: m.online ? m.color : 'var(--text-muted)' }}>{m.name.split('_')[0]}</span>
            <span className={styles.presenceRole}>{m.role}</span>
          </div>
        ))}
        {/* TODO: Replace presence list with WebSocket teamPresence event */}
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        <AnimatePresence initial={false}>
          {messages.map(msg => {
            const isYou = msg.role === currentUserRole
            return (
              <motion.div
                key={msg.id}
                className={`${styles.message} ${isYou ? styles.msgYou : ''}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {!isYou && (
                  <div className={styles.msgMeta}>
                    <span className={styles.msgUser} style={{ color: msg.color }}>{msg.user}</span>
                    <span className={styles.msgRole}>[{msg.role}]</span>
                    <span className={styles.msgTs}>{msg.ts}</span>
                  </div>
                )}
                <div
                  className={styles.msgBubble}
                  style={isYou
                    ? { borderColor: `${currentMember?.color}40`, background: `${currentMember?.color}08` }
                    : {}
                  }
                >
                  {msg.text}
                </div>
                {isYou && <div className={styles.msgTs} style={{ textAlign: 'right' }}>{msg.ts}</div>}
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputRow}>
        <div
          className={styles.inputAvatar}
          style={{ borderColor: currentMember?.color, color: currentMember?.color }}
        >
          {currentMember?.name?.[0] || '?'}
        </div>
        <input
          className={styles.input}
          placeholder={`Message as ${currentUserRole}…`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          maxLength={200}
        />
        <button
          className={`${styles.sendBtn} ${!input.trim() ? styles.sendBtnDisabled : ''}`}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  )
}
