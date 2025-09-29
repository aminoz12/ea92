import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocaleProvider } from './providers/LocaleProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { HomePage } from './pages/HomePage'
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
            </Routes>
          </div>
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App





