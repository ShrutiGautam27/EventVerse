import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { StoreProvider } from './context/StoreContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { UIProvider } from './context/UIContext'

import ChatBot from './components/ChatBot'
import Footer from './components/Footer'
import MobileMenu from './components/MobileMenu'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import Toast from './components/Toast'

import About from './pages/About'
import Auth from './pages/Auth'
import Calendar from './pages/Calendar'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import EventDetails from './pages/EventDetails'
import Home from './pages/Home'
import MapPage from './pages/Map'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import TicketPage from './pages/TicketPage'

// Router is provided by main.jsx (HashRouter) or by tests (MemoryRouter).
function EntryRoute() {
  const { user } = useAuth()
  // Do not expose the Home page as the first screen to logged-out visitors.
  return user ? <Home /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <StoreProvider>
            <UIProvider>
              <ScrollToTop />
              <Navbar />
              <MobileMenu />

              <main>
                <Routes>
                  <Route path="/" element={<EntryRoute />} />
                  <Route path="/events" element={<Discover />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/events/:id/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                  <Route path="/ticket/:bookingId" element={<ProtectedRoute><TicketPage /></ProtectedRoute>} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <ChatBot />
              <Toast />
              <Footer />
            </UIProvider>
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
