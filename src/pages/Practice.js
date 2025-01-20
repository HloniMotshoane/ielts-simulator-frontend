import React, { useState } from 'react'
import { Mic } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useNavigate } from 'react-router-dom'

export default function Practice() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const navigate = useNavigate()

  const practiceQuestions = [
    'Describe a memorable holiday you’ve had.',
    'Talk about your favorite book or movie and why you like it.',
  ]

  const { transcript, listening, resetTranscript } = useSpeechRecognition()

  // Toggle the recording state
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      SpeechRecognition.stopListening()
      setIsRecording(false)

      // Use the transcribed text for random grading
      generateRandomGrading(transcript)
    } else {
      // Start recording
      resetTranscript() // Clear previous transcription
      SpeechRecognition.startListening({ continuous: true })
      setIsRecording(true)
      setTranscription('Your speech will appear here...')
    }
  }

  // Generate random grading for practice questions
  const generateRandomGrading = (transcribedText) => {
    setTranscription(transcribedText)
    if (!transcribedText.trim()) {
      setFeedback(null)
      return
    }

    setFeedback({
      fluency: Math.floor(Math.random() * 10) + 1,
      grammar: Math.floor(Math.random() * 10) + 1,
      vocabulary: Math.floor(Math.random() * 10) + 1,
      pronunciation: Math.floor(Math.random() * 10) + 1,
    })
  }

  // Update transcription display with the live speech text
  React.useEffect(() => {
    if (!listening) {
      setTranscription(transcript)
    }
  }, [transcript, listening])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section className="bg-[#BDD7E7] p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Instructions</h2>
        <p>Click the microphone button to start recording. Speak clearly and naturally. Your speech will be transcribed and analyzed.</p>
      </section>

      {/* Practice Questions */}
      <section className="bg-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Practice Question:</h3>
        <p>{practiceQuestions[currentQuestion]}</p>
        {currentQuestion < practiceQuestions.length - 1 && (
          <button
            className="mt-4 px-4 py-2 bg-[#2171B5] text-white rounded-lg hover:bg-[#1a5a8e]"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            Next Question
          </button>
        )}
      </section>

      <div className="flex justify-center">
        <button
          onClick={toggleRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition duration-300 ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2171B5] hover:bg-[#1a5a8e]'
          }`}
        >
          <Mic className="w-12 h-12 text-white" />
        </button>
      </div>

      <section className="bg-white p-4 rounded-lg min-h-[100px]">
        <h3 className="font-bold mb-2">Transcription:</h3>
        <p>{transcription}</p>
      </section>

      <section className="bg-[#BDD7E7] p-4 rounded-lg">
        <h3 className="font-bold mb-2">Feedback:</h3>
        {feedback ? (
          <ul className="space-y-2">
            <li>Fluency: <span className="font-bold">{feedback.fluency}</span></li>
            <li>Grammar: <span className="font-bold">{feedback.grammar}</span></li>
            <li>Vocabulary: <span className="font-bold">{feedback.vocabulary}</span></li>
            <li>Pronunciation: <span className="font-bold">{feedback.pronunciation}</span></li>
          </ul>
        ) : (
          <p>No feedback available yet.</p>
        )}
      </section>

      {/* Button to take the actual test */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/test')}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Take the Actual Test
        </button>
      </div>
    </div>
  )
}
