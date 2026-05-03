import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import styles from './BattleScoreboard.module.css'

export default function BattleScoreboard({ finalScore, players, refereeDecisions, onNewBattle }) {
  const didWin = finalScore.winner === players.self.name
  const isDraw = finalScore.winner === 'DRAW'

  return (
    <motion.div
      className={styles.scoreboard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.resultBanner} style={{
        borderColor: didWin ? 'rgba(0,255,136,0.3)' : isDraw ? 'rgba(255,149,0,0.3)' : 'rgba(255,51,102,0.3)',
        background: didWin ? 'rgba(0,255,136,0.04)' : isDraw ? 'rgba(255,149,0,0.04)' : 'rgba(255,51,102,0.04)',
      }}>
        <Trophy size={28} style={{ color: didWin ? '#00ff88' : isDraw ? '#ff9500' : '#ff3366' }} />
        <div>
          <div className={styles.resultTitle} style={{ color: didWin ? '#00ff88' : isDraw ? '#ff9500' : '#ff3366' }}>
            {didWin ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
          </div>
          <div className={styles.winnerName}>Winner: {finalScore.winner}</div>
        </div>
      </div>

      {/* Round breakdown */}
      <div className={styles.rounds}>
        {[1, 2].map(r => {
          const dec = refereeDecisions[`round${r}`]
          if (!dec) return null
          return (
            <div key={r} className={styles.roundCard}>
              <div className={styles.roundLabel}>ROUND {r}</div>
              <div className={styles.roundWinner} style={{ color: dec.roundWinner === 'SOLVER' ? '#00f5ff' : '#ff3366' }}>
                {dec.roundWinner} wins
              </div>
              <div className={styles.roundRobust}>Robustness: {dec.solverRobustness}/100</div>
              <div className={styles.roundNote}>{dec.explanation.slice(0, 80)}…</div>
            </div>
          )
        })}
      </div>

      {/* Final scores */}
      <div className={styles.scores}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreName}>{players.self.name}</div>
          <div className={styles.scoreVal} style={{ color: '#00f5ff' }}>{finalScore.selfTotal}</div>
          <div className={styles.scoreLabel}>ROUNDS WON</div>
        </div>
        <div className={styles.scoreSep}>—</div>
        <div className={styles.scoreCard}>
          <div className={styles.scoreName}>{players.opp.name}</div>
          <div className={styles.scoreVal} style={{ color: '#ff3366' }}>{finalScore.oppTotal}</div>
          <div className={styles.scoreLabel}>ROUNDS WON</div>
        </div>
      </div>

      {/* Rewards */}
      <div className={styles.rewards}>
        <div className={styles.rewardItem} style={{ '--rc': 'var(--cyan)' }}>
          <span style={{ color: 'var(--cyan)' }}>+{finalScore.xpEarned} XP</span>
        </div>
        <div className={styles.rewardItem} style={{ '--rc': '#ff9500' }}>
          <span style={{ color: '#ff9500' }}>◈ +{finalScore.coinsEarned}</span>
        </div>
        <div className={styles.rewardItem} style={{ '--rc': '#a855f7' }}>
          <span style={{ color: '#a855f7' }}>+{finalScore.robustnessBonus} ROBUSTNESS</span>
        </div>
      </div>

      <button className={styles.newBattleBtn} onClick={onNewBattle}>
        NEW BATTLE
        {/* TODO: Replace with Socket.IO: socket.emit('queue:rejoin') */}
      </button>
    </motion.div>
  )
}
