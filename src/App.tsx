import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AcademyPage from './pages/AcademyPage'
import TalentPage from './pages/TalentPage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import ApplyPage from './pages/ApplyPage'
import ContactPage from './pages/ContactPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/talent" element={<TalentPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </div>
  )
}
