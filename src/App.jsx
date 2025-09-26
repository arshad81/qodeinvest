import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dasboard from './pages/Dasboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Dasboard />} />
    </Routes>
  )
}

export default App
