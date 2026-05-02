import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import styles from './AnalystPanel.module.css'

const TIME_OPTIONS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)']
const SPACE_OPTIONS = ['O(1)', 'O(log n)', 'O(n)', 'O(n²)']

const OPTIMAL_TIME  = new Set(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'])
const OPTIMAL_SPACE = new Set(['O(1)', 'O(log n)'])

export default function AnalystPanel({
  complexityReview, approvalStatus, vetoReason,
  currentUserRole, missionStage, testResults,
  onComplexityChange, onApprove, onVeto, onReset,
}) {
  const [vetoInput, setVetoInput] = useState('')
  const [showVetoForm, setShowVetoForm] = useState(false)

  const isAnalyst = currentUserRole === 'ANALYST'
  const canAct = isAnalyst && missionStage === 'ANALYSIS'
  const bothSelected = complexityReview.time && complexityReview.space
  const isOptimalTime = OPTIMAL_TIME.has(complexityReview.time)
  const isOptimalSpace = OPTIMAL_SPACE.has(complexityReview.space)

  const handleVetoSubmit = () => {
    if (!vetoInput.trim()) return
    onVeto(vetoInput.trim())
    setShowVetoForm(false)
    setVetoInput('')
    // TODO: Replace with API call: POST /api/heist/:id/veto { reason: vetoInput }
  }

  // Render completed state
  if (approvalStatus === 'APPROVED') {
    return (
      <div className={styles.panel}>
        <div className={styles.approvedBanner}>
          <CheckCircle2 size={22} />
          <div>
            <div className={styles.bannerTitle}>SOLUTION APPROVED</div>
            <div className={styles.bannerSub}>
              {complexityReview.time} time · {complexityReview.space} space
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (approvalStatus === 'VETOED') {
    return (
      <div className={styles.panel}>
        <div className={styles.vetoBanner}>
          <XCircle size={22} />
          <div>
            <div className={styles.bannerTitle}>SOLUTION VETOED</div>
            <div className={styles.bannerSub}>"{vetoReason}"</div>
          </div>
        </div>
        {isAnalyst && (
          <button className={styles.resetBtn} onClick={onReset}>
            ALLOW REVISION
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      {!isAnalyst && (
        <div className={styles.gateNotice}>
          <span>👁</span>
          Viewing as <strong>{currentUserRole}</strong> — Analyst has exclusive review rights
        </div>
      )}

      {/* Test results summary */}
      {testResults && (
        <div className={`${styles.testSummary} ${testResults.failed > 0 ? styles.testFail : styles.testPass}`}>
          {testResults.failed > 0 ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
          <span>Tests: {testResults.passed}/{testResults.total} passed</span>
        </div>
      )}

      {missionStage !== 'ANALYSIS' && isAnalyst && (
        <div className={styles.waitNotice}>
          Waiting for Builder + Tester to complete their phases…
        </div>
      )}

      {/* Complexity selectors */}
      <div className={styles.reviewSection}>
        <div className={styles.sectionLabel}>TIME COMPLEXITY</div>
        <div className={styles.optionGrid}>
          {TIME_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`${styles.optionBtn} ${complexityReview.time === opt ? styles.optionSelected : ''} ${
                complexityReview.time === opt && !isOptimalTime ? styles.optionBad : ''
              }`}
              onClick={() => canAct && onComplexityChange('time', opt)}
              disabled={!canAct}
            >
              {opt}
            </button>
          ))}
        </div>

        {complexityReview.time && (
          <motion.div
            className={`${styles.complexityHint} ${!isOptimalTime ? styles.hintWarn : styles.hintOk}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isOptimalTime
              ? `✓ ${complexityReview.time} is acceptable`
              : `⚠ ${complexityReview.time} exceeds mission constraints`}
          </motion.div>
        )}
      </div>

      <div className={styles.reviewSection}>
        <div className={styles.sectionLabel}>SPACE COMPLEXITY</div>
        <div className={styles.optionGrid}>
          {SPACE_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`${styles.optionBtn} ${complexityReview.space === opt ? styles.optionSelected : ''} ${
                complexityReview.space === opt && !isOptimalSpace ? styles.optionBad : ''
              }`}
              onClick={() => canAct && onComplexityChange('space', opt)}
              disabled={!canAct}
            >
              {opt}
            </button>
          ))}
        </div>

        {complexityReview.space && (
          <motion.div
            className={`${styles.complexityHint} ${!isOptimalSpace ? styles.hintWarn : styles.hintOk}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isOptimalSpace
              ? `✓ ${complexityReview.space} is optimal`
              : `⚠ ${complexityReview.space} may require revision`}
          </motion.div>
        )}
      </div>

      {/* Analyst notes */}
      {isAnalyst && (
        <div className={styles.reviewSection}>
          <div className={styles.sectionLabel}>REVIEW NOTES (optional)</div>
          <textarea
            className={styles.notesArea}
            placeholder="Add analysis notes..."
            value={complexityReview.notes}
            onChange={e => onComplexityChange('notes', e.target.value)}
            rows={3}
          />
        </div>
      )}

      {/* Actions */}
      {isAnalyst && canAct && (
        <div className={styles.actions}>
          <button
            className={`${styles.approveBtn} ${!bothSelected ? styles.btnDisabled : ''}`}
            onClick={onApprove}
            disabled={!bothSelected}
            title="Approve solution — initiates breach"
          >
            <CheckCircle2 size={14} />
            APPROVE SOLUTION
          </button>

          <button
            className={styles.vetoBtn}
            onClick={() => setShowVetoForm(v => !v)}
          >
            <XCircle size={14} />
            VETO
          </button>
        </div>
      )}

      {/* Veto form */}
      <AnimatePresence>
        {showVetoForm && (
          <motion.div
            className={styles.vetoForm}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.vetoLabel}>VETO REASON</div>
            <input
              className={styles.vetoInput}
              placeholder="e.g. O(n²) exceeds constraints, requires O(log n)"
              value={vetoInput}
              onChange={e => setVetoInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVetoSubmit()}
              autoFocus
            />
            <button
              className={`${styles.vetoConfirm} ${!vetoInput.trim() ? styles.btnDisabled : ''}`}
              onClick={handleVetoSubmit}
              disabled={!vetoInput.trim()}
            >
              CONFIRM VETO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
