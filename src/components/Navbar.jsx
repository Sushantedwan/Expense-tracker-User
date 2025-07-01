import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 mb-4 rounded-bottom">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <i className="bi bi-wallet2 fs-4 me-2"></i>ExpenseTracker
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          {user && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-house-door me-1"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add">
                  <i className="bi bi-plus-circle me-1"></i>Add Transaction
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/reports">
                  <i className="bi bi-bar-chart me-1"></i>Reports
                </Link>
              </li>
            </ul>
          )}

          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item d-flex align-items-center">
                <span className="me-3 text-muted">
                  <i className="bi bi-person-circle me-1"></i>{user.name}
                </span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill">
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
