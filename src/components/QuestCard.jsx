import { motion } from 'framer-motion'
import { Lock, Clock, Users, Zap, ChevronRight, CheckCircle2 } from 'lucide-react'
import styles from './QuestCard.module.css'

const DIFFICULTY_CONFIG = {
  EASY: { color: '#00ff88', label: 'EASY' },
  MEDIUM: { color: '#ff9500', label: 'MED' },
  HARD: { color: '#ff3366', label: 'HARD' },
  EXTREME: { color: '#a855f7', label: 'XTRM' },
}

const TYPE_CONFIG = {
  ALGORITHM: { color: '#00f5ff', symbol: '⟳' },
  DATA_STRUCTURE: { color: '#a855f7', symbol: '◈' },
  GRAPH: { color: '#00ff88', symbol: '⬡' },
  RECURSION: { color: '#f0abfc', symbol: '∞' },
  ADVANCED: { color: '#ff9500', symbol: '◉' },
}

export default function QuestCard({ quest, onClick, compact = false }) {
  const diff = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.MEDIUM
  const type = TYPE_CONFIG[quest.type] || TYPE_CONFIG.ALGORITHM

  return (
    <motion.div
      className={`${styles.card} ${quest.locked ? styles.locked : ''} ${quest.completed ? styles.completed : ''} ${compact ? styles.compact : ''}`}
      whileHover={!quest.locked ? { y: -3, scale: 1.01 } : {}}
      whileTap={!quest.locked ? { scale: 0.99 } : {}}
      onClick={() => !quest.locked && onClick?.(quest)}
      style={{ '--diff-color': diff.color, '--type-color': type.color }}
    >
      {/* Glow line */}
      <div className={styles.topLine} />

      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.typeTag}>
          <span style={{ color: type.color }}>{type.symbol}</span>
          <span>{quest.type.replace('_', ' ')}</span>
        </div>
        <div className={styles.diffTag} style={{ color: diff.color, borderColor: `${diff.color}30` }}>
          {diff.label}
        </div>
      </div>

      {/* Title */}
      <div className={styles.titleRow}>
        {quest.locked && <Lock size={14} className={styles.lockIcon} />}
        {quest.completed && <CheckCircle2 size={14} className={styles.checkIcon} />}
        <h3 className={styles.title}>{quest.title}</h3>
      </div>

      {!compact && (
        <p className={styles.description}>{quest.description}</p>
      )}

      {/* Tags */}
      {!compact && (
        <div className={styles.tags}>
          {quest.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.stat}>
            <Clock size={11} />
            <span>{quest.timeLimit}</span>
          </div>
          <div className={styles.stat}>
            <Users size={11} />
            <span>{(quest.attempts / 1000).toFixed(1)}k</span>
          </div>
          <div className={styles.stat}>
            <span style={{ color: '#00ff88' }}>↑{quest.completionRate}%</span>
          </div>
        </div>

        <div className={styles.rewards}>
          <span className={styles.reward} style={{ color: '#00f5ff' }}>+{quest.xpReward} XP</span>
          <span className={styles.reward} style={{ color: '#a855f7' }}>+{quest.fragmentReward} ⬡</span>
        </div>
      </div>

      {/* Hover arrow */}
      {!quest.locked && (
        <div className={styles.arrow}>
          <ChevronRight size={16} />
        </div>
      )}

      {/* Locked overlay */}
      {quest.locked && (
        <div className={styles.lockOverlay}>
          <Lock size={24} />
          <span>LOCKED</span>
        </div>
      )}
    </motion.div>
  )
}
