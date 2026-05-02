import { motion, AnimatePresence } from 'framer-motion'
import styles from './ActivityFeed.module.css'

export default function ActivityFeed({ log }) {
  return (
    <div className={styles.feed}>
      <div className={styles.label}>ACTIVITY FEED</div>
      <div className={styles.list}>
        <AnimatePresence initial={false}>
          {log.slice(0, 8).map((entry) => (
            <motion.div
              key={entry.id}
              className={styles.entry}
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={styles.entryBar}
                style={{ background: entry.color }}
              />
              <div className={styles.entryContent}>
                <span className={styles.entryUser} style={{ color: entry.color }}>
                  {entry.user}
                </span>
                {entry.role !== 'SYSTEM' && (
                  <span className={styles.entryRole}>[{entry.role}]</span>
                )}
                <span className={styles.entryAction}>{entry.action}</span>
              </div>
              <div className={styles.entryTs}>{entry.ts}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
