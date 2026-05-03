// ─── RefereePanel ─────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import styles from './RefereePanel.module.css'

export default function RefereePanel({ decision, round, isLoading }) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.header}>
        <div className={styles.aiIcon}>🤖</div>
        <div>
          <div className={styles.title}>AI REFEREE — ROUND {round}</div>
          <div className={styles.sub}>NIM Model Judgement</div>
        </div>
        {/* TODO: Replace mock AI referee with NIM/Gemini/LLM judge endpoint */}
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span /><span /><span />
          </div>
          <div className={styles.loadingText}>Analyzing submissions…</div>
        </div>
      ) : decision ? (
        <div className={styles.verdicts}>
          <div className={styles.verdictRow}>
            <Verdict label="Valid Attack?" value={decision.corruptorTestValidity} />
            <Verdict label="Weakness Found?" value={decision.weaknessFound ? 'YES' : 'NO'} isWarning={decision.weaknessFound} />
            <Verdict label="Solver Robust?" value={decision.solverRobustness >= 70 ? 'PASSED' : 'VULNERABLE'} isWarning={decision.solverRobustness < 70} />
          </div>

          <div className={styles.robustScore}>
            <div className={styles.robustLabel}>ROBUSTNESS SCORE</div>
            <div className={styles.robustBar}>
              <motion.div
                className={styles.robustFill}
                style={{
                  background: decision.solverRobustness >= 70 ? 'linear-gradient(90deg,#00f5ff,#00ff88)' : 'linear-gradient(90deg,#ff9500,#ff3366)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${decision.solverRobustness}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className={styles.robustVal}>{decision.solverRobustness}/100</div>
          </div>

          <div className={styles.explanation}>{decision.explanation}</div>

          <div
            className={styles.roundWinner}
            style={{
              color: decision.roundWinner === 'SOLVER' ? '#00f5ff' : '#ff3366',
              borderColor: decision.roundWinner === 'SOLVER' ? 'rgba(0,245,255,0.2)' : 'rgba(255,51,102,0.2)',
              background: decision.roundWinner === 'SOLVER' ? 'rgba(0,245,255,0.05)' : 'rgba(255,51,102,0.05)',
            }}
          >
            ROUND {round} WINNER: {decision.roundWinner}
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}

function Verdict({ label, value, isWarning }) {
  const color = isWarning ? '#ff9500' : value === 'YES' || value === 'PASSED' || value === 'VALID' ? '#00ff88' : '#ff3366'
  return (
    <div className={styles.verdict}>
      <div className={styles.verdictLabel}>{label}</div>
      <div className={styles.verdictVal} style={{ color }}>{value}</div>
    </div>
  )
}
