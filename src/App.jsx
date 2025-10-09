import { useState } from 'react'
import PlayerSearch from './components/PlayerSearch'
import PlayerComparison from './components/PlayerComparison'
import './App.css'

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([])

  // Add player
  const handleAddPlayer = (player) => {
    // Alert if player is already added
    if (selectedPlayers.some(p => p.id === player.id)) {
      alert('Player already added');
      return;
    }
    // Add player
    setSelectedPlayers([...selectedPlayers, player]);
  }

  // Remove player
  const handleRemovePlayer = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  }

  // Render app
  return (
    <div className="app">
      <header className="app-header">
        <h1>NFL Stats Comparison</h1>
      </header>

      <main className="app-main">
        <PlayerSearch onAddPlayer={handleAddPlayer} />
        <PlayerComparison 
          players={selectedPlayers}
          onRemovePlayer={handleRemovePlayer}
        />
      </main>
    </div>
  )
}

export default App
