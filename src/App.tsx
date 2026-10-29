import { Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import ChatWidget from './components/ChatWidget'
import { useLang } from './i18n'
import Home from './pages/Home'
import Clients from './pages/Clients'
import Apply from './pages/Apply'
import TalentPage from './pages/TalentPage'
import AcademyPage from './pages/AcademyPage'
import CastingsPage from './pages/CastingsPage'
import TrustPage from './pages/TrustPage'
import AboutPage from './pages/AboutPage'
import StoriesPage from './pages/StoriesPage'
import FaqPage from './pages/FaqPage'
import NotFound from './pages/NotFound'

export default function App() {
  const { lang } = useLang()

  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/talent" element={<TalentPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/castings" element={<CastingsPage />} />
          <Route path="/trust" element={<TrustPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget lang={lang} />
      <Analytics />
    </>
  )
}
