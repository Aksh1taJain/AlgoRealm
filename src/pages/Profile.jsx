import { motion } from 'framer-motion'
import { Edit2, Star, Zap, Target, Swords, Shield, Clock, Award } from 'lucide-react'
import { PLAYER, RANKS } from '../data/mockData'
import StatCard from '../components/StatCard'
import styles from './Profile.module.css'

const RARITY_COLORS = { common: '#888', rare: '#00f5ff', epic: '#a855f7', legendary: '#ff9500' }

export default function Profile() {
  const xpPercent = Math.round((PLAYER.xp / PLAYER.xpToNext) * 100)
  const currentRank = RANKS.find(r => r.name === PLAYER.rank)

  return (
    <div className={styles.page}>
      {/* Profile header */}
      <motion.div
        className={styles.profileHeader}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.headerBg} />

        <div className={styles.avatarSection}>
          <div className={styles.avatarOuter}>
            <div className={styles.avatarRing1} />
            <div className={styles.avatarRing2} />
            <div className={styles.avatar}>{PLAYER.username[0]}</div>
            <div className={styles.levelBubble}>LV {PLAYER.level}</div>
          </div>
        </div>

        <div className={styles.identitySection}>
          <div className={styles.titleBadge}>{PLAYER.equippedTitle}</div>
          <h1 className={styles.username}>{PLAYER.username}</h1>
          <div className={styles.handle}>{PLAYER.handle}</div>
          <div className={styles.metaRow}>
            <span className={styles.rankBadge} style={{ color: currentRank?.color }}>
              {PLAYER.rank}
            </span>
            <span className={styles.dot}>·</span>
            <span className={styles.faction}>{PLAYER.faction}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.joinDate}>OPERATIVE SINCE {new Date(PLAYER.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}</span>
          </div>

          {/* XP bar */}
          <div className={styles.xpSection}>
            <div className={styles.xpLabels}>
              <span>XP: {PLAYER.xp.toLocaleString()}</span>
              <span>{xpPercent}% → LV {PLAYER.level + 1}</span>
            </div>
            <div className={styles.xpTrack}>
              <motion.div
                className={styles.xpFill}
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.editBtn}>
            <Edit2 size={13} />
            EDIT PROFILE
          </button>

          <div className={styles.currenciesCard}>
            <div className={styles.currency}>
              <span style={{ color: 'var(--cyan)' }}>◈</span>
              <div>
                <div className={styles.currencyVal}>{PLAYER.coins.toLocaleString()}</div>
                <div className={styles.currencyLabel}>COINS</div>
              </div>
            </div>
            <div className={styles.currency}>
              <span style={{ color: 'var(--purple)' }}>⬡</span>
              <div>
                <div className={styles.currencyVal}>{PLAYER.fragments}</div>
                <div className={styles.currencyLabel}>FRAGMENTS</div>
              </div>
            </div>
            <div className={styles.currency}>
              <span style={{ color: '#ff9500' }}>◆</span>
              <div>
                <div className={styles.currencyVal}>{PLAYER.shards}</div>
                <div className={styles.currencyLabel}>SHARDS</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard label="PROBLEMS SOLVED" value={PLAYER.stats.problemsSolved} sub="All time" icon={Target} color="#00f5ff" />
        <StatCard label="ARENA WIN RATE" value={`${PLAYER.stats.winRate}%`} sub={`${PLAYER.stats.arenaWins} wins`} icon={Swords} color="#ff3366" />
        <StatCard label="ACCURACY" value={`${PLAYER.stats.accuracy}%`} sub="Last 30 days" icon={Shield} color="#00ff88" />
        <StatCard label="HEISTS DONE" value={PLAYER.stats.heistCompleted} sub="Co-op missions" icon={Star} color="#a855f7" />
        <StatCard label="CURRENT STREAK" value={`${PLAYER.streak}D`} sub="Days active" icon={Zap} color="#ff9500" />
        <StatCard label="AVG SOLVE TIME" value={PLAYER.stats.avgSpeed} sub="Per problem" icon={Clock} color="#00f5ff" />
      </div>

      {/* Main layout */}
      <div className={styles.mainLayout}>
        {/* Badges */}
        <motion.section
          className={styles.badgeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.sectionTitle}>
            <Award size={14} style={{ color: '#ff9500' }} />
            <span>ACHIEVEMENTS & BADGES</span>
          </div>
          <div className={styles.badgeGrid}>
            {PLAYER.badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                className={styles.badgeCard}
                style={{ '--b-color': RARITY_COLORS[badge.rarity] }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.05 }}
              >
                <div className={styles.badgeIcon}>{badge.icon}</div>
                <div className={styles.badgeName}>{badge.name}</div>
                <div className={styles.badgeRarity}>{badge.rarity.toUpperCase()}</div>
              </motion.div>
            ))}

            {/* Locked placeholder badges */}
            {[...Array(3)].map((_, i) => (
              <div key={`locked-${i}`} className={`${styles.badgeCard} ${styles.badgeLocked}`}>
                <div className={styles.badgeIcon}>?</div>
                <div className={styles.badgeName}>LOCKED</div>
                <div className={styles.badgeRarity}>???</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Rank progression */}
        <motion.section
          className={styles.rankSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.sectionTitle}>
            <Star size={14} style={{ color: 'var(--purple)' }} />
            <span>RANK PROGRESSION</span>
          </div>

          <div className={styles.rankList}>
            {RANKS.map((rank, i) => {
              const isCurrent = rank.name === PLAYER.rank
              const isPast = RANKS.findIndex(r => r.name === PLAYER.rank) > i
              return (
                <div key={rank.name} className={`${styles.rankRow} ${isCurrent ? styles.rankCurrent : ''} ${isPast ? styles.rankPast : ''}`}>
                  <div className={styles.rankDot} style={{
                    background: isPast || isCurrent ? rank.color : 'transparent',
                    borderColor: rank.color,
                    boxShadow: isCurrent ? `0 0 10px ${rank.color}` : 'none'
                  }} />
                  <div className={styles.rankInfo}>
                    <span className={styles.rankName} style={{ color: isPast || isCurrent ? rank.color : 'var(--text-muted)' }}>
                      {rank.name}
                    </span>
                    <span className={styles.rankXp}>{rank.minXp.toLocaleString()} XP</span>
                  </div>
                  {isCurrent && <div className={styles.rankCurrentTag}>CURRENT</div>}
                  {isPast && <div className={styles.rankDoneTag}>✓</div>}
                  {i < RANKS.length - 1 && <div className={styles.rankConnector} style={{ background: isPast ? rank.color : 'var(--border-subtle)' }} />}
                </div>
              )
            })}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
