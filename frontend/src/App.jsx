import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import History from './pages/History'

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <header>
        <h1>AI Meeting Notes Assistant</h1>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>History</Link>
        </nav>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
