import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-center">IELTS Speaking Test Simulation</h1>

      {/* H2 Section */}
      <h2 className="w-full h-16 flex flex-row bg-pink-500 items-center justify-center">
        Welcome to the IELTS Simulation App!
      </h2>

      {/* Links Section */}
      <div className="space-y-6 text-center mt-6">
        <Link
          to="/practice"
          className="block w-64 bg-[#2171B5] hover:bg-[#1a5a8e] text-white font-bold py-3 px-4 rounded transition duration-300"
        >
          Practice Mode
        </Link>
        <Link
          to="/test"
          className="block w-64 bg-[#6BAD6B] hover:bg-[#569656] text-white font-bold py-3 px-4 rounded transition duration-300"
        >
          Test Mode
        </Link>
      </div>

      {/* Footer Section */}
      <footer className="w-full h-12 flex flex-row items-center justify-center bg-gray-200 mt-auto">
        <p className="text-gray-600">© 2025 IELTS Simulation App. All rights reserved.</p>
      </footer>
    </div>
  )
}
