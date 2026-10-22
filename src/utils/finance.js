export function summarizeTransactions(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.kind === "income") {
        summary.income += amount;
      } else {
        summary.expense += amount;
      }

      summary.balance = summary.income - summary.expense;
      return summary;
    },
    { income: 0, expense: 0, balance: 0 },
  );
}

export function getFinancialMessage({ income, expense, balance }) {
  if (income === 0 && expense === 0) {
    return "Todavía no hay movimientos en este mes. Cargá el primero para ver tu resultado.";
  }

  if (balance > 0) {
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
    return `Cerrás el mes con saldo positivo. Tu margen actual representa el ${savingsRate}% de tus ingresos.`;
  }

  if (balance < 0) {
    return `Tus egresos superan a tus ingresos por ${formatCurrency(Math.abs(balance))}. Revisá los gastos del período.`;
  }

  return "Tus ingresos y egresos están equilibrados este mes.";
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(amount);
}
