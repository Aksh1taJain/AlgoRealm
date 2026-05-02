import { motion } from 'framer-motion'
import { CheckCircle2, Lock, AlertTriangle, Zap } from 'lucide-react'
import styles from './HeistPipeline.module.css'

const STAGES = [
  { id: 'CODE',     label: 'CODE',     icon: '⌨', desc: 'Write solution'     },
  { id: 'TESTING',  label: 'TEST',     icon: '⚡', desc: 'Run test suite'      },
  { id: 'ANALYSIS', label: 'ANALYZE',  icon: '◎', desc: 'Complexity review'   },
  { id: 'BREACH',   label: 'BREACH',   icon: '🔓', desc: 'Fortress unlocked'  },
]

const STAGE_ORDER = ['CODE', 'TESTING', 'ANALYSIS', 'BREACH']

function getStageStatus(stageId, currentStage, approvalStatus) {
  if (currentStage === 'VETOED') {
    if (stageId === 'ANALYSIS') return 'rejected'
    if (stageId === 'BREACH') return 'locked'
    const idx = STAGE_ORDER.indexOf(stageId)
    const curIdx = STAGE_ORDER.indexOf('ANALYSIS')
    if (idx < curIdx) return 'completed'
    return 'locked'
  }
  const stageIdx = STAGE_ORDER.indexOf(stageId)
  const currentIdx = STAGE_ORDER.indexOf(currentStage)
  if (stageIdx < currentIdx) return 'completed'
  if (stageIdx === currentIdx) return 'active'
  return 'locked'
}

export default function HeistPipeline({ missionStage, approvalStatus }) {
  return (
    <div className={styles.pipeline}>
      <div className={styles.label}>BREACH PIPELINE</div>
      <div className={styles.track}>
        {STAGES.map((stage, i) => {
          const status = getStageStatus(stage.id, missionStage, approvalStatus)
          return (
            <div key={stage.id} className={styles.stageWrapper}>
              <motion.div
                className={`${styles.node} ${styles[`node_${status}`]}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {status === 'completed' && <CheckCircle2 size={14} />}
                {status === 'locked' && <Lock size={11} />}
                {status === 'rejected' && <AlertTriangle size={13} />}
                {status === 'active' && <span className={styles.activeIcon}>{stage.icon}</span>}
              </motion.div>

              <div className={styles.nodeLabel}>
                <div className={`${styles.nodeName} ${styles[`name_${status}`]}`}>
                  {stage.label}
                </div>
                <div className={styles.nodeDesc}>{stage.desc}</div>
              </div>

              {/* Connector line */}
              {i < STAGES.length - 1 && (
                <div className={styles.connector}>
                  <motion.div
                    className={`${styles.connectorFill} ${
                      getStageStatus(STAGES[i + 1].id, missionStage, approvalStatus) !== 'locked'
                        ? styles.connectorActive : ''
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {missionStage === 'VETOED' && (
        <motion.div
          className={styles.vetoAlert}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={11} />
          ANALYST VETO — Solution requires revision
        </motion.div>
      )}
    </div>
  )
}
