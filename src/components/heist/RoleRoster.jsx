import { motion } from 'framer-motion'
import styles from './RoleRoster.module.css'

const ROLE_PERMS = {
  BUILDER: ['Edit solution code', 'Request testing'],
  TESTER:  ['Write test cases', 'Run tests', 'Flag bugs'],
  ANALYST: ['Review complexity', 'Approve / Veto'],
}

const STATUS_COLORS = {
  CODING:    '#00f5ff',
  TESTING:   '#ff9500',
  REVIEWING: '#a855f7',
  READY:     '#00ff88',
  WAITING:   '#4a5275',
  DONE:      '#00ff88',
}

export default function RoleRoster({ teamPresence, currentUserRole, onRoleSwitch }) {
  return (
    <div className={styles.roster}>
      <div className={styles.label}>OPERATIVE ROSTER</div>
      <div className={styles.cards}>
        {teamPresence.map((member, i) => {
          const isYou = member.role === currentUserRole
          const statusColor = STATUS_COLORS[member.status] || '#4a5275'

          return (
            <motion.div
              key={member.id}
              className={`${styles.card} ${isYou ? styles.cardActive : ''}`}
              style={{ '--role-color': member.color }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onRoleSwitch(member.role)}
              title={`Switch to ${member.role} view`}
            >
              {/* Online indicator */}
              <div
                className={styles.onlineDot}
                style={{
                  background: member.online ? '#00ff88' : '#4a5275',
                  boxShadow: member.online ? '0 0 6px #00ff88' : 'none',
                }}
              />

              {/* Avatar */}
              <div className={styles.avatar} style={{ borderColor: member.color }}>
                <span>{member.name[0]}</span>
                {/* TODO: Replace with actual user avatar from API */}
              </div>

              {/* Info */}
              <div className={styles.info}>
                <div className={styles.name}>{member.name}</div>
                <div className={styles.roleBadge} style={{ color: member.color }}>
                  {member.role}
                </div>
                <div className={styles.statusRow}>
                  <div
                    className={styles.statusDot}
                    style={{ background: statusColor, boxShadow: `0 0 5px ${statusColor}` }}
                  />
                  <span style={{ color: statusColor }}>{member.status}</span>
                </div>
              </div>

              {/* Permissions */}
              <div className={styles.perms}>
                {ROLE_PERMS[member.role]?.map((p, j) => (
                  <div key={j} className={styles.permItem}>
                    <span className={styles.permDot} />
                    {p}
                  </div>
                ))}
              </div>

              {isYou && <div className={styles.youBadge}>YOU</div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
