import './App.css'
import WalletStatus from './components/WalletStatus.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <WalletStatus />
      </div>
    </div>
  )
}

export default App
