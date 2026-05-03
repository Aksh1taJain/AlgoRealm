import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './CorruptorWorkspace.module.css'

const ATTACK_CATEGORIES = [
  { id: 'empty',    label: 'Empty input',          snippet: '// Empty: twoSum([], 9)' },
  { id: 'large',    label: 'Very large input',      snippet: '// Large: twoSum(Array(10000).fill(1), 2)' },
  { id: 'dupes',    label: 'Duplicate values',      snippet: '// Dupes: twoSum([3,3], 6)' },
  { id: 'negative', label: 'Negative numbers',      snippet: '// Negative: twoSum([-3,-2,1], -5)' },
  { id: 'boundary', label: 'Boundary values',       snippet: '// Boundary: twoSum([0,0], 0)' },
  { id: 'nosol',    label: 'No solution exists',    snippet: '// NoSol: twoSum([1,2,3], 99)' },
  { id: 'sorted',   label: 'Already sorted',        snippet: '// Sorted: twoSum([1,2,3,4,5], 9)' },
  { id: 'reverse',  label: 'Reverse sorted',        snippet: '// Reverse: twoSum([5,4,3,2,1], 9)' },
]

function formatTimer(s) {
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
}

export default function CorruptorWorkspace({ testCases, timer, battleStatus, onTestChange, onSubmitAttacks }) {
  const isSubmitted = battleStatus === 'judging'
  const timerCritical = timer !== null && timer <= 15

  const appendSnippet = (snippet) => {
    onTestChange(testCases + '\n  ' + snippet + ',')
  }

  return (
    <div className={styles.workspace}>
      {/* Header */}
      <div className={styles.wsHeader}>
        <div className={styles.roleTag}>⚔ CORRUPTOR WORKSPACE</div>
        {timer !== null && (
          <div className={`${styles.timerBlock} ${timerCritical ? styles.timerCritical : ''}`}>
            <div className={styles.timerLabel}>ATTACK WINDOW</div>
            <div className={styles.timerValue}>{formatTimer(timer)}</div>
          </div>
        )}
      </div>

      {/* Attack category buttons */}
      <div className={styles.categories}>
        <div className={styles.catLabel}>QUICK ATTACK VECTORS</div>
        <div className={styles.catGrid}>
          {ATTACK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={styles.catBtn}
              onClick={() => !isSubmitted && appendSnippet(cat.snippet)}
              disabled={isSubmitted}
              title={`Insert: ${cat.snippet}`}
            >
              + {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test editor */}
      <div className={styles.editor}>
        <div className={styles.editorTopBar}>
          <div className={styles.editorDots}>
            {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
              <div key={c} style={{width:9,height:9,borderRadius:'50%',background:c,opacity:0.7}} />
            ))}
          </div>
          <div className={styles.fileName}>attacks.js</div>
          {isSubmitted && <div className={styles.submittedTag}>ATTACKS SENT</div>}
        </div>
        {/* TODO: Replace mock code editor with Monaco/Yjs collaborative editor */}
        <textarea
          className={styles.codeArea}
          value={testCases}
          onChange={e => onTestChange(e.target.value)}
          readOnly={isSubmitted}
          spellCheck={false}
          rows={14}
          placeholder="// Write edge cases to break the Solver's code..."
        />
      </div>

      {/* Submit */}
      <div className={styles.actions}>
        <div className={styles.hint}>
          {isSubmitted
            ? '✓ Attacks submitted — awaiting AI referee'
            : 'Craft edge cases. One good attack can win the round.'}
        </div>
        <button
          className={`${styles.attackBtn} ${isSubmitted ? styles.attackDone : ''}`}
          onClick={onSubmitAttacks}
          disabled={isSubmitted}
        >
          {isSubmitted ? '✓ ATTACKS SENT' : '⚔ SUBMIT ATTACKS'}
          {/* TODO: Replace with API call: POST /api/arena/room/:roomId/submit-attacks */}
        </button>
      </div>
    </div>
  )
}
