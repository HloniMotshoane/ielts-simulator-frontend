import React from 'react'

export default function FeedbackCard({ title, score }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <h3 className="font-bold">{title}:</h3>
      <p className="text-2xl font-bold">{score}</p>
    </div>
  )
}
