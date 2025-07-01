import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';
import API from '../api';
import Alert from '../components/Alert';
import PageWrapper from '../components/PageWrapper';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setType('danger');
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      const res = await API.post('/auth/register', { name, email, password });
      login(res.data.user, res.data.token);
      setType('success');
      setMessage('Registration successful!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setType('danger');
      setMessage(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <PageWrapper>
      <div className="col-md-6 offset-md-3">
        <h2 className="mb-4 text-primary fw-bold">
          <i className="bi bi-person-plus me-2"></i>Register
        </h2>

        <Alert type={type} message={message} onClose={() => setMessage('')} />

        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded-4">
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            <i className="bi bi-person-check me-2"></i>Register
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

export default Register;
