import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react'
import { LEADERBOARD } from '../data/mockData'
import styles from './Leaderboard.module.css'

const TABS = ['GLOBAL', 'WEEKLY', 'FACTION', 'FRIENDS']
const TIER_COLORS = {
  PHANTOM: '#ff9500',
  SPECTER: '#a855f7',
  HEXBLADE: '#00f5ff',
  CIPHER: '#00ff88',
  INITIATE: '#888',
}

export default function Leaderboard() {
  const [tab, setTab] = useState('GLOBAL')

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <Trophy size={36} className={styles.trophyIcon} />
          <div>
            <h1 className={styles.title}>LEADERBOARD</h1>
            <p className={styles.subtitle}>Season 4 · DIGITAL VOID ERA · Resets in 12 days</p>
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>10,284</span>
            <span className={styles.heroStatLabel}>PARTICIPANTS</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>S04</span>
            <span className={styles.heroStatLabel}>SEASON</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatVal}>12D</span>
            <span className={styles.heroStatLabel}>RESETS IN</span>
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className={styles.podium}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, i) => {
          const pos = [2, 1, 3][i]
          const heights = ['100px', '130px', '80px']
          const colors = ['#888', '#ff9500', '#cd7f32']
          return (
            <motion.div
              key={p.rank}
              className={styles.podiumSlot}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {pos === 1 && (
                <Crown size={24} style={{ color: '#ff9500', filter: 'drop-shadow(0 0 8px #ff9500)' }} className={styles.crown} />
              )}
              <div className={styles.podiumAvatar} style={{ borderColor: colors[i], boxShadow: `0 0 16px ${colors[i]}40` }}>
                {p.username[0]}
              </div>
              <div className={styles.podiumName}>{p.username}</div>
              <div className={styles.podiumTier} style={{ color: TIER_COLORS[p.tier] }}>{p.tier}</div>
              <div className={styles.podiumScore}>{p.score.toLocaleString()}</div>
              <div
                className={styles.podiumBase}
                style={{ height: heights[i], background: `linear-gradient(to top, ${colors[i]}18, transparent)`, borderColor: `${colors[i]}40` }}
              >
                <span className={styles.podiumPos} style={{ color: colors[i] }}>#{pos}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHeader}>
          <span className={styles.colRank}>RANK</span>
          <span className={styles.colPlayer}>OPERATIVE</span>
          <span className={styles.colTier}>TIER</span>
          <span className={styles.colScore}>SCORE</span>
          <span className={styles.colStreak}>STREAK</span>
          <span className={styles.colWin}>WIN%</span>
          <span className={styles.colChange}>Δ</span>
        </div>

        <div className={styles.tableBody}>
          {LEADERBOARD.map((p, i) => (
            <motion.div
              key={p.rank}
              className={`${styles.tableRow} ${p.isPlayer ? styles.playerRow : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 4 }}
            >
              <div className={styles.colRank}>
                <span className={styles.rankNum} style={{
                  color: p.rank === 1 ? '#ff9500' : p.rank === 2 ? '#aaa' : p.rank === 3 ? '#cd7f32' : 'var(--text-muted)'
                }}>
                  #{p.rank}
                </span>
              </div>

              <div className={styles.colPlayer}>
                <div className={styles.rowAvatar} style={{ borderColor: TIER_COLORS[p.tier] }}>
                  {p.username[0]}
                </div>
                <div>
                  <div className={styles.rowName}>
                    {p.username}
                    {p.isPlayer && <span className={styles.youTag}>YOU</span>}
                  </div>
                </div>
              </div>

              <div className={styles.colTier}>
                <span style={{ color: TIER_COLORS[p.tier] }}>{p.tier}</span>
              </div>

              <div className={styles.colScore}>
                <span className={styles.scoreVal}>{p.score.toLocaleString()}</span>
              </div>

              <div className={styles.colStreak}>
                <Flame size={11} style={{ color: '#ff9500' }} />
                <span>{p.streak}</span>
              </div>

              <div className={styles.colWin}>
                <span style={{ color: p.winRate >= 80 ? '#00ff88' : p.winRate >= 60 ? 'var(--cyan)' : 'var(--text-muted)' }}>
                  {p.winRate}%
                </span>
              </div>

              <div className={styles.colChange}>
                {p.change > 0 ? (
                  <span className={styles.changeUp}><TrendingUp size={12} /> {p.change}</span>
                ) : p.change < 0 ? (
                  <span className={styles.changeDown}><TrendingDown size={12} /> {Math.abs(p.change)}</span>
                ) : (
                  <span className={styles.changeNeutral}><Minus size={12} /></span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
