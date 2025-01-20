import React from 'react'
import { Mic } from 'lucide-react'

export default function MicrophoneButton({ isRecording, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-24 h-24 rounded-full flex items-center justify-center transition duration-300 ${
        isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2171B5] hover:bg-[#1a5a8e]'
      }`}
    >
      <Mic className="w-12 h-12 text-white" />
    </button>
  )
}
