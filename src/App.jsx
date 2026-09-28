import { useState } from 'react'
import './App.css'

const TOKEN_KEY = 'mst-demo-token'

function encodeBase64Url(value) {
  return btoa(JSON.stringify(value))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function createDemoToken(user) {
  const header = encodeBase64Url({ alg: 'none', typ: 'JWT' })
  const payload = encodeBase64Url({
    userId: user.userId,
    username: user.username,
    role: user.role,
    exp: Date.now() + 60 * 60 * 1000,
  })

  return `${header}.${payload}.demo-signature`
}

function readDemoToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  try {
    const [, encodedPayload] = token.split('.')
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.userId || !payload.role || payload.exp <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    return { ...payload, token }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
}

function App() {
  const [session, setSession] = useState(readDemoToken)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(event) {
    event.preventDefault()
    const account = {
      admin: { userId: 'USR-001', role: 'Administrator' },
      student: { userId: 'USR-002', role: 'Student' },
    }[username.trim().toLowerCase()]

    if (!account || password !== 'password123') {
      setError('That username and password do not match.')
      return
    }

    const user = { ...account, username: username.trim() }
    const token = createDemoToken(user)
    localStorage.setItem(TOKEN_KEY, token)
    setSession({ ...user, token })
    setError('')
    setPassword('')
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setSession(null)
    setUsername('')
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Gate home">
          <span className="wordmark-mark">G</span>gate<span className="wordmark-period">.</span>
        </a>
        <span className="topbar-note">PRACTICAL MST <span>·</span> QUESTION 02</span>
        <span className="topbar-status"><span className="status-dot" /> DEMO ENVIRONMENT</span>
      </header>

      <div className="main-grid" id="top">
        <section className="intro-panel" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> AUTHENTICATION / 01</p>
            <h1 id="page-title">One identity.<br /><em>One secure</em><br />way in.</h1>
            <p className="intro-description">A simple sign-in flow, with a token that carries the details your app needs to know.</p>
          </div>

          <div className="flow-block">
            <p className="section-label">THE LOGIN FLOW</p>
            <ol className="flow-list">
              <li><span className="flow-number">01</span><span><strong>Authenticate</strong><small>Credentials are checked by a server.</small></span></li>
              <li><span className="flow-number">02</span><span><strong>Issue a token</strong><small>A JWT carries claims like user ID and role.</small></span></li>
              <li><span className="flow-number">03</span><span><strong>Authorize</strong><small>The app uses the token to allow access.</small></span></li>
            </ol>
          </div>
          <p className="panel-footnote">JWT = JSON Web Token <span>·</span> Header . Payload . Signature</p>
        </section>

        <section className="workspace-panel" aria-live="polite">
          {session ? (
            <div className="dashboard-view">
              <div className="panel-heading">
                <p className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> ACCESS GRANTED</p>
                <button className="text-button" onClick={handleLogout} type="button">Sign out <span aria-hidden="true">↗</span></button>
              </div>
              <div className="welcome-block">
                <div className="avatar" aria-hidden="true">{session.username.slice(0, 1).toUpperCase()}</div>
                <p className="welcome-kicker">YOUR DASHBOARD</p>
                <h2>Welcome back,<br /><em>{session.username}.</em></h2>
                <p className="welcome-description">Your session is active. Your role determines what you can access.</p>
              </div>
              <div className="account-details">
                <div><span className="detail-label">ACCOUNT ROLE</span><span className="role-value"><span className="role-dot" />{session.role}</span></div>
                <div><span className="detail-label">USER ID</span><span className="detail-value">{session.userId}</span></div>
                <div><span className="detail-label">SESSION STATUS</span><span className="session-value">ACTIVE <span className="session-check">✓</span></span></div>
              </div>
              <div className="token-preview"><span className="detail-label">STORED TOKEN</span><code>{session.token.slice(0, 35)}…</code></div>
              <p className="demo-warning">Demo only: this token is not signed or secure. Production apps must verify JWTs on a server.</p>
            </div>
          ) : (
            <div className="login-view">
              <div className="panel-heading">
                <p className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> MEMBER ACCESS</p>
                <span className="step-count">01 <span>/</span> 01</span>
              </div>
              <div className="login-heading">
                <h2>Welcome<br />to <em>your space.</em></h2>
                <p>Enter your details to continue.</p>
              </div>
              <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="username">USERNAME</label>
                <input id="username" name="username" autoComplete="username" placeholder="e.g. alex.morgan" value={username} onChange={(event) => setUsername(event.target.value)} required />
                <div className="password-label-row"><label htmlFor="password">PASSWORD</label><span>DEMO CREDENTIALS BELOW</span></div>
                <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="login-button" type="submit">Sign in <span aria-hidden="true">↗</span></button>
              </form>
              <div className="demo-accounts">
                <span className="detail-label">TRY THE DEMO</span>
                <p><button type="button" onClick={() => { setUsername('admin'); setPassword('password123') }}>admin</button> <span>or</span> <button type="button" onClick={() => { setUsername('student'); setPassword('password123') }}>student</button><span className="demo-password">password123</span></p>
              </div>
              <p className="privacy-note">Your credentials stay in this browser demo.</p>
            </div>
          )}
        </section>
      </div>

      <footer className="page-footer"><span>IDENTITY, SIMPLIFIED.</span><span>AUTHENTICATION &nbsp;·&nbsp; AUTHORIZATION &nbsp;·&nbsp; ACCESS</span><span>2026</span></footer>
    </main>
  )
}

export default App
