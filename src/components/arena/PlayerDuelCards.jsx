import { motion } from 'framer-motion'
import styles from './PlayerDuelCards.module.css'

const STATUS_LABELS = {
  ready:     { label: 'READY',     color: '#5e6888' },
  coding:    { label: 'CODING',    color: '#00f5ff' },
  attacking: { label: 'ATTACKING', color: '#ff3366' },
  submitted: { label: 'SUBMITTED', color: '#00ff88' },
  judging:   { label: 'JUDGING',   color: '#a855f7' },
}

function PlayerCard({ player, isReversed, currentRound }) {
  const sc = STATUS_LABELS[player.status] || STATUS_LABELS.ready
  const isSolver    = player.role === 'solver'
  const isCorruptor = player.role === 'corruptor'
  const roleColor   = isSolver ? '#00f5ff' : '#ff3366'

  const r1 = player.score.round1
  const r2 = player.score.round2

  return (
    <motion.div
      className={`${styles.card} ${isReversed ? styles.cardReversed : ''}`}
      style={{ '--pc': player.color }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Role banner */}
      <div className={styles.roleBanner} style={{ background: `${roleColor}18`, borderColor: `${roleColor}30`, color: roleColor }}>
        {isSolver ? '⌨ SOLVER' : '⚔ CORRUPTOR'}
      </div>

      <div className={styles.cardBody}>
        {/* Avatar */}
        <div className={styles.avatar} style={{ borderColor: player.color }}>
          {player.name[0]}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.name}>{player.name}</div>
          <div className={styles.rank} style={{ color: player.color }}>{player.rank}</div>
          <div className={styles.status} style={{ color: sc.color }}>
            <div className={styles.statusDot} style={{ background: sc.color, boxShadow: `0 0 5px ${sc.color}` }} />
            {sc.label}
          </div>
        </div>

        {/* Round scores */}
        <div className={styles.scores}>
          <div className={`${styles.scoreChip} ${r1 === 1 ? styles.scoreWin : r1 === 0 ? styles.scoreLoss : styles.scorePending}`}>
            R1: {r1 !== null ? (r1 === 1 ? 'W' : 'L') : '—'}
          </div>
          <div className={`${styles.scoreChip} ${r2 === 1 ? styles.scoreWin : r2 === 0 ? styles.scoreLoss : styles.scorePending}`}>
            R2: {r2 !== null ? (r2 === 1 ? 'W' : 'L') : '—'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PlayerDuelCards({ players, currentRound }) {
  return (
    <div className={styles.duelCards}>
      <PlayerCard player={players.self} isReversed={false} currentRound={currentRound} />

      {/* VS separator */}
      <div className={styles.vsSep}>
        <div className={styles.vsLine} />
        <div className={styles.vsText}>VS</div>
        <div className={styles.vsLine} />
      </div>

      <PlayerCard player={players.opp} isReversed={true} currentRound={currentRound} />
    </div>
  )
}
