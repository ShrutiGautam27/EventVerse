import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Auth() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const { showToast } = useToast()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const onLogin = (e) => {
    e.preventDefault()
    const email = loginForm.email.trim()
    const loggedIn = login(email, loginForm.password)
    if (!loggedIn) return showToast('Invalid login details.')
    showToast(`Welcome back, ${loggedIn.name}!`)
    navigate('/')
  }

  const onSignup = (e) => {
    e.preventDefault()
    const { name, email, password, confirm } = signupForm
    if (password !== confirm) return showToast('Passwords do not match.')
    if (password.length < 6) return showToast('Password must contain at least 6 characters.')
    signup({ name: name.trim(), email: email.trim(), password })
    showToast('Account created successfully!')
    navigate('/')
  }

  const setL = (f) => (e) => setLoginForm({ ...loginForm, [f]: e.target.value })
  const setS = (f) => (e) => setSignupForm({ ...signupForm, [f]: e.target.value })

  return (
    <section id="loginPage" className="page active">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-logo">
            <i className="fa-solid fa-ticket"></i>
          </div>
          <span className="eyebrow">EVENTVERSE</span>
          <h1>Your events. Your memories.</h1>
          <p>Login to manage your event passes, saved events and bookings.</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} id="loginTab" onClick={() => setMode('login')}>
              Login
            </button>
            <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} id="signupTab" onClick={() => setMode('signup')}>
              Create account
            </button>
          </div>

          {mode === 'login' ? (
            <form id="loginForm" onSubmit={onLogin}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input type="email" id="loginEmail" required placeholder="you@example.com" value={loginForm.email} onChange={setL('email')} />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="loginPassword"
                    required
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={setL('password')}
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Show or hide password">
                    <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                  </button>
                </div>
              </div>
              <button className="primary-btn full-btn">
                Login <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          ) : (
            <form id="signupForm" onSubmit={onSignup}>
              <div className="form-group">
                <label htmlFor="signupName">Full Name</label>
                <input type="text" id="signupName" required placeholder="Your name" value={signupForm.name} onChange={setS('name')} />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email</label>
                <input type="email" id="signupEmail" required placeholder="you@example.com" value={signupForm.email} onChange={setS('email')} />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password</label>
                <input type="password" id="signupPassword" minLength={6} required placeholder="Minimum 6 characters" value={signupForm.password} onChange={setS('password')} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" required placeholder="Repeat password" value={signupForm.confirm} onChange={setS('confirm')} />
              </div>
              <button className="primary-btn full-btn">
                Create Account <i className="fa-solid fa-user-plus"></i>
              </button>
            </form>
          )}

          <p className="demo-note">Demo mode: account details are stored in your browser.</p>
        </div>
      </div>
    </section>
  )
}
