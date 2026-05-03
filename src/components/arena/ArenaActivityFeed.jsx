import { motion, AnimatePresence } from 'framer-motion'
import styles from './ArenaActivityFeed.module.css'

const TYPE_ICONS = {
  system:    '⬡',
  match:     '⚡',
  problem:   '◎',
  solver:    '⌨',
  corruptor: '⚔',
  referee:   '🤖',
  timer:     '⏱',
  chat:      '💬',
}

export default function ArenaActivityFeed({ log }) {
  return (
    <div className={styles.feed}>
      <div className={styles.label}>BATTLE LOG</div>
      <div className={styles.list}>
        <AnimatePresence initial={false}>
          {log.slice(0, 12).map(entry => (
            <motion.div
              key={entry.id}
              className={styles.entry}
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.entryBar} style={{ background: entry.color }} />
              <span className={styles.entryIcon} style={{ color: entry.color }}>
                {TYPE_ICONS[entry.type] || '·'}
              </span>
              <span className={styles.entryText}>{entry.text}</span>
              <span className={styles.entryTs}>{entry.ts}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
