import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import styles from './SolverWorkspace.module.css'

const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'Go']

const CHECKLIST = [
  { id: 'c1', label: 'Handles empty input'      },
  { id: 'c2', label: 'Handles max constraints'   },
  { id: 'c3', label: 'Handles duplicate values'  },
  { id: 'c4', label: 'Handles negative numbers'  },
  { id: 'c5', label: 'Returns correct type'      },
]

export default function SolverWorkspace({ solverCode, battleStatus, onCodeChange, onSubmitSolution }) {
  const [selectedLang, setSelectedLang] = useState('JavaScript')
  const [checked, setChecked] = useState({})
  const isSubmitted = battleStatus === 'judging'

  const lines = solverCode.split('\n')
  const checkCount = Object.values(checked).filter(Boolean).length

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className={styles.workspace}>
      {/* Header */}
      <div className={styles.wsHeader}>
        <div className={styles.roleTag}>⌨ SOLVER WORKSPACE</div>
        {/* Language selector mock */}
        {/* TODO: Replace with Monaco Editor language switcher */}
        <div className={styles.langSelector}>
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              className={`${styles.langBtn} ${selectedLang === lang ? styles.langActive : ''}`}
              onClick={() => setSelectedLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code editor */}
      {/* TODO: Replace mock code editor with Monaco/Yjs collaborative editor */}
      <div className={styles.editor}>
        <div className={styles.editorTopBar}>
          <div className={styles.editorDots}>
            {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
              <div key={c} style={{ width:9,height:9,borderRadius:'50%',background:c,opacity:0.7 }} />
            ))}
          </div>
          <div className={styles.fileName}>solution.{selectedLang === 'JavaScript' ? 'js' : selectedLang === 'Python' ? 'py' : 'txt'}</div>
          {isSubmitted && <div className={styles.submittedTag}>SUBMITTED</div>}
        </div>
        <div className={styles.editorBody}>
          <div className={styles.lineNums} aria-hidden>
            {lines.map((_, i) => <div key={i} className={styles.lineNum}>{i + 1}</div>)}
          </div>
          <textarea
            className={styles.codeArea}
            value={solverCode}
            onChange={e => onCodeChange(e.target.value)}
            readOnly={isSubmitted}
            spellCheck={false}
            rows={Math.max(lines.length, 18)}
          />
        </div>
      </div>

      {/* Defensive checklist */}
      <div className={styles.checklist}>
        <div className={styles.checklistHeader}>
          <div className={styles.checklistLabel}>DEFENSIVE CODING CHECKLIST</div>
          <div className={styles.checklistCount} style={{ color: checkCount === CHECKLIST.length ? '#00ff88' : 'var(--text-muted)' }}>
            {checkCount}/{CHECKLIST.length}
          </div>
        </div>
        <div className={styles.checkItems}>
          {CHECKLIST.map(item => (
            <button
              key={item.id}
              className={`${styles.checkItem} ${checked[item.id] ? styles.checkItemDone : ''}`}
              onClick={() => toggleCheck(item.id)}
            >
              {checked[item.id]
                ? <CheckCircle2 size={12} style={{ color: '#00ff88' }} />
                : <Circle size={12} style={{ color: 'var(--text-muted)' }} />
              }
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className={styles.actions}>
        <div className={styles.codeStats}>
          <span>{lines.length} lines</span>
          <span>·</span>
          <span>{solverCode.length} chars</span>
        </div>
        <button
          className={`${styles.submitBtn} ${isSubmitted ? styles.submitDone : ''}`}
          onClick={onSubmitSolution}
          disabled={isSubmitted}
        >
          {isSubmitted ? '✓ SOLUTION SUBMITTED' : '⬆ SUBMIT SOLUTION'}
        </button>
      </div>
    </div>
  )
}
