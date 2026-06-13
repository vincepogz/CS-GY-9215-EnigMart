import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          EnigMart Frontend
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          React + Vite + Tailwind CSS + ethers.js
        </p>
        <div className="mb-8">
          <div className="inline-block bg-purple-600 rounded-lg p-6">
            <p className="text-white text-lg font-semibold">
              ✓ Placeholder Homepage
            </p>
          </div>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>✓ Tailwind CSS configured and working</p>
          <p>✓ ethers.js v6 installed</p>
          <p>✓ Folder structure ready</p>
          <p>✓ Ready for Week 2 integration</p>
        </div>
      </div>
    </div>
  )
}

export default App
