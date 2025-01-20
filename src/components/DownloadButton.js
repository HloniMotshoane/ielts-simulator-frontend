import React from 'react'

export default function DownloadButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#2171B5] hover:bg-[#1a5a8e] text-white font-bold py-3 px-6 rounded transition duration-300"
    >
      Download PDF Report
    </button>
  )
}
