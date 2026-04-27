import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Globe, BookOpen, Swords,
  ShieldAlert, Trophy, User, X, Cpu
} from 'lucide-react'
import { PLAYER } from '../data/mockData'
import styles from './SidePanel.module.css'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard, accent: 'cyan' },
  { path: '/world', label: 'WORLD MAP', icon: Globe, accent: 'cyan' },
  { path: '/practice', label: 'PRACTICE', icon: BookOpen, accent: 'purple' },
  { path: '/arena', label: 'ARENA', icon: Swords, accent: 'red' },
  { path: '/heist', label: 'HEIST', icon: ShieldAlert, accent: 'orange' },
  { path: '/leaderboard', label: 'LEADERBOARD', icon: Trophy, accent: 'purple' },
  { path: '/profile', label: 'PROFILE', icon: User, accent: 'cyan' },
]

const ACCENT_COLORS = {
  cyan: '#00f5ff',
  purple: '#a855f7',
  red: '#ff3366',
  orange: '#ff9500',
}

export default function SidePanel({ open, onClose }) {
  const xpPercent = Math.round((PLAYER.xp / PLAYER.xpToNext) * 100)

  return (
    <>
      {/* Desktop sidebar (always visible) */}
      <aside className={styles.sidebar}>
        <SideContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className={`${styles.sidebar} ${styles.drawer}`}
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
            <SideContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function SideContent() {
  const xpPercent = Math.round((PLAYER.xp / PLAYER.xpToNext) * 100)

  return (
    <div className={styles.inner}>
      {/* Player mini card */}
      <div className={styles.playerCard}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            <span>{PLAYER.username[0]}</span>
          </div>
          <div className={styles.levelBadge}>Lv{PLAYER.level}</div>
        </div>
        <div className={styles.playerMeta}>
          <div className={styles.playerName}>{PLAYER.username}</div>
          <div className={styles.playerFaction}>{PLAYER.faction}</div>
          <div className={styles.xpBar}>
            <div
              className={styles.xpFill}
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className={styles.xpText}>
            <span>{PLAYER.xp.toLocaleString()}</span>
            <span className={styles.xpMax}>/ {PLAYER.xpToNext.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navLabel}>NAVIGATION</div>
        {NAV_ITEMS.map(({ path, label, icon: Icon, accent }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navActive : ''}`
            }
            style={({ isActive }) => ({
              '--item-accent': ACCENT_COLORS[accent],
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    className={styles.navBg}
                    layoutId="nav-bg"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon size={16} className={styles.navIcon} />
                <span className={styles.navLabel2}>{label}</span>
                {isActive && <div className={styles.navAccent} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System status */}
      <div className={styles.systemStatus}>
        <div className={styles.sysHeader}>
          <Cpu size={12} />
          <span>SYSTEM STATUS</span>
        </div>
        <div className={styles.sysRow}>
          <span>CORE</span>
          <div className={styles.sysBar}>
            <div className={styles.sysFill} style={{ width: '72%', background: 'var(--cyan)' }} />
          </div>
          <span>72%</span>
        </div>
        <div className={styles.sysRow}>
          <span>MEMORY</span>
          <div className={styles.sysBar}>
            <div className={styles.sysFill} style={{ width: '45%', background: 'var(--purple)' }} />
          </div>
          <span>45%</span>
        </div>
        <div className={styles.sysRow}>
          <span>SIGNAL</span>
          <div className={styles.sysBar}>
            <div className={styles.sysFill} style={{ width: '91%', background: '#00ff88' }} />
          </div>
          <span>91%</span>
        </div>
      </div>

      {/* Version tag */}
      <div className={styles.version}>
        <span>ALGOREALM</span>
        <span className={styles.versionNum}>v2.4.1-CORRUPTED</span>
      </div>
    </div>
  )
}
