import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import styles from './Arena.module.css'

import ArenaHeader from '../components/arena/ArenaHeader'
import BattleLobby from '../components/arena/BattleLobby'
import PlayerDuelCards from '../components/arena/PlayerDuelCards'
import BattlePhaseTracker from '../components/arena/BattlePhaseTracker'
import ProblemBrief from '../components/arena/ProblemBrief'
import SolverWorkspace from '../components/arena/SolverWorkspace'
import CorruptorWorkspace from '../components/arena/CorruptorWorkspace'
import RefereePanel from '../components/arena/RefereePanel'
import RoundSwitchPanel from '../components/arena/RoundSwitchPanel'
import BattleScoreboard from '../components/arena/BattleScoreboard'
import ArenaActivityFeed from '../components/arena/ArenaActivityFeed'

import { ARENA_BATTLE_PROBLEM, PLAYER } from '../data/mockData'
// ─── Mock AI referee logic ────────────────────────────────────────────────────
// TODO: Replace mock AI referee with NIM/Gemini/LLM judge endpoint
// POST /api/arena/:battleId/judge  { solverCode, corruptorTests, roundNumber }
function generateMockRefereeDecision(solverCode, corruptorTests, round) {
  const hasEdgeCases = corruptorTests.toLowerCase().includes('empty') ||
                       corruptorTests.includes('[]') ||
                       corruptorTests.includes('-1') ||
                       corruptorTests.includes('null')
  const codeLength = solverCode.trim().split('\n').length
  const isRobust = codeLength > 12

  return {
    weaknessFound: hasEdgeCases && !isRobust,
    corruptorTestValidity: hasEdgeCases ? 'VALID' : 'WEAK',
    solverRobustness: isRobust ? 82 : 45,
    explanation: hasEdgeCases && !isRobust
      ? `Corruptor found edge case weakness. Solver code lacks null/empty input handling. ${round === 1 ? 'Round goes to CORRUPTOR.' : 'Round goes to CORRUPTOR.'}`
      : `Solver handled test cases robustly. ${codeLength > 12 ? 'Code shows defensive patterns.' : ''} ${hasEdgeCases ? 'Corruptor tests were valid but Solver prevailed.' : 'Corruptor tests were too generic.'}`,
    roundWinner: hasEdgeCases && !isRobust ? 'CORRUPTOR' : 'SOLVER',
  }
}

