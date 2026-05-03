import { useEffect } from 'react'
import useWorldSocket from '../hooks/useWorldSocket'

export default function WorldSocketTest() {
  const { players, movePlayer } = useWorldSocket()

  const btnStyle = {
    padding: '10px 16px',
    border: '1px solid #00f5ff',
    color: '#00f5ff',
    background: 'rgba(0, 245, 255, 0.08)',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer'
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        movePlayer(0, -10, 'up')
      }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        movePlayer(0, 10, 'down')
      }
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        movePlayer(-10, 0, 'left')
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        movePlayer(10, 0, 'right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [movePlayer])

  return (
    <div style={{ padding: '40px', color: 'white' }}>
      <h1 style={{ color: '#00f5ff', marginBottom: '12px' }}>
        World Socket Test
      </h1>

      <p style={{ marginBottom: '16px' }}>
        Players connected: {Object.keys(players).length}
      </p>

      <p style={{ marginBottom: '16px', color: '#8892b0' }}>
        Use buttons or WASD / arrow keys to move.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={btnStyle} onClick={() => movePlayer(0, -10, 'up')}>Up</button>
        <button style={btnStyle} onClick={() => movePlayer(0, 10, 'down')}>Down</button>
        <button style={btnStyle} onClick={() => movePlayer(-10, 0, 'left')}>Left</button>
        <button style={btnStyle} onClick={() => movePlayer(10, 0, 'right')}>Right</button>
      </div>

      <div
        style={{
          position: 'relative',
          width: '700px',
          height: '420px',
          border: '2px solid #00f5ff',
          background: '#070713',
          overflow: 'hidden'
        }}
      >
        {Object.values(players).map((player) => (
          <div
            key={player.id}
            style={{
              position: 'absolute',
              left: `${player.x}px`,
              top: `${player.y}px`,
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: player.id === window.socket?.id ? '#00f5ff' : '#ff33cc',
              boxShadow:
                player.id === window.socket?.id
                  ? '0 0 18px #00f5ff'
                  : '0 0 18px #ff33cc',
              transition: 'left 0.08s linear, top 0.08s linear'
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '30px',
                left: '-12px',
                fontSize: '11px',
                color: 'white',
                whiteSpace: 'nowrap'
              }}
            >
              {player.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}