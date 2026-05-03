import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import World from './pages/World'
import Practice from './pages/Practice'
import Arena from './pages/Arena'
import Heist from './pages/Heist'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import RewardPopup from './components/RewardPopup'
import { socket } from './socket'
import WorldSocketTest from './pages/WorldSocketTest'
<Route path="/socket-test" element={<WorldSocketTest />} />
export default function App() {
  const [reward, setReward] = useState(null)

  const showReward = (data) => setReward(data)
  const hideReward = () => setReward(null)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to backend:', socket.id)
    })

    socket.emit('join_world', {
      name: 'TestPlayer',
      x: 100,
      y: 100
    })

    return () => {
      socket.off('connect')
    }
  }, [])

  return (
    <>
      <Layout showReward={showReward}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard showReward={showReward} />} />
          <Route path="/world" element={<World showReward={showReward} />} />
          <Route path="/practice" element={<Practice showReward={showReward} />} />
          <Route path="/arena" element={<Arena showReward={showReward} />} />
          <Route path="/heist" element={<Heist showReward={showReward} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>

      {reward && <RewardPopup data={reward} onClose={hideReward} />}
    </>
  )
}