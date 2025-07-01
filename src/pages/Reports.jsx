import React, { useEffect, useState } from 'react';
import API from '../api';
import { groupByCategory, formatCurrency } from '../utils';
import PageWrapper from '../components/PageWrapper';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/transactions');
        setTransactions(res.data);
        extractFilters(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      result = result.filter((txn) => {
        const d = new Date(txn.date);
        return d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year);
      });
    }

    if (typeFilter) {
      result = result.filter((txn) => txn.type === typeFilter);
    }

    if (categoryFilter) {
      result = result.filter((txn) => txn.category === categoryFilter);
    }

    setFiltered(result);
  }, [selectedMonth, typeFilter, categoryFilter, transactions]);

  const extractFilters = (txns) => {
    const monthSet = new Set();
    const categorySet = new Set();

    txns.forEach((txn) => {
      const date = new Date(txn.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthSet.add(key);
      categorySet.add(txn.category);
    });

    setAvailableMonths([...monthSet].sort((a, b) => b.localeCompare(a)));
    setCategories([...categorySet].sort());
  };

  const categoryData = groupByCategory(filtered);

  const monthlyData = filtered.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    if (txn.type === 'income') acc[month].income += parseFloat(txn.amount);
    else if (txn.type === 'expense') acc[month].expense += parseFloat(txn.amount);
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map((d) => d.income),
        backgroundColor: '#198754',
      },
      {
        label: 'Expense',
        data: Object.values(monthlyData).map((d) => d.expense),
        backgroundColor: '#dc3545',
      },
    ],
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#0d6efd',
          '#6f42c1',
          '#fd7e14',
          '#20c997',
          '#dc3545',
          '#ffc107',
          '#198754',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const csv = Papa.unparse(
      filtered.map((txn) => ({
        Date: new Date(txn.date).toLocaleDateString(),
        Type: txn.type,
        Amount: txn.amount,
        Category: txn.category,
        Description: txn.description,
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `transactions_${selectedMonth || 'all'}.csv`);
  };

  const exportPDF = () => {
    if (filtered.length === 0) return;
    const doc = new jsPDF();
    doc.text('Transaction Report', 14, 18);
    doc.setFontSize(10);
    doc.text(`Filters: Month=${selectedMonth || 'All'}, Type=${typeFilter || 'All'}, Category=${categoryFilter || 'All'}`, 14, 26);

    autoTable(doc, {
      startY: 30,
      head: [['Date', 'Type', 'Amount', 'Category', 'Description']],
      body: filtered.map((txn) => [
        new Date(txn.date).toLocaleDateString(),
        txn.type.toUpperCase(),
        txn.amount,
        txn.category,
        txn.description,
      ]),
      styles: { fontSize: 10 },
      theme: 'striped',
    });

    doc.save(`transactions_${selectedMonth || 'all'}.pdf`);
  };

  return (
    <PageWrapper>
      <h2 className="mb-4 text-primary fw-bold">
        <i className="bi bi-bar-chart-line-fill me-2"></i>Reports
      </h2>

      {/* Filters and Export */}
      <div className="row g-3 align-items-end mb-4">
        {/* Month */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Month</label>
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {new Date(`${m}-01`).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Type</label>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Category</label>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Export Buttons */}
        <div className="col-md-3 text-end">
          <button className="btn btn-outline-primary btn-sm me-2 rounded-pill" onClick={exportCSV}>
            <i className="bi bi-file-earmark-spreadsheet me-1"></i>Export CSV
          </button>
          <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={exportPDF}>
            <i className="bi bi-file-earmark-pdf me-1"></i>Export PDF
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        {/* Pie Chart */}
        <div className="col-md-6">
          <div className="p-4 bg-white shadow-sm rounded-4 h-100">
            <h6 className="mb-3 text-muted">Category Breakdown</h6>
            {filtered.length === 0 ? (
              <div className="text-muted small">No data for selected filters.</div>
            ) : (
              <>
                <Pie data={pieData} />
                <ul className="mt-4 list-unstyled small">
                  {Object.entries(categoryData).map(([key, val]) => (
                    <li key={key} className="mb-1">
                      <i className="bi bi-circle-fill me-2 text-muted"></i>
                      <strong>{key}</strong>: {formatCurrency(val)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-md-6">
          <div className="p-4 bg-white shadow-sm rounded-4 h-100">
            <h6 className="mb-3 text-muted">Monthly Income vs Expense</h6>
            {filtered.length === 0 ? (
              <div className="text-muted small">No data to display.</div>
            ) : (
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Reports;
