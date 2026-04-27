import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Globe, Swords, ShieldAlert, Trophy } from 'lucide-react'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'HOME', icon: LayoutDashboard },
  { path: '/world', label: 'WORLD', icon: Globe },
  { path: '/arena', label: 'ARENA', icon: Swords },
  { path: '/heist', label: 'HEIST', icon: ShieldAlert },
  { path: '/leaderboard', label: 'RANKS', icon: Trophy },
]

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={20} className={styles.icon} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