// ─── useArenaBattleState ──────────────────────────────────────────────────────
export function useArenaBattleState() {
  // battleStatus: lobby | matching | active | judging | role-switch | round2 | completed
  const [battleStatus, setBattleStatus] = useState('lobby')
  const [currentRound, setCurrentRound] = useState(1)
  const [currentUserRole, setCurrentUserRole] = useState('solver') // solver | corruptor
  const [selectedDifficulty, setSelectedDifficulty] = useState('HARD')
  const [queueTime, setQueueTime] = useState(0)

  const [players, setPlayers] = useState({
    self: { id: 'usr_self', name: PLAYER.username, rank: PLAYER.rank, role: 'solver',    status: 'ready',  score: { round1: null, round2: null }, color: '#00f5ff' },
    opp:  { id: 'usr_opp',  name: 'NULL_PHANTOM',  rank: 'SPECTER',   role: 'corruptor', status: 'ready',  score: { round1: null, round2: null }, color: '#ff3366' },
  })

  const [problem, setProblem] = useState(null)
  const [solverCode, setSolverCode] = useState(
`// Round 1 — You are the SOLVER
// Defensive coding: handle ALL edge cases

function twoSum(nums, target) {
  // TODO: Implement robust solution
  // Remember: handle empty arrays, duplicates, no-solution cases
  
}`
  )
  const [corruptorTestCases, setCorruptorTestCases] = useState(
`// You are the CORRUPTOR — 60 seconds to break the Solver
// Add edge cases designed to crash or expose weaknesses

const attacks = [
  // Add your test cases here:
];`
  )
  const [timer, setTimer]   = useState(null) // seconds remaining
  const [testResults, setTestResults] = useState(null)

  const [refereeDecisions, setRefereeDecisions] = useState({
    round1: null,
    round2: null,
  })

  const [battleLog, setBattleLog] = useState([
    { id: 'l0', type: 'system', text: 'Algorithm Battles arena initialized', ts: 'just now', color: '#5e6888' },
  ])

  const [finalScore, setFinalScore] = useState(null)

  const logIdRef = useRef(10)
  const timerRef = useRef(null)

  // ── Log helper ──────────────────────────────────────────────────────────
  const addLog = useCallback((type, text, color = '#5e6888') => {
    const id = `l${++logIdRef.current}`
    setBattleLog(prev => [{ id, type, text, ts: 'just now', color }, ...prev].slice(0, 25))
  }, [])

  // ── Timer ────────────────────────────────────────────────────────────────
  const startTimer = useCallback((seconds, onExpire) => {
    setTimer(seconds)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          onExpire?.()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [])

  useEffect(() => () => clearInterval(timerRef.current), [])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleJoinQueue = useCallback(() => {
    setBattleStatus('matching')
    setQueueTime(0)
    addLog('system', 'Searching for opponent…', '#ff9500')
    // TODO: Replace with Socket.IO emit: socket.emit('queue:join', { difficulty: selectedDifficulty, userId })
    let elapsed = 0
    const q = setInterval(() => {
      elapsed += 1
      setQueueTime(elapsed)
      if (elapsed >= 3) {
        clearInterval(q)
        handleMatchFound()
      }
    }, 1000)
  }, [selectedDifficulty, addLog])

  const handleMatchFound = useCallback(() => {
    // TODO: Replace with Socket.IO event: socket.on('match:found', ({ opponent, problem, roomId }) => ...)
    setProblem(ARENA_BATTLE_PROBLEM)
    addLog('match', '⚡ MATCH FOUND — NULL_PHANTOM entered the arena', '#ff3366')
    setBattleStatus('active')
    setCurrentRound(1)
    setCurrentUserRole('solver')
    setPlayers(prev => ({
      ...prev,
      self: { ...prev.self, role: 'solver',    status: 'coding'   },
      opp:  { ...prev.opp,  role: 'corruptor', status: 'attacking' },
    }))
    addLog('problem', 'Problem revealed: Two Sum — Corrupted Edition', '#a855f7')
    addLog('system', 'Round 1 started — You are the SOLVER', '#00f5ff')
  }, [addLog])

  const handleStartBattle = useCallback(() => {
    // TODO: Replace with API call: POST /api/arena/room/:roomId/ready
    handleMatchFound()
  }, [handleMatchFound])

  const handleSolverCodeChange = useCallback((code) => {
    setSolverCode(code)
    // TODO: Replace with Socket.IO emit: socket.emit('solver:code-update', { code, roomId })
  }, [])

  const handleCorruptorTestChange = useCallback((tests) => {
    setCorruptorTestCases(tests)
    // TODO: Replace with Socket.IO emit: socket.emit('corruptor:tests-update', { tests, roomId })
  }, [])

  const handleSubmitSolution = useCallback(() => {
    setPlayers(prev => ({ ...prev, self: { ...prev.self, status: 'submitted' } }))
    addLog('solver', `${PLAYER.username} submitted solution`, '#00f5ff')
    // TODO: Replace with API call: POST /api/arena/room/:roomId/submit-solution { code: solverCode }
    // Start corruptor timer if solver submits early
    if (currentUserRole === 'solver') {
      startTimer(60, () => {
        addLog('timer', 'Corruptor timer expired — auto-submitting', '#ff9500')
        handleRunJudgement()
      })
    }
  }, [addLog, currentUserRole, startTimer])

  const handleSubmitCorruptorTests = useCallback(() => {
    setPlayers(prev => ({ ...prev, opp: { ...prev.opp, status: 'submitted' } }))
    clearInterval(timerRef.current)
    setTimer(null)
    addLog('corruptor', 'NULL_PHANTOM submitted attack vectors', '#ff3366')
    // TODO: Replace with API call: POST /api/arena/room/:roomId/submit-attacks { tests: corruptorTestCases }
    handleRunJudgement()
  }, [addLog])

  const handleRunJudgement = useCallback(() => {
    setBattleStatus('judging')
    setPlayers(prev => ({
      ...prev,
      self: { ...prev.self, status: 'judging' },
      opp:  { ...prev.opp,  status: 'judging' },
    }))
    addLog('referee', '🤖 AI Referee analyzing submissions…', '#a855f7')

    // TODO: Replace mock AI referee with NIM/Gemini/LLM judge endpoint
    // POST /api/arena/:battleId/judge { solverCode, corruptorTests, roundNumber }
    setTimeout(() => {
      const decision = generateMockRefereeDecision(solverCode, corruptorTestCases, currentRound)
      if (currentRound === 1) {
        setRefereeDecisions(prev => ({ ...prev, round1: decision }))
        setPlayers(prev => ({
          ...prev,
          self: { ...prev.self, score: { ...prev.self.score, round1: decision.roundWinner === 'SOLVER' ? 1 : 0 } },
          opp:  { ...prev.opp,  score: { ...prev.opp.score,  round1: decision.roundWinner === 'CORRUPTOR' ? 1 : 0 } },
        }))
      } else {
        setRefereeDecisions(prev => ({ ...prev, round2: decision }))
        setPlayers(prev => ({
          ...prev,
          self: { ...prev.self, score: { ...prev.self.score, round2: decision.roundWinner === 'CORRUPTOR' ? 1 : 0 } },
          opp:  { ...prev.opp,  score: { ...prev.opp.score,  round2: decision.roundWinner === 'SOLVER' ? 1 : 0 } },
        }))
      }
      addLog('referee', `🏆 Round ${currentRound} winner: ${decision.roundWinner}`, decision.roundWinner === 'SOLVER' ? '#00f5ff' : '#ff3366')
    }, 2200)
  }, [solverCode, corruptorTestCases, currentRound, addLog])

  const handleRoleSwitch = useCallback(() => {
    // TODO: Replace with Socket.IO emit: socket.emit('round:switch', { roomId })
    setCurrentRound(2)
    setCurrentUserRole('corruptor')
    setBattleStatus('round2')
    setSolverCode(`// Round 2 — You are now the CORRUPTOR\n// NULL_PHANTOM is solving. Find their weakness.\n`)
    setCorruptorTestCases(`// Your turn to ATTACK — 60 seconds\n// Design edge cases to break NULL_PHANTOM's solution\n\nconst attacks = [\n  // Add attack vectors here\n];\n`)
    setPlayers(prev => ({
      ...prev,
      self: { ...prev.self, role: 'corruptor', status: 'attacking' },
      opp:  { ...prev.opp,  role: 'solver',    status: 'coding'    },
    }))
    addLog('system', 'Roles switched — Round 2 begins', '#ff9500')
    startTimer(60, () => {
      addLog('timer', 'Attack timer expired', '#ff9500')
    })
  }, [addLog, startTimer])

  const handleFinishBattle = useCallback(() => {
    // TODO: Replace with API call: POST /api/arena/room/:roomId/finish
    // TODO: Update leaderboard and XP via backend
    const r1 = refereeDecisions.round1
    const r2 = refereeDecisions.round2
    const selfTotal = (players.self.score.round1 || 0) + (players.self.score.round2 || 0)
    const oppTotal  = (players.opp.score.round1  || 0) + (players.opp.score.round2  || 0)
    const winner = selfTotal > oppTotal ? players.self.name : selfTotal < oppTotal ? players.opp.name : 'DRAW'

    setFinalScore({
      winner,
      selfTotal,
      oppTotal,
      robustnessBonus: r1?.solverRobustness || 0,
      xpEarned: winner === players.self.name ? 320 : 80,
      coinsEarned: winner === players.self.name ? 150 : 30,
    })
    setBattleStatus('completed')
    addLog('system', `⚔ BATTLE COMPLETE — Winner: ${winner}`, '#00ff88')
  }, [refereeDecisions, players, addLog])

  const handleSendBattleMessage = useCallback((text) => {
    // TODO: Replace with Socket.IO emit: socket.emit('battle:chat', { text, roomId, userId })
    addLog('chat', `${PLAYER.username}: ${text}`, '#00f5ff')
  }, [addLog])

  return {
    battleStatus, currentRound, currentUserRole, selectedDifficulty,
    queueTime, players, problem, solverCode, corruptorTestCases,
    timer, testResults, refereeDecisions, battleLog, finalScore,
    setSelectedDifficulty,
    handleJoinQueue, handleStartBattle,
    handleSolverCodeChange, handleCorruptorTestChange,
    handleSubmitSolution, handleSubmitCorruptorTests,
    handleRunJudgement, handleRoleSwitch,
    handleFinishBattle, handleSendBattleMessage,
  }
}

// ─── Arena Page ───────────────────────────────────────────────────────────────
export default function Arena() {
  const state = useArenaBattleState()
  const { battleStatus, currentRound, currentUserRole } = state
  const isActive   = ['active', 'judging', 'round2'].includes(battleStatus)
  const isJudging  = battleStatus === 'judging'
  const isComplete = battleStatus === 'completed'
  const showRoleSwitch = isJudging && currentRound === 1 && state.refereeDecisions.round1

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} aria-hidden />

      <ArenaHeader battleStatus={battleStatus} currentRound={currentRound} />

      {/* Lobby / Matching */}
      {(battleStatus === 'lobby' || battleStatus === 'matching') && (
        <BattleLobby
          battleStatus={battleStatus}
          selectedDifficulty={state.selectedDifficulty}
          queueTime={state.queueTime}
          onSelectDifficulty={state.setSelectedDifficulty}
          onJoinQueue={state.handleJoinQueue}
          onStartBattle={state.handleStartBattle}
        />
      )}

      {/* Active battle layout */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className={styles.battleLayout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top row: players + phase tracker */}
            <div className={styles.battleTop}>
              <PlayerDuelCards players={state.players} currentRound={currentRound} />
              <BattlePhaseTracker battleStatus={battleStatus} currentRound={currentRound} />
            </div>

            {/* Main battle area */}
            <div className={styles.battleMain}>
              {/* Left: problem + activity */}
              <div className={styles.battleLeft}>
                {state.problem && <ProblemBrief problem={state.problem} />}
                <ArenaActivityFeed log={state.battleLog} />
              </div>

              {/* Right: workspace */}
              <div className={styles.battleRight}>
                {/* Solver or corruptor workspace based on role */}
                {currentUserRole === 'solver' ? (
                  <SolverWorkspace
                    solverCode={state.solverCode}
                    battleStatus={battleStatus}
                    onCodeChange={state.handleSolverCodeChange}
                    onSubmitSolution={state.handleSubmitSolution}
                  />
                ) : (
                  <CorruptorWorkspace
                    testCases={state.corruptorTestCases}
                    timer={state.timer}
                    battleStatus={battleStatus}
                    onTestChange={state.handleCorruptorTestChange}
                    onSubmitAttacks={state.handleSubmitCorruptorTests}
                  />
                )}

                {/* Referee panel — shown while judging */}
                <AnimatePresence>
                  {isJudging && (
                    <RefereePanel
                      decision={state.refereeDecisions[`round${currentRound}`]}
                      round={currentRound}
                      isLoading={!state.refereeDecisions[`round${currentRound}`]}
                    />
                  )}
                </AnimatePresence>

                {/* Role switch after round 1 judging */}
                <AnimatePresence>
                  {showRoleSwitch && (
                    <RoundSwitchPanel
                      players={state.players}
                      round1Decision={state.refereeDecisions.round1}
                      onContinue={state.handleRoleSwitch}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final scoreboard */}
      <AnimatePresence>
        {isComplete && state.finalScore && (
          <BattleScoreboard
            finalScore={state.finalScore}
            players={state.players}
            refereeDecisions={state.refereeDecisions}
            onNewBattle={() => window.location.reload()}
          />
        )}
      </AnimatePresence>

      {/* Round 2 judging */}
      <AnimatePresence>
        {battleStatus === 'judging' && currentRound === 2 && state.refereeDecisions.round2 && (
          <div className={styles.finishRow}>
            <button className={styles.finishBtn} onClick={state.handleFinishBattle}>
              VIEW FINAL RESULTS
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
