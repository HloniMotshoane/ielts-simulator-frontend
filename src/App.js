import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Test from './pages/Test';
import Feedback from './pages/Feed';

export default function App() {
  return (
    <Router>
      <div className="bg-[#EFF3FF] text-gray-800 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/test" element={<Test />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  )
}
