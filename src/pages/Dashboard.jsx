import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/authService";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../services/transactionService";
import {
  formatCurrency,
  getFinancialMessage,
  summarizeTransactions,
} from "../utils/finance";
import "./Dashboard.css";

const categories = {
  income: ["Ventas", "Honorarios", "Sueldo", "Inversiones", "Otros ingresos"],
  expense: ["Proveedores", "Servicios", "Impuestos", "Alquiler", "Sueldos", "Otros egresos"],
};

function getLocalDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return getLocalDate().slice(0, 7);
}

function getDefaultDate(month) {
  const today = getLocalDate();
  if (month === today.slice(0, 7)) return today;

  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return `${month}-${String(lastDay).padStart(2, "0")}`;
}

function emptyForm(month) {
  return {
    kind: "income",
    amount: "",
    category: categories.income[0],
    description: "",
    occurred_on: getDefaultDate(month),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [month, setMonth] = useState(getCurrentMonth());
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(() => emptyForm(getCurrentMonth()));
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTransactions() {
    setIsLoading(true);
    setError("");

    try {
      setTransactions(await listTransactions(month));
    } catch {
      setError("No pudimos cargar tus movimientos. Intentá nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isCurrent = true;

    listTransactions(month)
      .then((data) => {
        if (isCurrent) setTransactions(data);
      })
      .catch(() => {
        if (isCurrent) {
          setError("No pudimos cargar tus movimientos. Intentá nuevamente.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [month]);

  const summary = useMemo(
    () => summarizeTransactions(transactions),
    [transactions],
  );

  function handleKindChange(kind) {
    setForm((current) => ({
      ...current,
      kind,
      category: categories[kind][0],
    }));
  }

  function handleMonthChange(event) {
    const nextMonth = event.target.value;
    if (!nextMonth) return;

    setIsLoading(true);
    setError("");
    setMonth(nextMonth);
    setEditingId(null);
    setForm(emptyForm(nextMonth));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Ingresá un monto mayor a cero.");
      return;
    }

    if (!form.category.trim() || !form.occurred_on) {
      setError("Completá la categoría y la fecha.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      ...form,
      amount,
      description: form.description.trim() || null,
    };

    try {
      if (editingId) {
        await updateTransaction(editingId, payload);
      } else {
        await createTransaction(payload);
      }

      setEditingId(null);
      setForm(emptyForm(month));
      await loadTransactions();
    } catch {
      setError("No pudimos guardar el movimiento. Revisá los datos e intentá nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);
    setForm({
      kind: transaction.kind,
      amount: String(transaction.amount),
      category: transaction.category,
      description: transaction.description ?? "",
      occurred_on: transaction.occurred_on,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Querés eliminar este movimiento?")) return;

    setError("");
    try {
      await deleteTransaction(id);
      setTransactions((current) => current.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm(month));
      }
    } catch {
      setError("No pudimos eliminar el movimiento. Intentá nuevamente.");
    }
  }

  async function handleLogout() {
    setError("");
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch {
      setError("No pudimos cerrar la sesión. Intentá nuevamente.");
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__brand">CONSULIR</p>
          <h1>Tu panorama financiero</h1>
          <p className="dashboard__user">{user?.email}</p>
        </div>
        <button className="button button--ghost" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {error && <p className="dashboard__error" role="alert">{error}</p>}

      <section className="dashboard__toolbar" aria-label="Período seleccionado">
        <label htmlFor="month">Mes a consultar</label>
        <input
          id="month"
          type="month"
          max={getCurrentMonth()}
          value={month}
          onChange={handleMonthChange}
          required
        />
      </section>

      <section className="summary-grid" aria-label="Resumen mensual">
        <article className="summary-card summary-card--income">
          <span>Ingresos</span>
          <strong>{formatCurrency(summary.income)}</strong>
        </article>
        <article className="summary-card summary-card--expense">
          <span>Egresos</span>
          <strong>{formatCurrency(summary.expense)}</strong>
        </article>
        <article className={`summary-card ${summary.balance < 0 ? "summary-card--negative" : "summary-card--balance"}`}>
          <span>Resultado</span>
          <strong>{formatCurrency(summary.balance)}</strong>
        </article>
      </section>

      <section className="dashboard__insight">
        <span className="material-symbols-outlined" aria-hidden="true">insights</span>
        <div>
          <h2>Lectura del mes</h2>
          <p>{getFinancialMessage(summary)}</p>
        </div>
      </section>

      <div className="dashboard__columns">
        <section className="dashboard-card" aria-labelledby="transaction-form-title">
          <h2 id="transaction-form-title">
            {editingId ? "Editar movimiento" : "Nuevo movimiento"}
          </h2>
          <form className="transaction-form" onSubmit={handleSubmit}>
            <fieldset className="transaction-form__kind">
              <legend>Tipo</legend>
              <label>
                <input
                  type="radio"
                  name="kind"
                  value="income"
                  checked={form.kind === "income"}
                  onChange={() => handleKindChange("income")}
                />
                Ingreso
              </label>
              <label>
                <input
                  type="radio"
                  name="kind"
                  value="expense"
                  checked={form.kind === "expense"}
                  onChange={() => handleKindChange("expense")}
                />
                Egreso
              </label>
            </fieldset>

            <label>
              Monto
              <input
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
                placeholder="0,00"
                required
              />
            </label>

            <label>
              Categoría
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                required
              >
                {categories[form.kind].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Fecha
              <input
                type="date"
                max={getLocalDate()}
                value={form.occurred_on}
                onChange={(event) => setForm({ ...form, occurred_on: event.target.value })}
                required
              />
            </label>

            <label>
              Descripción <span>(opcional)</span>
              <textarea
                maxLength="200"
                rows="3"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Agregá un detalle breve"
              />
            </label>

            <div className="transaction-form__actions">
              <button className="button button--primary" disabled={isSaving}>
                {isSaving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar movimiento"}
              </button>
              {editingId && (
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm(month));
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="dashboard-card" aria-labelledby="transactions-title">
          <div className="movements__heading">
            <h2 id="transactions-title">Movimientos</h2>
            <span>{transactions.length}</span>
          </div>

          {isLoading ? (
            <p className="movements__empty">Cargando movimientos...</p>
          ) : transactions.length === 0 ? (
            <p className="movements__empty">No hay movimientos cargados para este mes.</p>
          ) : (
            <ul className="movements">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="movement">
                  <div className={`movement__icon movement__icon--${transaction.kind}`} aria-hidden="true">
                    <span className="material-symbols-outlined">
                      {transaction.kind === "income" ? "south_west" : "north_east"}
                    </span>
                  </div>
                  <div className="movement__details">
                    <strong>{transaction.category}</strong>
                    <span>{transaction.description || "Sin descripción"}</span>
                    <time dateTime={transaction.occurred_on}>
                      {new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" }).format(new Date(`${transaction.occurred_on}T00:00:00Z`))}
                    </time>
                  </div>
                  <strong className={`movement__amount movement__amount--${transaction.kind}`}>
                    {transaction.kind === "expense" ? "−" : "+"}{formatCurrency(Number(transaction.amount))}
                  </strong>
                  <div className="movement__actions">
                    <button type="button" onClick={() => handleEdit(transaction)} aria-label={`Editar ${transaction.category}`}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(transaction.id)} aria-label={`Eliminar ${transaction.category}`}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
