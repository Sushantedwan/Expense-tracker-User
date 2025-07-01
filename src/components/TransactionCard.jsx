// components/TransactionCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../utils';

function TransactionCard({ txn, onDelete }) {
  const isIncome = txn.type === 'income';

  return (
    <motion.li
      className="list-group-item bg-white border-0 rounded-4 shadow-sm px-4 py-3 mb-3 d-flex justify-content-between align-items-center flex-wrap"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div>
        <h6 className={`mb-1 fw-semibold ${isIncome ? 'text-success' : 'text-danger'}`}>
          <i className={`bi ${isIncome ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle'} me-2`}></i>
          {formatCurrency(txn.amount)} - {txn.description}
        </h6>
        <small className="text-muted">
          {formatDate(txn.date)} • <span className="badge bg-light text-dark">{txn.category}</span>
        </small>
      </div>
      <div className="mt-2 mt-sm-0">
        <button
          className="btn btn-outline-danger btn-sm rounded-pill"
          onClick={() => onDelete(txn._id)}
        >
          <i className="bi bi-trash3 me-1"></i> Delete
        </button>
      </div>
    </motion.li>
  );
}

export default TransactionCard;
