import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './themes/ThemeContext'
import { RevealProvider } from './hooks/useReveal'
import { DownloadProvider } from './hooks/useDownload'
import Navbar from './components/Navbar'
import RevealModal from './components/RevealModal'
import DirectoryPage from './pages/DirectoryPage'
import ConsultantPage from './pages/ConsultantPage'
import ImportPage from './pages/ImportPage'

export default function App() {
  return (
    <ThemeProvider>
      <RevealProvider>
        <DownloadProvider>
          <BrowserRouter>
            <div className="min-h-screen" style={{ background: 'var(--brand-bg)' }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<DirectoryPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/consultants/:id" element={<ConsultantPage />} />
              </Routes>
              <RevealModal />
            </div>
          </BrowserRouter>
        </DownloadProvider>
      </RevealProvider>
    </ThemeProvider>
  )
}
