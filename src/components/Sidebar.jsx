import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Toggle Button (Visible on Mobile) */}
      <button
        className="btn btn-primary position-fixed top-0 start-0 m-3 d-lg-none z-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      {/* Offcanvas Sidebar */}
      <div className="offcanvas offcanvas-start bg-white shadow-sm" tabIndex="-1" id="sidebarMenu">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title text-primary fw-bold">
            <i className="bi bi-wallet2 me-2"></i>ExpenseTracker
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between p-3">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link" to="/" data-bs-dismiss="offcanvas">
                <i className="bi bi-house-door me-2"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add" data-bs-dismiss="offcanvas">
                <i className="bi bi-plus-circle me-2"></i>Add Transaction
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports" data-bs-dismiss="offcanvas">
                <i className="bi bi-bar-chart me-2"></i>Reports
              </Link>
            </li>
          </ul>

          <div className="border-top pt-3">
            {user ? (
              <>
                <div className="text-muted small mb-2">
                  <i className="bi bi-person-circle me-2"></i>{user.name}
                </div>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger w-100 rounded-pill">
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm w-100 mb-2 rounded-pill" data-bs-dismiss="offcanvas">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm w-100 rounded-pill" data-bs-dismiss="offcanvas">
                  <i className="bi bi-person-plus me-1"></i>Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
