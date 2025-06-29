import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Research from './pages/Research'
import Home from './pages/Home'
import Publications from './pages/Publications'
import Teaching from './pages/Teaching'
import Watch from './pages/Watch'
import Login from './pages/Login'
import Admin from './pages/Admin'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/research" element={<Research />} />
      <Route path="/publications" element={<Publications />} />
      <Route path="/teaching" element={<Teaching />} />
      <Route path="/watch-out-for" element={<Watch />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App
