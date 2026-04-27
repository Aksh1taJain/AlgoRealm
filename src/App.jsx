import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import World from './pages/World'
import Practice from './pages/Practice'
import Arena from './pages/Arena'
import Heist from './pages/Heist'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import RewardPopup from './components/RewardPopup'

export default function App() {
  const [reward, setReward] = useState(null)

  const showReward = (data) => setReward(data)
  const hideReward = () => setReward(null)

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
