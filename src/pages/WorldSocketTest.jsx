import { useEffect, useState } from 'react'
import { socket } from '../socket'

export default function WorldSocketTest() {
  const [players, setPlayers] = useState({})

  useEffect(() => {
    socket.emit('join_world', {
      name: 'TestPlayer',
      x: 100,
      y: 100
    })

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
      socket.off('world_players')
      socket.off('player_joined')
      socket.off('player_moved')
      socket.off('player_left')
    }
  }, [])

  const movePlayer = (dx, dy) => {
    setPlayers((prev) => {
      const current = prev[socket.id]
      if (!current) return prev

      const updated = {
        ...current,
        x: current.x + dx,
        y: current.y + dy
      }

      socket.emit('player_move', updated)

      return {
        ...prev,
        [socket.id]: updated
      }
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>World Socket Test</h1>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => movePlayer(0, -10)}>Up</button>
        <button onClick={() => movePlayer(0, 10)}>Down</button>
        <button onClick={() => movePlayer(-10, 0)}>Left</button>
        <button onClick={() => movePlayer(10, 0)}>Right</button>
      </div>

      <div
        style={{
          position: 'relative',
          width: '600px',
          height: '400px',
          border: '1px solid cyan',
          background: '#050510',
          overflow: 'hidden'
        }}
      >
        {Object.values(players).map((player) => (
          <div
            key={player.id}
            style={{
              position: 'absolute',
              left: player.x,
              top: player.y,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: player.id === socket.id ? 'cyan' : 'magenta',
              boxShadow: '0 0 12px cyan'
            }}
          >
            <span style={{ position: 'absolute', top: 26, fontSize: 10 }}>
              {player.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}