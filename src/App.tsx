import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './themes/ThemeContext'
import { RevealProvider } from './hooks/useReveal'
import { DownloadProvider } from './hooks/useDownload'
import Navbar from './components/Navbar'
import RevealModal from './components/RevealModal'
import DirectoryPage from './pages/DirectoryPage'
import ConsultantPage from './pages/ConsultantPage'
import ImportPage from './pages/ImportPage'
import ShowcasePage from './pages/ShowcasePage'

function AppShell() {
  const location = useLocation()
  const hideChrome = location.pathname.startsWith('/showcase')
  return (
    <div className="min-h-screen" style={{ background: 'var(--brand-bg)' }}>
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/consultants/:id" element={<ConsultantPage />} />
      </Routes>
      {!hideChrome && <RevealModal />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <RevealProvider>
        <DownloadProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </DownloadProvider>
      </RevealProvider>
    </ThemeProvider>
  )
}
