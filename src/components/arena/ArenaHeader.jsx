import { Swords, Users, Eye, Zap } from 'lucide-react'
import styles from './ArenaHeader.module.css'

const STATUS_CONFIG = {
  lobby:       { label: 'IN LOBBY',     color: '#5e6888' },
  matching:    { label: 'SEARCHING',    color: '#ff9500' },
  active:      { label: 'BATTLE LIVE',  color: '#ff3366' },
  judging:     { label: 'AI JUDGING',   color: '#a855f7' },
  'role-switch':{ label: 'ROLE SWITCH', color: '#ff9500' },
  round2:      { label: 'ROUND 2 LIVE', color: '#ff3366' },
  completed:   { label: 'COMPLETE',     color: '#00ff88' },
}

export default function ArenaHeader({ battleStatus, currentRound }) {
  const sc = STATUS_CONFIG[battleStatus] || STATUS_CONFIG.lobby

  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <div className={styles.modeTag}>
          <Swords size={11} />
          <span>ALGORITHM BATTLES</span>
        </div>
        <h1 className={styles.title}>COMBAT ARENA</h1>
        <p className={styles.subtitle}>1v1 asymmetric duel — Solver vs Corruptor</p>
      </div>

      <div className={styles.center}>
        <div className={styles.statusPill} style={{ color: sc.color, borderColor: `${sc.color}35`, background: `${sc.color}0d` }}>
          {battleStatus === 'active' || battleStatus === 'round2' ? (
            <div className={styles.liveDot} style={{ background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
          ) : null}
          {sc.label}
        </div>
        {(battleStatus === 'active' || battleStatus === 'round2') && (
          <div className={styles.roundBadge}>RND {currentRound}/2</div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <Eye size={12} style={{ color: '#ff3366' }} />
          <span>1,284 WATCHING</span>
        </div>
        <div className={styles.stat}>
          <Users size={12} style={{ color: 'var(--cyan)' }} />
          <span>342 IN QUEUE</span>
        </div>
        <div className={styles.stat}>
          <Swords size={12} style={{ color: '#ff9500' }} />
          <span>89 ACTIVE DUELS</span>
        </div>
        {/* TODO: Replace with live stats from Socket.IO: socket.on('arena:stats', ...) */}
      </div>
    </header>
  )
}
