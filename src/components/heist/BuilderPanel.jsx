import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Send } from 'lucide-react'
import styles from './BuilderPanel.module.css'

// ─── CodeEditorMock ───────────────────────────────────────────────────────────
// Monospace textarea with line numbers and presence cursors
// TODO: Replace with Monaco Editor or CodeMirror when integrating backend

function CodeEditorMock({ value, onChange, readOnly, presenceUsers }) {
  const lines = value.split('\n')

  return (
    <div className={styles.editorContainer}>
      {/* Header bar */}
      <div className={styles.editorHeader}>
        <div className={styles.editorDots}>
          <div className={styles.dot} style={{ background: '#ff5f56' }} />
          <div className={styles.dot} style={{ background: '#ffbd2e' }} />
          <div className={styles.dot} style={{ background: '#27c93f' }} />
        </div>
        <div className={styles.editorTitle}>solution.js</div>
        {presenceUsers?.map(u => (
          <div
            key={u.id}
            className={styles.presenceCursor}
            style={{ borderColor: u.color, color: u.color }}
          >
            {u.name.split('_')[0]}
          </div>
        ))}
        {readOnly && <div className={styles.readOnlyTag}>READ ONLY</div>}
      </div>

      {/* Editor body */}
      <div className={styles.editorBody}>
        {/* Line numbers */}
        <div className={styles.lineNumbers} aria-hidden>
          {lines.map((_, i) => (
            <div key={i} className={styles.lineNum}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          className={styles.codeArea}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          rows={Math.max(lines.length, 20)}
        />
      </div>
    </div>
  )
}

// ─── BuilderPanel ────────────────────────────────────────────────────────────

export default function BuilderPanel({
  solutionCode, currentUserRole, missionStage,
  teamPresence, onCodeChange, onRequestTesting,
}) {
  const isBuilder = currentUserRole === 'BUILDER'
  const canRequestTesting = missionStage === 'CODE' && isBuilder
  const isWaiting = missionStage === 'TESTING' || missionStage === 'ANALYSIS'

  // Presence: show who's viewing this file
  const viewers = teamPresence.filter(m => m.online && m.role !== 'BUILDER')

  return (
    <div className={styles.panel}>
      {/* Role gate notice for non-builders */}
      {!isBuilder && (
        <div className={styles.gateNotice}>
          <span>👁</span>
          You are viewing as <strong>{currentUserRole}</strong> — solution code is read-only
        </div>
      )}

      <CodeEditorMock
        value={solutionCode}
        onChange={isBuilder ? onCodeChange : undefined}
        readOnly={!isBuilder}
        presenceUsers={viewers}
      />

      {/* Builder actions */}
      {isBuilder && (
        <div className={styles.actions}>
          {missionStage === 'VETOED' && (
            <motion.div
              className={styles.vetoWarning}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠ Analyst vetoed. Revise your solution and resubmit.
            </motion.div>
          )}

          <div className={styles.actionRow}>
            <div className={styles.editorHints}>
              <span>{solutionCode.split('\n').length} lines</span>
              <span>·</span>
              <span>{solutionCode.length} chars</span>
            </div>
            <button
              className={`${styles.requestBtn} ${!canRequestTesting ? styles.btnDisabled : ''}`}
              onClick={onRequestTesting}
              disabled={!canRequestTesting}
              title={isWaiting ? 'Testing already in progress' : 'Submit code for testing'}
            >
              {isWaiting ? (
                <>
                  <span className={styles.waitSpinner} />
                  AWAITING TESTER
                </>
              ) : (
                <>
                  <Send size={13} />
                  REQUEST TESTING
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
