import { motion, AnimatePresence } from 'framer-motion'
import { Play, CheckCircle2, XCircle, Send } from 'lucide-react'
import styles from './TesterPanel.module.css'

export default function TesterPanel({
  testCases, testResults, currentUserRole, missionStage,
  onTestCaseChange, onRunTests, onSubmitForAnalysis,
}) {
  const isTester = currentUserRole === 'TESTER'
  const canRunTests = isTester && (missionStage === 'TESTING' || missionStage === 'CODE' || missionStage === 'VETOED')
  const canSubmit = isTester && testResults && testResults.failed === 0 && missionStage === 'TESTING'

  return (
    <div className={styles.panel}>
      {!isTester && (
        <div className={styles.gateNotice}>
          <span>👁</span>
          Viewing as <strong>{currentUserRole}</strong> — test cases are read-only
        </div>
      )}

      {/* Test case editor */}
      <div className={styles.editorSection}>
        <div className={styles.editorHeader}>
          <div className={styles.editorDots}>
            <div style={{ width:10,height:10,borderRadius:'50%',background:'#ff5f56',opacity:0.7 }} />
            <div style={{ width:10,height:10,borderRadius:'50%',background:'#ffbd2e',opacity:0.7 }} />
            <div style={{ width:10,height:10,borderRadius:'50%',background:'#27c93f',opacity:0.7 }} />
          </div>
          <div className={styles.editorTitle}>tests.js</div>
          {!isTester && <div className={styles.readOnlyTag}>READ ONLY</div>}
        </div>

        <textarea
          className={styles.testArea}
          value={testCases}
          onChange={e => isTester && onTestCaseChange(e.target.value)}
          readOnly={!isTester}
          spellCheck={false}
          rows={16}
        />
      </div>

      {/* Results */}
      <AnimatePresence>
        {testResults && (
          <motion.div
            className={styles.results}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.resultsSummary}>
              <div className={styles.summaryLabel}>TEST RESULTS</div>
              <div className={styles.summaryStats}>
                <span className={styles.passed}>
                  <CheckCircle2 size={12} />
                  {testResults.passed} passed
                </span>
                <span className={testResults.failed > 0 ? styles.failed : styles.passed}>
                  <XCircle size={12} />
                  {testResults.failed} failed
                </span>
                <span className={styles.total}>/ {testResults.total} total</span>
              </div>
            </div>

            <div className={styles.caseList}>
              {testResults.cases.map((c, i) => (
                <div
                  key={i}
                  className={`${styles.caseRow} ${c.passed ? styles.casePassed : styles.caseFailed}`}
                >
                  <div className={styles.caseIcon}>
                    {c.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  </div>
                  <div className={styles.caseLabel}>{c.label}</div>
                  {!c.passed && (
                    <div className={styles.caseError}>
                      got <code>{c.output}</code> · expected <code>{c.expected}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tester actions */}
      {isTester && (
        <div className={styles.actions}>
          <button
            className={`${styles.runBtn} ${!canRunTests ? styles.btnDisabled : ''}`}
            onClick={onRunTests}
            disabled={!canRunTests}
          >
            <Play size={13} />
            RUN TESTS
            {/* TODO: Replace with API call to code execution engine */}
          </button>

          {testResults && testResults.failed === 0 && (
            <motion.button
              className={`${styles.submitBtn} ${!canSubmit ? styles.btnDisabled : ''}`}
              onClick={onSubmitForAnalysis}
              disabled={!canSubmit}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Send size={13} />
              SEND TO ANALYST
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}
