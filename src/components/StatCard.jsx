import { motion } from 'framer-motion'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, sub, icon: Icon, color = '#00f5ff', trend, className = '' }) {
  return (
    <motion.div
      className={`${styles.card} ${className}`}
      style={{ '--card-color': color }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.topLine} />
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {Icon && (
          <div className={styles.iconWrap}>
            <Icon size={16} style={{ color }} />
          </div>
        )}
      </div>
      <div className={styles.value} style={{ color }}>
        {value}
      </div>
      {(sub || trend !== undefined) && (
        <div className={styles.footer}>
          {sub && <span className={styles.sub}>{sub}</span>}
          {trend !== undefined && (
            <span className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
