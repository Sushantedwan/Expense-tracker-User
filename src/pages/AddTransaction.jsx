import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Alert from '../components/Alert';
import PageWrapper from '../components/PageWrapper';

function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date || !description) {
      setMsgType('danger');
      setMessage('Please fill all fields.');
      return;
    }

    try {
      await API.post('/transactions', {
        amount,
        type,
        category,
        date,
        description,
      });
      setMsgType('success');
      setMessage('Transaction added successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMsgType('danger');
      setMessage(err.response?.data?.msg || 'Failed to add transaction');
    }
  };

  return (
    <PageWrapper>
      <div className="col-md-6 offset-md-3">
        <h2 className="mb-4 text-primary fw-bold">
          <i className="bi bi-plus-circle me-2"></i>Add Transaction
        </h2>

        <Alert type={msgType} message={message} onClose={() => setMessage('')} />

        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded-4">
          {/* Amount */}
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <label htmlFor="amount">Amount (₹)</label>
          </div>

          {/* Type */}
          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <label htmlFor="type">Type</label>
          </div>

          {/* Category */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="category"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="category">Category</label>
          </div>

          {/* Date */}
          <div className="form-floating mb-3">
            <input
              type="date"
              className="form-control"
              id="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <label htmlFor="date">Date</label>
          </div>

          {/* Description */}
          <div className="form-floating mb-4">
            <textarea
              className="form-control"
              id="description"
              placeholder="Description"
              style={{ height: '100px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <label htmlFor="description">Description</label>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            <i className="bi bi-check-circle me-2"></i>Save Transaction
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

export default AddTransaction;
