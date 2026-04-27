import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Users, Clock, Plus, CheckCircle2, Lock, Zap } from 'lucide-react'
import { HEIST_MISSIONS } from '../data/mockData'
import styles from './Heist.module.css'

const DIFF_COLOR = { HARD: '#ff3366', EXTREME: '#a855f7', MEDIUM: '#ff9500' }
const STATUS_CONFIG = {
  ACTIVE: { color: '#00f5ff', label: 'ACTIVE' },
  RECRUITING: { color: '#00ff88', label: 'RECRUITING' },
  COMPLETED: { color: '#4a5275', label: 'COMPLETED' },
}

export default function Heist({ showReward }) {
  const [selectedHeist, setSelectedHeist] = useState(HEIST_MISSIONS[0])

  const handleJoin = () => {
    showReward?.({
      title: 'HEIST JOINED',
      subtitle: selectedHeist.name,
      xp: 200,
      coins: 400,
      fragments: 5,
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>HEIST OPS</h1>
        <p className={styles.subtitle}>Team-based infiltration missions. Coordinate. Execute. Vanish.</p>
      </div>

      <div className={styles.layout}>
        {/* Heist list */}
        <div className={styles.heistList}>
          <div className={styles.listLabel}>AVAILABLE OPERATIONS</div>
          {HEIST_MISSIONS.map(h => {
            const sc = STATUS_CONFIG[h.status]
            return (
              <motion.button
                key={h.id}
                className={`${styles.heistItem} ${selectedHeist?.id === h.id ? styles.heistItemActive : ''} ${h.status === 'COMPLETED' ? styles.heistCompleted : ''}`}
                style={{ '--h-color': sc.color }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedHeist(h)}
              >
                <div className={styles.heistItemLeft}>
                  <div className={styles.heistItemStatus}>
                    <div className={styles.statusDot} style={{ background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
                    <span style={{ color: sc.color }}>{sc.label}</span>
                  </div>
                  <div className={styles.heistItemName}>{h.name}</div>
                  <div className={styles.heistItemMeta}>
                    <span>{h.difficulty}</span>
                    <span>·</span>
                    <span>{h.currentMembers.length}/{h.teamSize} ops</span>
                    {h.timeLeft && (
                      <>
                        <span>·</span>
                        <Clock size={10} />
                        <span>{h.timeLeft}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.heistItemPhase}>
                  P{h.phase}/{h.totalPhases}
                </div>
              </motion.button>
            )
          })}

          <button className={styles.newHeistBtn}>
            <Plus size={14} />
            CREATE NEW OPERATION
          </button>
        </div>

        {/* Heist detail */}
        <AnimatePresence mode="wait">
          {selectedHeist && (
            <motion.div
              key={selectedHeist.id}
              className={styles.heistDetail}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className={styles.detailHeader}>
                <div className={styles.detailStatus}>
                  <div
                    className={styles.statusDot}
                    style={{
                      background: STATUS_CONFIG[selectedHeist.status].color,
                      boxShadow: `0 0 8px ${STATUS_CONFIG[selectedHeist.status].color}`
                    }}
                  />
                  <span style={{ color: STATUS_CONFIG[selectedHeist.status].color }}>
                    {STATUS_CONFIG[selectedHeist.status].label}
                  </span>
                </div>
                <div
                  className={styles.diffTag}
                  style={{ color: DIFF_COLOR[selectedHeist.difficulty] || '#ff9500' }}
                >
                  {selectedHeist.difficulty}
                </div>
              </div>

              <h2 className={styles.detailTitle}>{selectedHeist.name}</h2>
              <p className={styles.detailDesc}>{selectedHeist.description}</p>

              {/* Phase progress */}
              <div className={styles.phaseSection}>
                <div className={styles.phaseLabel}>MISSION PHASES</div>
                <div className={styles.phaseTrack}>
                  {Array.from({ length: selectedHeist.totalPhases }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`${styles.phaseNode} ${i < selectedHeist.phase ? styles.phaseDone : i === selectedHeist.phase ? styles.phaseCurrent : ''}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {i < selectedHeist.phase ? <CheckCircle2 size={12} /> : i + 1}
                    </motion.div>
                  ))}
                  <div className={styles.phaseLine}>
                    <motion.div
                      className={styles.phaseLineFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedHeist.phase / (selectedHeist.totalPhases - 1)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Team roster */}
              <div className={styles.teamSection}>
                <div className={styles.teamLabel}>
                  <Users size={12} />
                  <span>OPERATIVE ROSTER ({selectedHeist.currentMembers.length}/{selectedHeist.teamSize})</span>
                </div>
                <div className={styles.teamRoster}>
                  {Array.from({ length: selectedHeist.teamSize }).map((_, i) => {
                    const member = selectedHeist.currentMembers[i]
                    return (
                      <div key={i} className={`${styles.memberSlot} ${!member ? styles.emptySlot : ''}`}>
                        {member ? (
                          <>
                            <div className={styles.memberAvatar}>{member.name[0]}</div>
                            <div className={styles.memberInfo}>
                              <div className={styles.memberName}>{member.name}</div>
                              <div className={styles.memberRole}>{member.role}</div>
                            </div>
                            <div className={`${styles.memberReady} ${member.ready ? styles.isReady : ''}`}>
                              {member.ready ? 'READY' : 'PREP'}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.emptyAvatar}>?</div>
                            <div className={styles.emptyLabel}>OPEN SLOT</div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Rewards */}
              <div className={styles.rewardSection}>
                <div className={styles.rewardLabel}>COMPLETION REWARDS</div>
                <div className={styles.rewardRow}>
                  <div className={styles.rewardItem} style={{ '--r': 'var(--cyan)' }}>
                    <Zap size={13} style={{ color: 'var(--cyan)' }} />
                    <span>+{selectedHeist.reward.xp} XP</span>
                  </div>
                  <div className={styles.rewardItem} style={{ '--r': '#ff9500' }}>
                    <span style={{ color: '#ff9500' }}>◈</span>
                    <span>+{selectedHeist.reward.coins}</span>
                  </div>
                  <div className={styles.rewardItem} style={{ '--r': 'var(--purple)' }}>
                    <span style={{ color: 'var(--purple)' }}>⬡</span>
                    <span>+{selectedHeist.reward.fragment} FRAGS</span>
                  </div>
                </div>
              </div>

              {/* Time */}
              {selectedHeist.timeLeft && (
                <div className={styles.timeLeft}>
                  <Clock size={13} style={{ color: '#ff9500' }} />
                  <span>TIME REMAINING: </span>
                  <span style={{ color: '#ff9500' }}>{selectedHeist.timeLeft}</span>
                </div>
              )}

              {/* CTA */}
              {selectedHeist.status !== 'COMPLETED' && (
                <div className={styles.actions}>
                  {selectedHeist.status === 'RECRUITING' ? (
                    <button className={styles.joinBtn} onClick={handleJoin}>
                      <Users size={15} />
                      JOIN OPERATION
                    </button>
                  ) : selectedHeist.status === 'ACTIVE' ? (
                    <button className={styles.resumeBtn}>
                      <ShieldAlert size={15} />
                      RESUME MISSION
                    </button>
                  ) : null}
                </div>
              )}

              {selectedHeist.status === 'COMPLETED' && (
                <div className={styles.completedBadge}>
                  <CheckCircle2 size={16} />
                  <span>OPERATION COMPLETED</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
