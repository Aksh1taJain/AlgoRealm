import { motion } from 'framer-motion'
import styles from './RoundSwitchPanel.module.css'

export default function RoundSwitchPanel({ players, round1Decision, onContinue }) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.icon}>⚡</div>
      <div className={styles.title}>ROLES SWITCHING</div>
      <div className={styles.sub}>Round 2 Begins — Fight Back</div>

      <div className={styles.switchRow}>
        <div className={styles.switchCard}>
          <div className={styles.swName}>{players.self.name}</div>
          <div className={styles.swOld} style={{ color: '#00f5ff' }}>SOLVER →</div>
          <div className={styles.swNew} style={{ color: '#ff3366' }}>CORRUPTOR</div>
        </div>

        <div className={styles.swVs}>⇄</div>

        <div className={styles.switchCard}>
          <div className={styles.swName}>{players.opp.name}</div>
          <div className={styles.swOld} style={{ color: '#ff3366' }}>CORRUPTOR →</div>
          <div className={styles.swNew} style={{ color: '#00f5ff' }}>SOLVER</div>
        </div>
      </div>

      {round1Decision && (
        <div className={styles.r1Summary}>
          Round 1 result: <strong style={{ color: round1Decision.roundWinner === 'SOLVER' ? '#00f5ff' : '#ff3366' }}>
            {round1Decision.roundWinner} wins
          </strong>
        </div>
      )}

      <button className={styles.continueBtn} onClick={onContinue}>
        START ROUND 2 — I'M THE CORRUPTOR
      </button>
      {/* TODO: Replace with Socket.IO event: socket.emit('round:ready', { roomId, round: 2 }) */}
    </motion.div>
  )
}
