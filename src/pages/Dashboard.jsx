import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, Trophy, Flame, Target, Zap, Shield, Clock } from 'lucide-react'
import StatCard from '../components/StatCard'
import QuestCard from '../components/QuestCard'
import MissionModal from '../components/MissionModal'
import { PLAYER, QUESTS, DAILY_CHALLENGES, LEADERBOARD } from '../data/mockData'
import styles from './Dashboard.module.css'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function Dashboard({ showReward }) {
  const [selectedQuest, setSelectedQuest] = useState(null)
  const xpPercent = Math.round((PLAYER.xp / PLAYER.xpToNext) * 100)
  const featured = QUESTS.filter(q => q.featured).slice(0, 3)
  const topPlayers = LEADERBOARD.slice(0, 5)

  const handleStart = (quest) => {
    setSelectedQuest(null)
    showReward?.({
      title: 'QUEST INITIATED',
      subtitle: quest.title,
      xp: quest.xpReward,
      coins: quest.coinReward,
      fragments: quest.fragmentReward,
    })
  }

  return (
    <div className={styles.page}>
      {/* Hero banner */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroGreet}>WELCOME BACK, OPERATIVE</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroName}>{PLAYER.username}</span>
          </h1>
          <div className={styles.heroSub}>
            <span className={styles.rankBadge}>{PLAYER.rank}</span>
            <span className={styles.separator}>·</span>
            <span>{PLAYER.faction}</span>
            <span className={styles.separator}>·</span>
            <Flame size={12} style={{ color: '#ff9500' }} />
            <span>{PLAYER.streak} day streak</span>
          </div>

          {/* XP Bar */}
          <div className={styles.xpSection}>
            <div className={styles.xpLabels}>
              <span>LEVEL {PLAYER.level}</span>
              <span>{PLAYER.xp.toLocaleString()} / {PLAYER.xpToNext.toLocaleString()} XP</span>
            </div>
            <div className={styles.xpTrack}>
              <motion.div
                className={styles.xpFill}
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
              <div className={styles.xpGlow} style={{ left: `${xpPercent}%` }} />
            </div>
            <div className={styles.xpNext}>{xpPercent}% TO LEVEL {PLAYER.level + 1}</div>
          </div>
        </div>

        <div className={styles.heroDecor}>
          <div className={styles.decorRing1} />
          <div className={styles.decorRing2} />
          <div className={styles.decorCode}>
            {['01001000', '11001010', '00110111', '10101101'].map((b, i) => (
              <div key={i} className={styles.binRow} style={{ animationDelay: `${i * 0.3}s` }}>{b}</div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className={styles.statsGrid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <StatCard label="PROBLEMS SOLVED" value={PLAYER.stats.problemsSolved} sub="All time" icon={Target} color="#00f5ff" trend={12} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="ARENA WIN RATE" value={`${PLAYER.stats.winRate}%`} sub={`${PLAYER.stats.arenaWins} wins`} icon={Swords} color="#a855f7" trend={5} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="ACCURACY" value={`${PLAYER.stats.accuracy}%`} sub="Last 30 days" icon={Shield} color="#00ff88" trend={-2} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard label="AVG SOLVE TIME" value={PLAYER.stats.avgSpeed} sub="Per problem" icon={Clock} color="#ff9500" />
        </motion.div>
      </motion.div>

      {/* Main content grid */}
      <div className={styles.mainGrid}>
        {/* Daily challenges */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.sectionHeader}>
            <Zap size={14} style={{ color: '#ff9500' }} />
            <h2 className={styles.sectionTitle}>DAILY PROTOCOLS</h2>
            <div className={styles.sectionBadge} style={{ background: 'rgba(255,149,0,0.1)', borderColor: 'rgba(255,149,0,0.3)', color: '#ff9500' }}>
              RESETS IN 18H 42M
            </div>
          </div>

          <div className={styles.dailyList}>
            {DAILY_CHALLENGES.map(dc => (
              <div key={dc.id} className={`${styles.dailyItem} ${dc.completed ? styles.dailyDone : ''}`}>
                <div className={styles.dailyLeft}>
                  <div className={styles.dailyCheck}>
                    {dc.completed ? '✓' : '○'}
                  </div>
                  <div>
                    <div className={styles.dailyName}>{dc.title}</div>
                    <div className={styles.dailyProblem}>{dc.problem}</div>
                  </div>
                </div>
                <div className={styles.dailyRight}>
                  <span className={styles.dailyBonus}>×{dc.xpBonus} XP BONUS</span>
                  {!dc.completed && (
                    <button className={styles.dailyBtn}>GO</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Top players */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className={styles.sectionHeader}>
            <Trophy size={14} style={{ color: '#a855f7' }} />
            <h2 className={styles.sectionTitle}>TOP OPERATIVES</h2>
          </div>

          <div className={styles.leaderList}>
            {topPlayers.map((p) => (
              <div key={p.rank} className={`${styles.leaderItem} ${p.isPlayer ? styles.isPlayer : ''}`}>
                <span className={styles.leaderRank} style={{
                  color: p.rank === 1 ? '#ff9500' : p.rank === 2 ? '#aaa' : p.rank === 3 ? '#cd7f32' : 'var(--text-muted)'
                }}>
                  #{p.rank}
                </span>
                <span className={styles.leaderName}>{p.username}</span>
                <span className={styles.leaderTier} style={{
                  color: p.tier === 'PHANTOM' ? '#ff9500' : p.tier === 'SPECTER' ? '#a855f7' : '#00f5ff'
                }}>{p.tier}</span>
                <span className={styles.leaderScore}>{p.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Featured quests */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className={styles.sectionHeader}>
          <Target size={14} style={{ color: 'var(--cyan)' }} />
          <h2 className={styles.sectionTitle}>FEATURED MISSIONS</h2>
        </div>
        <div className={styles.questGrid}>
          {featured.map(q => (
            <QuestCard key={q.id} quest={q} onClick={setSelectedQuest} />
          ))}
        </div>
      </motion.section>

      {/* Phaser game placeholder */}
      <motion.section
        className={styles.phaserSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.phaserHeader}>
          <div className={styles.sectionHeader}>
            <Shield size={14} style={{ color: '#a855f7' }} />
            <h2 className={styles.sectionTitle}>REALM MINIMAP</h2>
            <div className={styles.sectionBadge} style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)', color: '#a855f7' }}>
              PHASER.JS ZONE
            </div>
          </div>
        </div>
        <div className={styles.phaserContainer} id="phaser-dashboard-mount">
          <div className={styles.phaserPlaceholder}>
            <div className={styles.phaserGrid} />
            <div className={styles.phaserContent}>
              <div className={styles.phaserIcon}>⬡</div>
              <div className={styles.phaserLabel}>PHASER.JS GAME ENGINE</div>
              <div className={styles.phaserSub}>Mount point: #phaser-dashboard-mount</div>
              <div className={styles.phaserCode}>
                <span className={styles.codeKeyword}>import</span> Phaser <span className={styles.codeKeyword}>from</span> <span className={styles.codeStr}>'phaser'</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <MissionModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} onStart={handleStart} />
    </div>
  )
}
