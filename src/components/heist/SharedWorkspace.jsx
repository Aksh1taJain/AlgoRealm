import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BuilderPanel from './BuilderPanel'
import TesterPanel from './TesterPanel'
import AnalystPanel from './AnalystPanel'
import TeamChat from './TeamChat'
import styles from './SharedWorkspace.module.css'

const TABS = [
  { id: 'PROBLEM',    label: 'Problem'   },
  { id: 'SOLUTION',   label: 'Solution'  },
  { id: 'TESTS',      label: 'Tests'     },
  { id: 'COMPLEXITY', label: 'Analysis'  },
  { id: 'CHAT',       label: 'Chat'      },
]

const ROLE_TAB_MAP = {
  BUILDER: 'SOLUTION',
  TESTER:  'TESTS',
  ANALYST: 'COMPLEXITY',
}

export default function SharedWorkspace(props) {
  const {
    currentUserRole, teamPresence, missionStage,
    solutionCode, testCases, testResults,
    complexityReview, approvalStatus, vetoReason,
    chatMessages, mission,
    handleCodeChange, handleRequestTesting,
    handleTestCaseChange, handleRunTests, handleSubmitForAnalysis,
    handleComplexityChange, handleApproveComplexity, handleVetoSubmission,
    handleResetAfterVeto, handleSendChat,
  } = props

  const [activeTab, setActiveTab] = useState(ROLE_TAB_MAP[currentUserRole] || 'PROBLEM')

  // Auto-switch tab when role changes
  const handleTabSwitch = (tabId) => setActiveTab(tabId)

  // Presence indicators per tab
  const presenceForTab = (tabId) => {
    if (tabId === 'SOLUTION') return teamPresence.filter(m => m.role === 'BUILDER' && m.online)
    if (tabId === 'TESTS')    return teamPresence.filter(m => m.role === 'TESTER'  && m.online)
    if (tabId === 'COMPLEXITY') return teamPresence.filter(m => m.role === 'ANALYST' && m.online)
    return []
  }

  return (
    <div className={styles.workspace}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          {TABS.map(tab => {
            const presence = presenceForTab(tab.id)
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => handleTabSwitch(tab.id)}
              >
                {tab.label}
                {presence.length > 0 && (
                  <div className={styles.presenceGroup}>
                    {presence.map(m => (
                      <div
                        key={m.id}
                        className={styles.presenceDot}
                        style={{ background: m.color, boxShadow: `0 0 5px ${m.color}` }}
                        title={`${m.name} is here`}
                      />
                    ))}
                  </div>
                )}
                {/* Unread indicator for chat */}
                {tab.id === 'CHAT' && activeTab !== 'CHAT' && (
                  <div className={styles.unreadDot} />
                )}
              </button>
            )
          })}
        </div>

        {/* Current role badge */}
        <div className={styles.currentRoleBadge}>
          <span className={styles.roleLabel}>VIEWING AS</span>
          <span className={`${styles.roleValue} ${styles[`role_${currentUserRole}`]}`}>
            {currentUserRole}
          </span>
        </div>
      </div>

      {/* Tab content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={styles.tabContent}
          >
            {activeTab === 'PROBLEM' && (
              <ProblemView mission={mission} />
            )}

            {activeTab === 'SOLUTION' && (
              <BuilderPanel
                solutionCode={solutionCode}
                currentUserRole={currentUserRole}
                missionStage={missionStage}
                teamPresence={teamPresence}
                onCodeChange={handleCodeChange}
                onRequestTesting={handleRequestTesting}
              />
            )}

            {activeTab === 'TESTS' && (
              <TesterPanel
                testCases={testCases}
                testResults={testResults}
                currentUserRole={currentUserRole}
                missionStage={missionStage}
                onTestCaseChange={handleTestCaseChange}
                onRunTests={handleRunTests}
                onSubmitForAnalysis={handleSubmitForAnalysis}
              />
            )}

            {activeTab === 'COMPLEXITY' && (
              <AnalystPanel
                complexityReview={complexityReview}
                approvalStatus={approvalStatus}
                vetoReason={vetoReason}
                currentUserRole={currentUserRole}
                missionStage={missionStage}
                testResults={testResults}
                onComplexityChange={handleComplexityChange}
                onApprove={handleApproveComplexity}
                onVeto={handleVetoSubmission}
                onReset={handleResetAfterVeto}
              />
            )}

            {activeTab === 'CHAT' && (
              <TeamChat
                messages={chatMessages}
                teamPresence={teamPresence}
                currentUserRole={currentUserRole}
                onSend={handleSendChat}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Problem view ─────────────────────────────────────────────────────────────
function ProblemView({ mission }) {
  return (
    <div className={styles.problemView}>
      <div className={styles.problemHeader}>
        <div className={styles.problemTag}>ALGORITHM CHALLENGE</div>
        <h2 className={styles.problemTitle}>{mission.name}</h2>
      </div>

      <div className={styles.problemBody}>
        <p className={styles.problemDesc}>{mission.description}</p>

        <div className={styles.problemSection}>
          <div className={styles.sectionLabel}>OBJECTIVE</div>
          <div className={styles.codeBlock}>
{`// Given a sorted array that has been rotated at some pivot,
// find the minimum element in O(log n) time.
//
// Example 1:
//   Input:  [3, 4, 5, 1, 2]
//   Output: 1
//
// Example 2:
//   Input:  [4, 5, 6, 7, 0, 1, 2]
//   Output: 0
//
// Constraints:
//   - n == nums.length
//   - 1 <= n <= 5000
//   - -5000 <= nums[i] <= 5000
//   - All integers are unique
//   - Array was sorted then rotated 1 to n times`}
          </div>
        </div>

        <div className={styles.constraintRow}>
          <div className={styles.constraint}>
            <div className={styles.constraintLabel}>TIME LIMIT</div>
            <div className={styles.constraintValue}>O(log n)</div>
          </div>
          <div className={styles.constraint}>
            <div className={styles.constraintLabel}>SPACE LIMIT</div>
            <div className={styles.constraintValue}>O(1)</div>
          </div>
          <div className={styles.constraint}>
            <div className={styles.constraintLabel}>DIFFICULTY</div>
            <div className={styles.constraintValue} style={{ color: '#ff3366' }}>EXTREME</div>
          </div>
        </div>
      </div>
    </div>
  )
}
