import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Users, Trophy, Zap, Clock, Eye, Crown, Shield } from 'lucide-react'
import { ARENA_MATCHES, PLAYER } from '../data/mockData'
import styles from './Arena.module.css'

const MODES = [
  { id: 'DUEL', label: '1v1 DUEL', icon: Swords, desc: 'Head-to-head algorithmic combat', color: '#ff3366', players: '2' },
  { id: 'BATTLE_ROYALE', label: 'BATTLE ROYALE', icon: Crown, desc: 'Last coder standing wins', color: '#ff9500', players: '8' },
  { id: 'TEAM_RAID', label: 'TEAM RAID', icon: Shield, desc: 'Co-op raid against boss algorithms', color: '#a855f7', players: '3v3' },
]

export default function Arena({ showReward }) {
  const [selectedMode, setSelectedMode] = useState('DUEL')
  const [queuing, setQueuing] = useState(false)

  const handleQueue = () => {
    setQueuing(true)
    setTimeout(() => {
      setQueuing(false)
      showReward?.({
        title: 'MATCH FOUND',
        subtitle: `${selectedMode} - Ready to enter`,
        xp: 120,
        coins: 80,
      })
    }, 3000)
  }

  const liveMatch = ARENA_MATCHES.find(m => m.status === 'LIVE')

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>COMBAT ARENA</h1>
        <p className={styles.subtitle}>Real-time algorithmic warfare. Prove your worth.</p>
        <div className={styles.arenaStats}>
          <div className={styles.arenaStat}>
            <Eye size={13} style={{ color: '#ff3366' }} />
            <span>1,284 WATCHING</span>
          </div>
          <div className={styles.arenaStat}>
            <Users size={13} style={{ color: 'var(--cyan)' }} />
            <span>342 IN QUEUE</span>
          </div>
          <div className={styles.arenaStat}>
            <Swords size={13} style={{ color: '#ff9500' }} />
            <span>89 ACTIVE DUELS</span>
          </div>
        </div>
      </div>

      {/* Live match banner */}
      {liveMatch && (
        <motion.div
          className={styles.liveBanner}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.liveDot} />
          <span className={styles.liveLabel}>LIVE DUEL</span>
          <div className={styles.liveMatchup}>
            <span className={styles.livePlayer} style={{ color: 'var(--cyan)' }}>
              {liveMatch.player1.name}
            </span>
            <span className={styles.liveScore}>
              {liveMatch.player1.score} — {liveMatch.player2.score}
            </span>
            <span className={styles.livePlayer} style={{ color: '#ff3366' }}>
              {liveMatch.player2.name}
            </span>
          </div>
          <div className={styles.liveTime}>
            <Clock size={12} />
            <span>{liveMatch.timeRemaining}</span>
          </div>
          <div className={styles.liveViewers}>
            <Eye size={11} />
            <span>{liveMatch.viewers}</span>
          </div>
          <button className={styles.watchBtn}>WATCH</button>
        </motion.div>
      )}

      {/* Mode selection */}
      <section className={styles.modeSection}>
        <div className={styles.sectionLabel}>SELECT COMBAT MODE</div>
        <div className={styles.modeGrid}>
          {MODES.map(mode => (
            <motion.button
              key={mode.id}
              className={`${styles.modeCard} ${selectedMode === mode.id ? styles.modeActive : ''}`}
              style={{ '--mode-color': mode.color }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode(mode.id)}
            >
              <div className={styles.modeTopLine} />
              <div className={styles.modeIconWrap}>
                <mode.icon size={28} style={{ color: mode.color }} />
              </div>
              <div className={styles.modeLabel}>{mode.label}</div>
              <div className={styles.modeDesc}>{mode.desc}</div>
              <div className={styles.modePlayers}>
                <Users size={11} />
                <span>{mode.players} players</span>
              </div>
              {selectedMode === mode.id && (
                <motion.div
                  className={styles.modeSelectedIndicator}
                  layoutId="mode-selected"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Main arena layout */}
      <div className={styles.arenaLayout}>
        {/* Queue / matchmaking */}
        <div className={styles.matchmakeSection}>
          <div className={styles.sectionLabel}>MATCHMAKING</div>

          <div className={styles.matchmakeCard}>
            {/* Player stats */}
            <div className={styles.playerRow}>
              <div className={styles.playerCard}>
                <div className={styles.pAvatar}>{PLAYER.username[0]}</div>
                <div className={styles.pInfo}>
                  <div className={styles.pName}>{PLAYER.username}</div>
                  <div className={styles.pRank}>{PLAYER.rank}</div>
                </div>
                <div className={styles.pScore}>
                  <span className={styles.pScoreVal}>{PLAYER.stats.winRate}%</span>
                  <span className={styles.pScoreLabel}>WIN RATE</span>
                </div>
              </div>

              <div className={styles.vsText}>VS</div>

              <div className={`${styles.playerCard} ${styles.enemyCard}`}>
                <div className={styles.enemyQuestion}>?</div>
                <div className={styles.pInfo}>
                  <div className={styles.pName}>SEARCHING...</div>
                  <div className={styles.pRank}>MATCHING RANK</div>
                </div>
              </div>
            </div>

            {/* Queue button */}
            <button
              className={`${styles.queueBtn} ${queuing ? styles.queuing : ''}`}
              onClick={handleQueue}
              disabled={queuing}
            >
              {queuing ? (
                <>
                  <motion.div
                    className={styles.queueSpinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>SEARCHING FOR OPPONENT...</span>
                </>
              ) : (
                <>
                  <Swords size={16} />
                  <span>ENTER ARENA</span>
                </>
              )}
            </button>

            {queuing && (
              <motion.div
                className={styles.queueInfo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span>AVG QUEUE TIME: 45s</span>
                <span>|</span>
                <span>342 IN QUEUE</span>
              </motion.div>
            )}
          </div>

          {/* Rules */}
          <div className={styles.rulesCard}>
            <div className={styles.rulesTitle}>COMBAT RULES</div>
            <ul className={styles.rulesList}>
              <li>First to solve all problems wins</li>
              <li>Incorrect submissions add 5min penalty</li>
              <li>Winner earns +{selectedMode === 'DUEL' ? 80 : selectedMode === 'BATTLE_ROYALE' ? 200 : 150} Arena Points</li>
              <li>Top 3 players earn coin rewards</li>
            </ul>
          </div>
        </div>

        {/* Active matches */}
        <div className={styles.matchesSection}>
          <div className={styles.sectionLabel}>ACTIVE MATCHES</div>
          <div className={styles.matchList}>
            {ARENA_MATCHES.map(m => (
              <motion.div
                key={m.id}
                className={styles.matchCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
              >
                <div className={styles.matchMode}>{m.mode.replace('_', ' ')}</div>
                <div className={`${styles.matchStatus} ${styles[`status_${m.status}`]}`}>
                  {m.status === 'LIVE' && <div className={styles.livePulse} />}
                  {m.status}
                </div>
                {m.player1 && (
                  <div className={styles.matchPlayers}>
                    <span>{m.player1.name}</span>
                    <span className={styles.matchVs}>VS</span>
                    <span>{m.player2.name}</span>
                  </div>
                )}
                {m.players && (
                  <div className={styles.matchInfo}>
                    <Users size={11} />
                    <span>{m.players}/{m.maxPlayers} players</span>
                    {m.prizePool && (
                      <span className={styles.prizePool}>◈ {m.prizePool}</span>
                    )}
                  </div>
                )}
                {m.timeRemaining && (
                  <div className={styles.matchTime}>
                    <Clock size={11} />
                    <span>{m.timeRemaining}</span>
                  </div>
                )}
                {m.status === 'OPEN' && (
                  <button className={styles.joinBtn}>JOIN</button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Phaser arena preview */}
          <div className={styles.arenaPreview} id="phaser-arena-mount">
            <div className={styles.arenaGrid} />
            <div className={styles.arenaPreviewContent}>
              <Swords size={32} style={{ color: '#ff3366', filter: 'drop-shadow(0 0 12px #ff3366)' }} />
              <div className={styles.arenaPreviewLabel}>BATTLE VISUALIZATION</div>
              <div className={styles.arenaPreviewSub}>Phaser.js Arena Engine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
