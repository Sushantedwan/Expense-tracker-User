import React, { useEffect, useState } from 'react';
import API from '../api';
import TransactionCard from '../components/TransactionCard';
import { formatCurrency } from '../utils';
import PageWrapper from '../components/PageWrapper';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [overview, setOverview] = useState({ income: 0, expense: 0, total: 0 });

  const fetchData = async () => {
    try {
      const res = await API.get('/transactions');
      const summary = await API.get('/transactions/overview');
      setTransactions(res.data);
      setOverview(summary.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageWrapper>
      <h2 className="mb-4 text-primary fw-bold">
        <i className="bi bi-house-door-fill me-2"></i>Dashboard
      </h2>

      {/* Balance Overview Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="bg-white shadow-sm rounded-4 p-4 border-start border-4 border-primary">
            <h6 className="text-muted mb-2">Total Balance</h6>
            <h4 className="fw-bold text-primary">{formatCurrency(overview.total)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white shadow-sm rounded-4 p-4 border-start border-4 border-success">
            <h6 className="text-muted mb-2">Total Income</h6>
            <h4 className="fw-bold text-success">{formatCurrency(overview.income)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white shadow-sm rounded-4 p-4 border-start border-4 border-danger">
            <h6 className="text-muted mb-2">Total Expenses</h6>
            <h4 className="fw-bold text-danger">{formatCurrency(overview.expense)}</h4>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="fw-semibold text-dark mb-0">Recent Transactions</h5>
          <a href="/add" className="btn btn-outline-primary btn-sm rounded-pill">
            <i className="bi bi-plus-circle me-1"></i>Add Transaction
          </a>
        </div>

        {transactions.length === 0 ? (
          <div className="alert alert-info rounded-3">
            No transactions found. Start by adding your first one!
          </div>
        ) : (
          <ul className="list-group">
            {transactions.map((txn) => (
              <TransactionCard key={txn._id} txn={txn} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
