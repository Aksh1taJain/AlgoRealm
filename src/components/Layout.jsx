import { useState } from 'react'
import TopBar from './TopBar'
import SidePanel from './SidePanel'
import BottomNav from './BottomNav'
import styles from './Layout.module.css'

export default function Layout({ children, showReward }) {
  const [sideOpen, setSideOpen] = useState(false)

  return (
    <div className={styles.root}>
      <TopBar onMenuToggle={() => setSideOpen(v => !v)} />
      <SidePanel open={sideOpen} onClose={() => setSideOpen(false)} />

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      <BottomNav />

      {/* Overlay for mobile sidebar */}
      {sideOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSideOpen(false)}
        />
      )}
    </div>
  )
}
