import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { apiFetch } from './api';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    apiFetch('/api/v1/auth/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogout = async () => {
    await apiFetch('/api/v1/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  };

  if (checkingAuth) {
    return <div className="center-msg">Loading SafeSpeak...</div>;
  }

  return (
    <BrowserRouter>
      <header className="navbar">
        <Link to="/" className="brand">SafeSpeak</Link>
        <nav>
          {user ? (
            <>
              <span className="user-pill">
                {user.username} ({user.role})
              </span>
              <Link to="/">Dashboard</Link>
              <Link to="/change-password">Change Password</Link>
              <button type="button" className="btn-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Dashboard user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/change-password"
            element={
              user ? (
                <ChangePassword setUser={setUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
