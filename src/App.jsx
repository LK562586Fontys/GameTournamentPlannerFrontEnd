import { Routes, Route } from 'react-router-dom'

import Home from './Pages/Home.jsx'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App