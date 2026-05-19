import { Routes, Route } from 'react-router-dom'

import Home from './Pages/Home.jsx'
import Register from './Pages/Register.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App