import { Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import ChatWidget from './components/ChatWidget'
import { ShortlistBar } from './components/Shortlist'
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
import VerifyPage from './pages/VerifyPage'
import ParentsPage from './pages/ParentsPage'
import CompCardPage from './pages/CompCardPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import ModelPage from './pages/ModelPage'
import GalleryPage from './pages/GalleryPage'
import PackagePage from './pages/PackagePage'
import NewsPage from './pages/NewsPage'
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
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/parents" element={<ParentsPage />} />
          <Route path="/compcard" element={<CompCardPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/talent/:slug" element={<ModelPage />} />
          <Route path="/p/:token" element={<PackagePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ShortlistBar />
      <ChatWidget lang={lang} />
      <Analytics />
    </>
  )
}
