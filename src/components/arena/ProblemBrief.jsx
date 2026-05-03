import styles from './ProblemBrief.module.css'

const DIFF_COLOR = { EASY: '#00ff88', MEDIUM: '#ff9500', HARD: '#ff3366', EXTREME: '#a855f7' }

export default function ProblemBrief({ problem }) {
  if (!problem) return null
  return (
    <div className={styles.brief}>
      <div className={styles.header}>
        <div className={styles.tags}>
          {problem.tags?.map(t => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
        <div className={styles.diff} style={{ color: DIFF_COLOR[problem.difficulty] }}>
          {problem.difficulty}
        </div>
      </div>

      <h2 className={styles.title}>{problem.title}</h2>
      <p className={styles.statement}>{problem.statement}</p>

      {problem.examples?.slice(0, 2).map((ex, i) => (
        <div key={i} className={styles.example}>
          <div className={styles.exLabel}>EXAMPLE {i + 1}</div>
          <div className={styles.exCode}>
            <div><span className={styles.exKey}>Input:</span>  {ex.input}</div>
            <div><span className={styles.exKey}>Output:</span> {ex.output}</div>
            {ex.note && <div className={styles.exNote}>{ex.note}</div>}
          </div>
        </div>
      ))}

      <div className={styles.constraints}>
        <div className={styles.constraintLabel}>CONSTRAINTS</div>
        {problem.constraints?.map((c, i) => (
          <div key={i} className={styles.constraintItem}>
            <span className={styles.constraintDot} />
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}
