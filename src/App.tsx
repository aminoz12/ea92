import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocaleProvider } from './providers/LocaleProvider'
// import { ThemeProvider } from './providers/ThemeProvider' // DARK MODE DISABLED - Uncomment to restore
import { HomePage } from './pages/HomePage'
import { ProPage } from './pages/ProPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'

import { ScrollToTop } from './components/ScrollToTop'
import './styles/globals.css'

function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        {/* DARK MODE DISABLED - Uncomment ThemeProvider wrapper to restore */}
        {/* <ThemeProvider> */}
          <ScrollToTop />
          <div className="min-h-screen bg-white transition-colors">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/fr" element={<HomePage />} />
              <Route path="/en" element={<HomePage />} />
              <Route path="/pro" element={<ProPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </div>
        {/* </ThemeProvider> */}
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App





