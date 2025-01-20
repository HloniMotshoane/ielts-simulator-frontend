import React from 'react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#EFF3FF] text-gray-800 flex flex-col items-center">
      <main className="w-full max-w-4xl px-4 py-8">{children}</main>
    </div>
  )
}
