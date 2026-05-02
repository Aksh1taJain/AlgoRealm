import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeistHeader from "../components/heist/HeistHeader";
import RoleRoster from "../components/heist/RoleRoster";
import HeistPipeline from "../components/heist/HeistPipeline";
import SharedWorkspace from "../components/heist/SharedWorkspace";
import BuilderPanel from "../components/heist/BuilderPanel";
import TesterPanel from "../components/heist/TesterPanel";
import AnalystPanel from "../components/heist/AnalystPanel";
import ActivityFeed from "../components/heist/ActivityFeed";
import TeamChat from "../components/heist/TeamChat";
import { HEIST_ACTIVE_MISSION } from '../data/mockData'
import styles from './Heist.module.css'

// ─── useHeistState custom hook ─────────────────────────────────────────────
// Centralizes all mission state so every sub-component receives props, not
// scattered useState calls. Replace internals with WebSocket/API later.

export function useHeistState() {
  const [missionStage, setMissionStage] = useState('CODE') // CODE | TESTING | ANALYSIS | BREACH | VETOED
  const [currentUserRole, setCurrentUserRole] = useState('BUILDER') // BUILDER | TESTER | ANALYST
  const [approvalStatus, setApprovalStatus] = useState('PENDING') // PENDING | APPROVED | VETOED

  const [solutionCode, setSolutionCode] = useState(
    `// Operation: Deep Freeze - Solution Slot
// Builder: CIPHER_WRAITH
// Status: IN PROGRESS

function findMinimumInRotatedArray(nums) {
  // TODO: Implement O(log n) binary search solution
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return nums[left];
}`
  )

  const [testCases, setTestCases] = useState(
    `// Tester: GHOST_V0ID
// Test Suite v1.2

const tests = [
  { input: [3,4,5,1,2],   expected: 1, label: "Standard rotation" },
  { input: [4,5,6,7,0,1,2], expected: 0, label: "Larger array"     },
  { input: [1],            expected: 1, label: "Single element"    },
  { input: [2,1],          expected: 1, label: "Two elements"      },
  // TODO: Add edge case for duplicates
];`
  )

  const [testResults, setTestResults] = useState(null)
  // testResults shape: { passed: number, failed: number, total: number, cases: [...] }

  const [complexityReview, setComplexityReview] = useState({
    time: null,   // e.g. 'O(log n)'
    space: null,  // e.g. 'O(1)'
    notes: '',
  })

  const [vetoReason, setVetoReason] = useState('')

  const [teamPresence, setTeamPresence] = useState([
    { id: 'usr_1', name: 'CIPHER_WRAITH', role: 'BUILDER', status: 'CODING',    color: '#00f5ff', online: true  },
    { id: 'usr_2', name: 'GHOST_V0ID',    role: 'TESTER',  status: 'READY',     color: '#00ff88', online: true  },
    { id: 'usr_3', name: 'NULL_BYTE',     role: 'ANALYST', status: 'REVIEWING', color: '#a855f7', online: false },
  ])

  const [activityLog, setActivityLog] = useState([
    { id: 'a1', user: 'CIPHER_WRAITH', role: 'BUILDER', action: 'started coding the solution', ts: '4m ago',  color: '#00f5ff' },
    { id: 'a2', user: 'GHOST_V0ID',    role: 'TESTER',  action: 'added 4 test cases',          ts: '2m ago',  color: '#00ff88' },
    { id: 'a3', user: 'NULL_BYTE',     role: 'ANALYST', action: 'joined the mission',           ts: '1m ago',  color: '#a855f7' },
  ])

  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', user: 'GHOST_V0ID',    role: 'TESTER',  text: 'Ready to run tests when you are.', ts: '3m ago', color: '#00ff88' },
    { id: 'c2', user: 'CIPHER_WRAITH', role: 'BUILDER', text: 'Almost done — refactoring the loop.', ts: '2m ago', color: '#00f5ff' },
    { id: 'c3', user: 'NULL_BYTE',     role: 'ANALYST', text: 'Make sure it\'s not O(n²). We need log n.', ts: '1m ago', color: '#a855f7' },
  ])

  const [fortressHealth, setFortressHealth] = useState(100)
  const [missionTimer, setMissionTimer] = useState(4 * 60 * 60 + 22 * 60) // seconds
  const activityIdRef = useRef(10)
  const chatIdRef = useRef(10)

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTimer(t => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ── Helper: push to activity log ─────────────────────────────────────────
  const logActivity = useCallback((user, role, action, color) => {
    const id = `a${++activityIdRef.current}`
    setActivityLog(prev => [{ id, user, role, action, ts: 'just now', color }, ...prev].slice(0, 20))
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────────────

  // Builder: update solution code
  const handleCodeChange = useCallback((newCode) => {
    setSolutionCode(newCode)
    // TODO: Replace with WebSocket event: socket.emit('code:update', { code: newCode, userId })
    setTeamPresence(prev => prev.map(m => m.role === 'BUILDER' ? { ...m, status: 'CODING' } : m))
  }, [])

  // Builder: request testing phase
  const handleRequestTesting = useCallback(() => {
    setMissionStage('TESTING')
    logActivity('CIPHER_WRAITH', 'BUILDER', 'submitted code for testing', '#00f5ff')
    setTeamPresence(prev => prev.map(m =>
      m.role === 'BUILDER' ? { ...m, status: 'WAITING' } :
      m.role === 'TESTER'  ? { ...m, status: 'TESTING' } : m
    ))
    // TODO: Replace with API call: POST /api/heist/:id/stage { stage: 'TESTING' }
  }, [logActivity])

  // Tester: update test cases
  const handleTestCaseChange = useCallback((newTests) => {
    setTestCases(newTests)
    // TODO: Replace with WebSocket event: socket.emit('tests:update', { tests: newTests })
  }, [])

  // Tester: run tests against solution
  const handleRunTests = useCallback(() => {
    // TODO: Replace with API call: POST /api/heist/:id/run-tests { code: solutionCode, tests: testCases }
    // Mock result simulation
    const mockResults = {
      passed: 3,
      failed: 1,
      total: 4,
      cases: [
        { label: 'Standard rotation', passed: true,  output: '1', expected: '1' },
        { label: 'Larger array',      passed: true,  output: '0', expected: '0' },
        { label: 'Single element',    passed: true,  output: '1', expected: '1' },
        { label: 'Two elements',      passed: false, output: '2', expected: '1', error: 'Wrong answer' },
      ]
    }
    setTestResults(mockResults)
    logActivity('GHOST_V0ID', 'TESTER', `ran tests — ${mockResults.passed}/${mockResults.total} passed`, '#00ff88')
    setFortressHealth(h => Math.max(0, h - 15))
    // TODO: Replace with WebSocket event: socket.emit('tests:results', mockResults)
  }, [logActivity])

  // Tester: submit for analysis after tests pass
  const handleSubmitForAnalysis = useCallback(() => {
    if (!testResults || testResults.failed > 0) return
    setMissionStage('ANALYSIS')
    logActivity('GHOST_V0ID', 'TESTER', 'approved code for complexity analysis', '#00ff88')
    setTeamPresence(prev => prev.map(m =>
      m.role === 'TESTER'  ? { ...m, status: 'DONE'      } :
      m.role === 'ANALYST' ? { ...m, status: 'REVIEWING' } : m
    ))
    // TODO: Replace with API call: POST /api/heist/:id/stage { stage: 'ANALYSIS' }
  }, [testResults, logActivity])

  // Analyst: update complexity selection
  const handleComplexityChange = useCallback((field, value) => {
    setComplexityReview(prev => ({ ...prev, [field]: value }))
    // TODO: Replace with WebSocket event: socket.emit('complexity:update', { field, value })
  }, [])

  // Analyst: approve — move to BREACH
  const handleApproveComplexity = useCallback(() => {
    if (!complexityReview.time || !complexityReview.space) return
    setApprovalStatus('APPROVED')
    setMissionStage('BREACH')
    setFortressHealth(0)
    logActivity('NULL_BYTE', 'ANALYST', `approved solution — ${complexityReview.time} time, ${complexityReview.space} space`, '#a855f7')
    setTeamPresence(prev => prev.map(m => ({ ...m, status: 'READY' })))
    // TODO: Replace with API call: POST /api/heist/:id/approve { complexity: complexityReview }
  }, [complexityReview, logActivity])

  // Analyst: veto submission
  const handleVetoSubmission = useCallback((reason) => {
    setApprovalStatus('VETOED')
    setMissionStage('VETOED')
    setVetoReason(reason)
    logActivity('NULL_BYTE', 'ANALYST', `VETOED: "${reason}"`, '#ff3366')
    setFortressHealth(h => Math.min(100, h + 25))
    setTeamPresence(prev => prev.map(m =>
      m.role === 'BUILDER' ? { ...m, status: 'CODING' } : m
    ))
    // TODO: Replace with API call: POST /api/heist/:id/veto { reason }
  }, [logActivity])

  // Reset after veto — allow Builder to recode
  const handleResetAfterVeto = useCallback(() => {
    setApprovalStatus('PENDING')
    setMissionStage('CODE')
    setTestResults(null)
    setVetoReason('')
    logActivity('SYSTEM', 'SYSTEM', 'mission reset — Builder can revise solution', '#ff9500')
  }, [logActivity])

  // Final breach — mission complete
  const handleFinalBreach = useCallback(() => {
    // TODO: Replace with API call: POST /api/heist/:id/complete
    // TODO: Trigger reward system and update leaderboard
    logActivity('SYSTEM', 'SYSTEM', '🔓 FORTRESS BREACHED — MISSION COMPLETE', '#ff9500')
  }, [logActivity])

  // Send chat message
  const handleSendChat = useCallback((text) => {
    if (!text.trim()) return
    const id = `c${++chatIdRef.current}`
    const sender = teamPresence.find(m => m.role === currentUserRole)
    setChatMessages(prev => [...prev, {
      id,
      user: sender?.name || 'UNKNOWN',
      role: currentUserRole,
      text,
      ts: 'just now',
      color: sender?.color || '#fff',
    }])
    // TODO: Replace with WebSocket event: socket.emit('chat:message', { text, userId })
  }, [currentUserRole, teamPresence])

  return {
    // State
    missionStage, currentUserRole, approvalStatus,
    solutionCode, testCases, testResults,
    complexityReview, vetoReason,
    teamPresence, activityLog, chatMessages,
    fortressHealth, missionTimer,
    // Handlers
    setCurrentUserRole,
    handleCodeChange,
    handleRequestTesting,
    handleTestCaseChange,
    handleRunTests,
    handleSubmitForAnalysis,
    handleComplexityChange,
    handleApproveComplexity,
    handleVetoSubmission,
    handleResetAfterVeto,
    handleFinalBreach,
    handleSendChat,
  }
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function Heist() {
  const state = useHeistState()
  const mission = HEIST_ACTIVE_MISSION

  return (
    <div className={styles.page}>
      {/* Ambient scanline effect */}
      <div className={styles.scanlines} aria-hidden />

      <HeistHeader
        mission={mission}
        missionStage={state.missionStage}
        missionTimer={state.missionTimer}
        fortressHealth={state.fortressHealth}
      />

      <div className={styles.mainGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <RoleRoster
            teamPresence={state.teamPresence}
            currentUserRole={state.currentUserRole}
            onRoleSwitch={state.setCurrentUserRole}
          />
          <HeistPipeline
            missionStage={state.missionStage}
            approvalStatus={state.approvalStatus}
          />
          <ActivityFeed log={state.activityLog} />
        </div>

        {/* Right column — workspace */}
        <div className={styles.rightCol}>
          <SharedWorkspace
            {...state}
            mission={mission}
          />
        </div>
      </div>

      {/* Breach overlay */}
      <AnimatePresence>
        {state.missionStage === 'BREACH' && (
          <motion.div
            className={styles.breachOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.breachCard}
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className={styles.breachGlow} />
              <div className={styles.breachIcon}>🔓</div>
              <h2 className={styles.breachTitle}>FORTRESS BREACHED</h2>
              <p className={styles.breachSub}>OPERATION: {mission.name}</p>
              <div className={styles.breachRewards}>
                <span className={styles.breachXp}>+{mission.reward.xp} XP</span>
                <span className={styles.breachCoins}>◈ {mission.reward.coins}</span>
                <span className={styles.breachFrags}>⬡ {mission.reward.fragment} FRAGS</span>
              </div>
              <button className={styles.breachBtn} onClick={state.handleFinalBreach}>
                CLAIM REWARDS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
