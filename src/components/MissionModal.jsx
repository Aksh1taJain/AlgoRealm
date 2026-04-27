import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Zap, Star, Lock, PlayCircle, CheckCircle2 } from 'lucide-react'
import styles from './MissionModal.module.css'

const DIFFICULTY_CONFIG = {
  EASY:    { color: '#00ff88', label: 'EASY' },
  MEDIUM:  { color: '#ff9500', label: 'MEDIUM' },
  HARD:    { color: '#ff3366', label: 'HARD' },
  EXTREME: { color: '#a855f7', label: 'EXTREME' },
}

export default function MissionModal({ quest, onClose, onStart }) {
  if (!quest) return null
  const diff = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.MEDIUM

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          style={{ '--diff-color': diff.color }}
        >
          {/* Corner decorations */}
          <div className={`${styles.corner} ${styles.tl}`} />
          <div className={`${styles.corner} ${styles.tr}`} />
          <div className={`${styles.corner} ${styles.bl}`} />
          <div className={`${styles.corner} ${styles.br}`} />

          {/* Close */}
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.questType}>{quest.type.replace('_', ' ')}</div>
            <div className={styles.diffBadge} style={{ color: diff.color, borderColor: `${diff.color}40` }}>
              {diff.label}
            </div>
          </div>

          <h2 className={styles.title}>{quest.title}</h2>
          <p className={styles.description}>{quest.description}</p>

          {/* Tags */}
          <div className={styles.tags}>
            {quest.tags.map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <Clock size={14} style={{ color: 'var(--cyan)' }} />
              <span className={styles.statLabel}>TIME LIMIT</span>
              <span className={styles.statValue}>{quest.timeLimit}</span>
            </div>
            <div className={styles.statItem}>
              <Star size={14} style={{ color: '#ff9500' }} />
              <span className={styles.statLabel}>COMPLETION</span>
              <span className={styles.statValue}>{quest.completionRate}%</span>
            </div>
            <div className={styles.statItem}>
              <Zap size={14} style={{ color: '#a855f7' }} />
              <span className={styles.statLabel}>ATTEMPTS</span>
              <span className={styles.statValue}>{quest.attempts.toLocaleString()}</span>
            </div>
          </div>

          {/* Rewards */}
          <div className={styles.rewardsSection}>
            <div className={styles.rewardLabel}>COMPLETION REWARDS</div>
            <div className={styles.rewardsList}>
              <div className={styles.rewardItem} style={{ '--r-color': '#00f5ff' }}>
                <span className={styles.rewardIcon}>⚡</span>
                <span className={styles.rewardVal}>+{quest.xpReward} XP</span>
              </div>
              <div className={styles.rewardItem} style={{ '--r-color': '#ff9500' }}>
                <span className={styles.rewardIcon}>◈</span>
                <span className={styles.rewardVal}>+{quest.coinReward} COINS</span>
              </div>
              <div className={styles.rewardItem} style={{ '--r-color': '#a855f7' }}>
                <span className={styles.rewardIcon}>⬡</span>
                <span className={styles.rewardVal}>+{quest.fragmentReward} FRAGS</span>
              </div>
            </div>
          </div>

          {/* Zone */}
          <div className={styles.zoneBadge}>
            <span className={styles.zoneLabel}>ZONE</span>
            <span className={styles.zoneName}>{quest.worldZone?.replace('_', ' ')}</span>
          </div>

          {/* CTA */}
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>CANCEL</button>
            {quest.completed ? (
              <button className={styles.completedBtn} disabled>
                <CheckCircle2 size={16} />
                COMPLETED
              </button>
            ) : quest.locked ? (
              <button className={styles.lockedBtn} disabled>
                <Lock size={16} />
                LOCKED
              </button>
            ) : (
              <button className={styles.startBtn} onClick={() => onStart?.(quest)}>
                <PlayCircle size={16} />
                INITIATE QUEST
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
