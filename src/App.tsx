import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocaleProvider } from './providers/LocaleProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { HomePage } from './pages/HomePage'
import { ProPage } from './pages/ProPage'
import { AboutPage } from './pages/AboutPage'
import './styles/globals.css'

function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/fr" element={<HomePage />} />
              <Route path="/en" element={<HomePage />} />
              <Route path="/pro" element={<ProPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App





