import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import ChatWidget from './components/ChatWidget'
import { ShortlistBar } from './components/Shortlist'
import { useLang } from './i18n'
import Home from './pages/Home'
// Other pages load on demand, so the first visit downloads less on mobile data.
const Clients = lazy(() => import('./pages/Clients'))
const Apply = lazy(() => import('./pages/Apply'))
const TalentPage = lazy(() => import('./pages/TalentPage'))
const AcademyPage = lazy(() => import('./pages/AcademyPage'))
const CastingsPage = lazy(() => import('./pages/CastingsPage'))
const TrustPage = lazy(() => import('./pages/TrustPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const StoriesPage = lazy(() => import('./pages/StoriesPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const VerifyPage = lazy(() => import('./pages/VerifyPage'))
const ParentsPage = lazy(() => import('./pages/ParentsPage'))
const CompCardPage = lazy(() => import('./pages/CompCardPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const ModelPage = lazy(() => import('./pages/ModelPage'))
import GalleryPage from './pages/GalleryPage'
const PackagePage = lazy(() => import('./pages/PackagePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const ReviewPage = lazy(() => import('./pages/ReviewPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const { lang } = useLang()

  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
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
          <Route path="/review" element={<ReviewPage />} />
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
        </Suspense>
      </main>
      <Footer />
      <ShortlistBar />
      <ChatWidget lang={lang} />
      <Analytics />
    </>
  )
}
