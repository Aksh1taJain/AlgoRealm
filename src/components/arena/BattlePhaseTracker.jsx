import { motion } from 'framer-motion'
import { CheckCircle2, Lock } from 'lucide-react'
import styles from './BattlePhaseTracker.module.css'

const PHASES = [
  { id: 'match',    label: 'MATCH FOUND'    },
  { id: 'problem',  label: 'PROBLEM REVEAL' },
  { id: 'solver',   label: 'SOLVER CODING'  },
  { id: 'corrupt',  label: 'CORRUPTOR ATK'  },
  { id: 'judge',    label: 'AI REFEREE'     },
  { id: 'switch',   label: 'ROLE SWITCH'    },
  { id: 'result',   label: 'FINAL RESULT'   },
]

function getPhaseStatus(phaseId, battleStatus, currentRound) {
  const statusOrder = {
    active:      ['match','problem','solver'],
    judging:     ['match','problem','solver','corrupt','judge'],
    'role-switch':['match','problem','solver','corrupt','judge','switch'],
    round2:      ['match','problem','solver','corrupt','judge','switch','solver'],
    completed:   ['match','problem','solver','corrupt','judge','switch','result'],
  }

  const phaseOrder = PHASES.map(p => p.id)

  // Determine active phase index
  const activePhaseMap = {
    active:        2, // solver coding
    judging:       4, // judge
    'role-switch': 5,
    round2:        currentRound === 2 ? 3 : 2,
    completed:     6,
  }

  const activeIdx = activePhaseMap[battleStatus] ?? 0
  const thisIdx   = phaseOrder.indexOf(phaseId)

  if (thisIdx < activeIdx) return 'completed'
  if (thisIdx === activeIdx) return 'active'
  return 'locked'
}

export default function BattlePhaseTracker({ battleStatus, currentRound }) {
  return (
    <div className={styles.tracker}>
      <div className={styles.label}>BATTLE PHASES</div>
      <div className={styles.track}>
        {PHASES.map((phase, i) => {
          const status = getPhaseStatus(phase.id, battleStatus, currentRound)
          return (
            <div key={phase.id} className={styles.phaseItem}>
              <motion.div
                className={`${styles.node} ${styles[`node_${status}`]}`}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                {status === 'completed' ? <CheckCircle2 size={11} /> :
                 status === 'locked'    ? <Lock size={9} /> :
                 <span className={styles.activePulse} />}
              </motion.div>
              <div className={`${styles.phaseLabel} ${styles[`label_${status}`]}`}>
                {phase.label}
              </div>
              {i < PHASES.length - 1 && (
                <div className={styles.connector}>
                  {status === 'completed' && (
                    <motion.div
                      className={styles.connectorFill}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
