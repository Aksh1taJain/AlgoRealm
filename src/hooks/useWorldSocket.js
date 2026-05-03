import { useEffect, useState } from 'react'
import { socket } from '../socket'

export default function useWorldSocket() {
  const [players, setPlayers] = useState({})

  useEffect(() => {
    const joinWorld = () => {
      socket.emit('join_world', {
        name: 'TestPlayer',
        x: Math.floor(Math.random() * 400) + 50,
        y: Math.floor(Math.random() * 250) + 50
      })
    }

    if (socket.connected) {
      joinWorld()
    } else {
      socket.on('connect', joinWorld)
    }

    socket.on('world_players', (allPlayers) => {
      setPlayers(allPlayers)
    })

    socket.on('player_joined', (player) => {
      setPlayers((prev) => ({
        ...prev,
        [player.id]: player
      }))
    })

    socket.on('player_moved', (player) => {
      setPlayers((prev) => ({
        ...prev,
        [player.id]: player
      }))
    })

    socket.on('player_left', (id) => {
      setPlayers((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
    })

    return () => {
      socket.off('connect', joinWorld)
      socket.off('world_players')
      socket.off('player_joined')
      socket.off('player_moved')
      socket.off('player_left')
    }
  }, [])

  const movePlayer = (dx, dy, direction) => {
    setPlayers((prev) => {
      const current = prev[socket.id]
      if (!current) return prev

      const updated = {
        ...current,
        x: Math.max(0, Math.min(674, current.x + dx)),
        y: Math.max(0, Math.min(394, current.y + dy)),
        direction
      }

      socket.emit('player_move', updated)

      return {
        ...prev,
        [socket.id]: updated
      }
    })
  }

  return { players, movePlayer }
}