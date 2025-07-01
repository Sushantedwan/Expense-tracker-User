// Format amount to INR currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  // Format date to DD-MM-YYYY
  export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  
  // Calculate total, income, and expense from transactions
  export function calculateOverview(transactions) {
    let income = 0;
    let expense = 0;
  
    transactions.forEach((txn) => {
      const amount = parseFloat(txn.amount);
      if (txn.type === 'income') income += amount;
      else if (txn.type === 'expense') expense += amount;
    });
  
    return {
      income,
      expense,
      total: income - expense,
    };
  }
  
  // Group expenses by category
  export function groupByCategory(transactions) {
    const categoryTotals = {};
    transactions.forEach((txn) => {
      if (txn.type === 'expense') {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + parseFloat(txn.amount);
      }
    });
    return categoryTotals;
  }
  