import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Star } from 'lucide-react'
import styles from './RewardPopup.module.css'

export default function RewardPopup({ data, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0, y: 80, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      >
        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: (Math.cos((i / 8) * Math.PI * 2) * 80),
              y: (Math.sin((i / 8) * Math.PI * 2) * 80) - 20,
            }}
            transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)',
              pointerEvents: 'none',
            }}
          />
        ))}

        <button className={styles.close} onClick={onClose}><X size={14} /></button>

        <div className={styles.iconWrap}>
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className={styles.iconCircle}
          >
            <Star size={28} className={styles.starIcon} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.title}>{data.title || 'MISSION COMPLETE'}</div>
          <div className={styles.subtitle}>{data.subtitle || 'Rewards have been credited'}</div>
        </motion.div>

        <motion.div
          className={styles.rewards}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {data.xp && (
            <div className={styles.rewardChip} style={{ '--c': 'var(--cyan)' }}>
              <Zap size={12} />
              <span>+{data.xp} XP</span>
            </div>
          )}
          {data.coins && (
            <div className={styles.rewardChip} style={{ '--c': '#ff9500' }}>
              <span>◈</span>
              <span>+{data.coins}</span>
            </div>
          )}
          {data.fragments && (
            <div className={styles.rewardChip} style={{ '--c': 'var(--purple)' }}>
              <span>⬡</span>
              <span>+{data.fragments}</span>
            </div>
          )}
        </motion.div>

        {/* Progress bar (auto-close timer) */}
        <motion.div
          className={styles.timerBar}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
