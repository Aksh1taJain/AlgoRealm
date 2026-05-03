import { motion } from 'framer-motion'
import { Swords, Users, Clock, Zap, Shield, Crown } from 'lucide-react'
import { PLAYER } from '../../data/mockData'
import styles from './BattleLobby.module.css'

const DIFFICULTIES = [
  { id: 'EASY',    color: '#00ff88', time: '~20s' },
  { id: 'MEDIUM',  color: '#ff9500', time: '~35s' },
  { id: 'HARD',    color: '#ff3366', time: '~45s' },
  { id: 'EXTREME', color: '#a855f7', time: '~60s' },
]

export default function BattleLobby({
  battleStatus, selectedDifficulty, queueTime,
  onSelectDifficulty, onJoinQueue, onStartBattle,
}) {
  const isMatching = battleStatus === 'matching'
  const diff = DIFFICULTIES.find(d => d.id === selectedDifficulty)

  return (
    <div className={styles.lobby}>
      <div className={styles.leftCol}>
        {/* Matchmaking card */}
        <div className={styles.matchCard}>
          <div className={styles.cardLabel}>MATCHMAKING</div>

          {/* Player vs opponent */}
          <div className={styles.duelRow}>
            <div className={styles.playerSlot}>
              <div className={styles.avatar} style={{ borderColor: 'var(--cyan)' }}>
                {PLAYER.username[0]}
              </div>
              <div className={styles.playerName}>{PLAYER.username}</div>
              <div className={styles.playerRank} style={{ color: 'var(--cyan)' }}>{PLAYER.rank}</div>
              <div className={styles.playerWr}>{PLAYER.stats.winRate}% WR</div>
            </div>

            <div className={styles.vsBlock}>
              <div className={styles.vsText}>VS</div>
              <div className={styles.vsLine} />
            </div>

            <div className={styles.playerSlot}>
              <div className={`${styles.avatar} ${styles.avatarEnemy} ${isMatching ? styles.avatarSearching : ''}`}>
                {isMatching ? <span className={styles.searchSpinner} /> : '?'}
              </div>
              <div className={styles.playerName} style={{ color: isMatching ? '#ff9500' : 'var(--text-muted)' }}>
                {isMatching ? 'SCANNING...' : 'WAITING'}
              </div>
              <div className={styles.playerRank} style={{ color: 'var(--text-muted)' }}>
                {isMatching ? 'MATCHED RANK' : 'OPEN SLOT'}
              </div>
              {isMatching && (
                <div className={styles.searchDots}>
                  <span /><span /><span />
                </div>
              )}
            </div>
          </div>

          {/* Queue info */}
          {isMatching && (
            <motion.div
              className={styles.queueInfo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.queueStat}>
                <Clock size={11} />
                <span>ELAPSED: {queueTime}s</span>
              </div>
              <div className={styles.queueStat}>
                <Users size={11} />
                <span>342 IN QUEUE</span>
              </div>
              <div className={styles.queueStat}>
                <span>AVG WAIT: {diff?.time || '~45s'}</span>
              </div>
            </motion.div>
          )}

          <button
            className={`${styles.enterBtn} ${isMatching ? styles.enterBtnSearching : ''}`}
            onClick={isMatching ? onStartBattle : onJoinQueue}
          >
            {isMatching ? (
              <>
                <motion.div
                  className={styles.btnSpinner}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                SEARCHING FOR OPPONENT…
              </>
            ) : (
              <>
                <Swords size={15} />
                ENTER ARENA
              </>
            )}
          </button>

          {isMatching && (
            <button className={styles.skipBtn} onClick={onStartBattle}>
              SKIP QUEUE (DEMO)
            </button>
          )}
        </div>

        {/* Difficulty selection */}
        <div className={styles.diffSection}>
          <div className={styles.sectionLabel}>SELECT DIFFICULTY</div>
          <div className={styles.diffGrid}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                className={`${styles.diffBtn} ${selectedDifficulty === d.id ? styles.diffActive : ''}`}
                style={{ '--dc': d.color }}
                onClick={() => onSelectDifficulty(d.id)}
              >
                <div className={styles.diffName}>{d.id}</div>
                <div className={styles.diffWait}>~{d.time}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightCol}>
        {/* How it works */}
        <div className={styles.rulesCard}>
          <div className={styles.rulesTitle}>HOW ALGORITHM BATTLES WORKS</div>
          <div className={styles.phaseList}>
            <div className={styles.phase}>
              <div className={styles.phaseNum} style={{ color: '#00f5ff' }}>01</div>
              <div className={styles.phaseInfo}>
                <div className={styles.phaseName}>SOLVER PHASE</div>
                <div className={styles.phaseDesc}>You write a robust algorithm solution. Defensive coding wins.</div>
              </div>
            </div>
            <div className={styles.phase}>
              <div className={styles.phaseNum} style={{ color: '#ff3366' }}>02</div>
              <div className={styles.phaseInfo}>
                <div className={styles.phaseName}>CORRUPTOR ATTACK</div>
                <div className={styles.phaseDesc}>Opponent has 60s to submit edge cases designed to break your code.</div>
              </div>
            </div>
            <div className={styles.phase}>
              <div className={styles.phaseNum} style={{ color: '#a855f7' }}>03</div>
              <div className={styles.phaseInfo}>
                <div className={styles.phaseName}>AI REFEREE JUDGES</div>
                <div className={styles.phaseDesc}>NIM model evaluates robustness, edge coverage, and validity.</div>
              </div>
            </div>
            <div className={styles.phase}>
              <div className={styles.phaseNum} style={{ color: '#ff9500' }}>04</div>
              <div className={styles.phaseInfo}>
                <div className={styles.phaseName}>ROLE SWITCH</div>
                <div className={styles.phaseDesc}>Roles swap. Now you attack — find weaknesses in their code.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className={styles.scoringCard}>
          <div className={styles.rulesTitle}>SCORING CRITERIA</div>
          <div className={styles.scoringGrid}>
            {[
              { label: 'Correctness',     pts: 30, color: '#00f5ff' },
              { label: 'Robustness',      pts: 25, color: '#00ff88' },
              { label: 'Edge coverage',   pts: 20, color: '#a855f7' },
              { label: 'Attack validity', pts: 15, color: '#ff3366' },
              { label: 'Time efficiency', pts: 10, color: '#ff9500' },
            ].map(s => (
              <div key={s.label} className={styles.scoringItem}>
                <div className={styles.scoringLabel}>{s.label}</div>
                <div className={styles.scoringBar}>
                  <div className={styles.scoringFill} style={{ width: `${s.pts}%`, background: s.color }} />
                </div>
                <div className={styles.scoringPts} style={{ color: s.color }}>{s.pts}pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
