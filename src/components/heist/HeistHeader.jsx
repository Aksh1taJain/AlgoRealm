import { motion } from 'framer-motion'
import { ShieldAlert, Clock, Wifi } from 'lucide-react'
import styles from './HeistHeader.module.css'

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const STAGE_LABELS = {
  CODE: 'CODING PHASE',
  TESTING: 'TEST EXECUTION',
  ANALYSIS: 'COMPLEXITY REVIEW',
  BREACH: 'FORTRESS BREACHED',
  VETOED: 'SOLUTION VETOED',
}

const DIFF_COLOR = { HARD: '#ff3366', EXTREME: '#a855f7', MEDIUM: '#ff9500', EASY: '#00ff88' }

export default function HeistHeader({ mission, missionStage, missionTimer, fortressHealth }) {
  const stageLabel = STAGE_LABELS[missionStage] || 'STANDBY'
  const healthColor = fortressHealth > 60 ? '#ff3366' : fortressHealth > 30 ? '#ff9500' : '#00ff88'
  const isBreached = fortressHealth === 0
  const isVetoed = missionStage === 'VETOED'

  return (
    <header className={styles.header}>
      {/* Left: mission info */}
      <div className={styles.missionInfo}>
        <div className={styles.opLabel}>
          <span className={styles.opDot} />
          ACTIVE OPERATION
        </div>
        <h1 className={styles.missionName}>{mission.name}</h1>
        <p className={styles.objective}>{mission.description}</p>
      </div>

      {/* Center: stage indicator */}
      <div className={styles.stageBlock}>
        <div className={`${styles.stagePill} ${styles[`stage_${missionStage}`]}`}>
          {isVetoed
            ? <span className={styles.vetoIcon}>✕</span>
            : <span className={styles.stagePulse} />
          }
          {stageLabel}
        </div>
        <div
          className={styles.diffTag}
          style={{ color: DIFF_COLOR[mission.difficulty] || '#ff9500' }}
        >
          {mission.difficulty}
        </div>
      </div>

      {/* Right: fortress health + timer */}
      <div className={styles.statsBlock}>
        {/* Timer */}
        <div className={styles.timerBlock}>
          <Clock size={12} className={styles.timerIcon} />
          <span className={`${styles.timerValue} ${missionTimer < 300 ? styles.timerCritical : ''}`}>
            {formatTimer(missionTimer)}
          </span>
        </div>

        {/* Fortress health */}
        <div className={styles.fortressBlock}>
          <div className={styles.fortressLabel}>
            <ShieldAlert size={11} style={{ color: healthColor }} />
            <span>FORTRESS INTEGRITY</span>
            <span style={{ color: healthColor, marginLeft: 'auto' }}>
              {isBreached ? 'BREACHED' : `${fortressHealth}%`}
            </span>
          </div>
          <div className={styles.healthTrack}>
            <motion.div
              className={styles.healthFill}
              style={{ background: `linear-gradient(90deg, ${healthColor}99, ${healthColor})` }}
              animate={{ width: `${fortressHealth}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Damage notches */}
            {[25, 50, 75].map(n => (
              <div key={n} className={styles.healthNotch} style={{ left: `${n}%` }} />
            ))}
          </div>
        </div>

        {/* Live indicator */}
        <div className={styles.liveTag}>
          <Wifi size={10} />
          <span>LIVE</span>
          {/* TODO: Replace with real WebSocket connection status */}
        </div>
      </div>
    </header>
  )
}
