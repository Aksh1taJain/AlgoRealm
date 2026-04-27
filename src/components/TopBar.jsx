import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Menu, Zap, Hexagon, ChevronDown } from 'lucide-react'
import { PLAYER, NOTIFICATIONS } from '../data/mockData'
import styles from './TopBar.module.css'

export default function TopBar({ onMenuToggle }) {
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = NOTIFICATIONS.filter(n => !n.read).length

  const pageName = location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'

  return (
    <header className={styles.topbar}>
      {/* Left */}
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <Link to="/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Hexagon size={22} className={styles.hexIcon} />
            <span className={styles.hexInner}>A</span>
          </div>
          <span className={styles.logoText}>ALGO<span className={styles.logoAccent}>REALM</span></span>
        </Link>
        <div className={styles.breadcrumb}>
          <span className={styles.separator}>/</span>
          <span className={styles.pageName}>{pageName}</span>
        </div>
      </div>

      {/* Center — streak & status */}
      <div className={styles.center}>
        <div className={styles.statusChip}>
          <span className={styles.statusDot} />
          <span>ONLINE</span>
        </div>
        <div className={styles.streakChip}>
          <Zap size={13} className={styles.zapIcon} />
          <span>{PLAYER.streak} DAY STREAK</span>
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {/* Currency */}
        <div className={styles.currencies}>
          <div className={styles.currencyItem}>
            <span className={styles.currencySymbol} style={{ color: 'var(--cyan)' }}>◈</span>
            <span>{PLAYER.coins.toLocaleString()}</span>
          </div>
          <div className={styles.currencyItem}>
            <span className={styles.currencySymbol} style={{ color: 'var(--purple)' }}>⬡</span>
            <span>{PLAYER.fragments}</span>
          </div>
        </div>

        {/* Notifications */}
        <div className={styles.notifWrapper}>
          <button
            className={styles.notifBtn}
            onClick={() => setNotifOpen(v => !v)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && <span className={styles.badge}>{unread}</span>}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className={styles.notifDropdown}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <div className={styles.notifHeader}>
                  <span>TRANSMISSIONS</span>
                  <span className={styles.notifCount}>{unread} NEW</span>
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}>
                    <span className={styles.notifType}>{n.type.toUpperCase()}</span>
                    <span className={styles.notifMsg}>{n.message}</span>
                    <span className={styles.notifTime}>{n.time}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player */}
        <Link to="/profile" className={styles.playerChip}>
          <div className={styles.playerAvatar}>
            <span>{PLAYER.username[0]}</span>
          </div>
          <div className={styles.playerInfo}>
            <span className={styles.playerName}>{PLAYER.username}</span>
            <span className={styles.playerRank}>{PLAYER.rank}</span>
          </div>
          <ChevronDown size={12} className={styles.chevron} />
        </Link>
      </div>
    </header>
  )
}
