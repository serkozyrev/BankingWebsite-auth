import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import AuthContext from "../../context/auth-context";
import "./Graphs.css";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function parseAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// ─── constants ───────────────────────────────────────────────────────────────

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CHART_COLORS = [
  "#6366f1", "#22d3ee", "#f59e0b", "#10b981",
  "#f43f5e", "#8b5cf6", "#3b82f6", "#84cc16",
  "#ec4899", "#14b8a6", "#f97316", "#a855f7",
];

// ─── component ───────────────────────────────────────────────────────────────

export default function ExpenseChartsPage() {
  const authCtx = useContext(AuthContext);

  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + authCtx.authToken);
        headers.append("Content-Type", "application/json");

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/expense/all`,
          { method: "GET", headers }
        );

        if (!response.ok) throw new Error("Failed to load expenses");

        const data = await response.json();
        // Server returns: { expenses: [ { id, description, amount, expenses: [...] } ] }
        setAccounts(Array.isArray(data.expenses) ? data.expenses : []);
      } catch (err) {
        setError(err.message || "Something went wrong while loading expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [authCtx.authToken]);

  // ── derived: selected account ──────────────────────────────────────────────

  const selectedAccount = useMemo(() => {
    if (selectedAccountId === "all") return null;
    return (
      accounts.find(
        (account) => String(account.id) === String(selectedAccountId)
      ) || null
    );
  }, [accounts, selectedAccountId]);

  // ── derived: parse raw expenses into normalised shape ──────────────────────
  // Server expense fields: { id, description, amount, day, month, year,
  //                          category, accountType, type, amountindollar }

  const parsedExpenses = useMemo(() => {
    const rawExpenses =
      selectedAccountId === "all"
        ? accounts.flatMap((account) =>
            (account.expenses || []).map((expense) => ({
              ...expense,
              parentAccountId: account.id,
              parentAccountDescription: account.description,
            }))
          )
        : (selectedAccount?.expenses || []).map((expense) => ({
            ...expense,
            parentAccountId: selectedAccount.id,
            parentAccountDescription: selectedAccount.description,
          }));

    return rawExpenses
      .map((item, index) => {
        const parsedDate = new Date(
          Number(item.year),
          Number(item.month) - 1,
          Number(item.day)
        );

        return {
          id: item.id || index,
          description: item.description || "No description",
          category: item.category || "Uncategorized",
          // prefer amountindollar, fall back to amount (expense_balance in DB)
          amount: Math.abs(parseAmount(item.amountindollar ?? item.amount)),
          date: parsedDate,
          accountType: item.accountType || "",
          accountDescription: item.parentAccountDescription || "",
          transactionType: item.type || "",
        };
      })
      .filter((item) => !Number.isNaN(item.date.getTime()));
  }, [accounts, selectedAccount, selectedAccountId]);

  // ── derived: available years ───────────────────────────────────────────────

  const availableYears = useMemo(() => {
    const years = [
      ...new Set(parsedExpenses.map((item) => item.date.getFullYear())),
    ].sort((a, b) => b - a);
    return years.length ? years : [new Date().getFullYear()];
  }, [parsedExpenses]);

  // reset year if it's no longer in the available list
  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // ── derived: filter by selected year ──────────────────────────────────────

  const filteredByYear = useMemo(
    () =>
      parsedExpenses.filter(
        (item) => item.date.getFullYear() === selectedYear
      ),
    [parsedExpenses, selectedYear]
  );

  // ── derived: filter by transaction type ───────────────────────────────────

  const filteredByType = useMemo(() => {
    if (selectedTransactionType === "all") return filteredByYear;
    return filteredByYear.filter(
      (item) => item.transactionType.toLowerCase() === selectedTransactionType
    );
  }, [filteredByYear, selectedTransactionType]);

  // ── derived: monthly bar chart data (stacked by category) ─────────────────

  const monthlyCategoryData = useMemo(() => {
    const categorySet = new Set();
    const monthMap = Array.from({ length: 12 }, (_, i) => ({
      month: MONTH_LABELS[i],
    }));

    filteredByType.forEach((expense) => {
      const monthIndex = expense.date.getMonth();
      categorySet.add(expense.category);
      monthMap[monthIndex][expense.category] =
        (monthMap[monthIndex][expense.category] || 0) + expense.amount;
    });

    const categories = Array.from(categorySet);
    monthMap.forEach((row) => {
      categories.forEach((cat) => {
        if (!row[cat]) row[cat] = 0;
      });
    });

    return { data: monthMap, categories };
  }, [filteredByType]);

  // ── derived: pie chart / table data ───────────────────────────────────────

  const yearlyTotalsByCategory = useMemo(() => {
    const totals = filteredByType.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredByType]);

  // ── derived: summary cards ─────────────────────────────────────────────────

  const totalYearSpend = useMemo(
    () => filteredByType.reduce((sum, item) => sum + item.amount, 0),
    [filteredByType]
  );

  // ── derived: searchable / sorted expense list ─────────────────────────────

  const expenseList = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return filteredByType
      .filter((item) => {
        if (!term) return true;
        return (
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.accountType.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => b.date - a.date);
  }, [filteredByType, searchTerm]);

  // ── loading / error states ─────────────────────────────────────────────────

  if (loading) return <div className="centeredMessage">Loading charts…</div>;
  if (error) return <div className="errorMessage">{error}</div>;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="page">

      {/* ── header + filters ── */}
      <div className="headerRow">
        <div className="headerTitle">
          <h1 className="title">Expense Analytics</h1>
          <p className="subtitle">
            Monthly spend by category · yearly totals · full expense list
          </p>
        </div>

        <div className="filtersGroup">
          <div className="filterItem">
            <label className="label">Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="select"
            >
              <option value="all">All accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.description}
                </option>
              ))}
            </select>
          </div>

          <div className="filterItem">
            <label className="label">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="select"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="filterItem">
            <label className="label">Type</label>
            <div className="toggleGroup">
              {["all", "expense", "transfer"].map((type) => (
                <button
                  key={type}
                  className={`toggleBtn${selectedTransactionType === type ? " active" : ""}`}
                  onClick={() => setSelectedTransactionType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── summary cards ── */}
      <div className="summaryRow">
        <div className="summaryCard">
          <div className="summaryLabel">Total spend in {selectedYear}</div>
          <div className="summaryValue">{formatCurrency(totalYearSpend)}</div>
        </div>
        <div className="summaryCard">
          <div className="summaryLabel">Categories</div>
          <div className="summaryValue">{yearlyTotalsByCategory.length}</div>
        </div>
        <div className="summaryCard">
          <div className="summaryLabel">Transactions</div>
          <div className="summaryValue">{filteredByType.length}</div>
        </div>
        {selectedAccount && (
          <div className="summaryCard accent">
            <div className="summaryLabel">Account balance</div>
            <div className="summaryValue">
              {formatCurrency(selectedAccount.amount)}
            </div>
          </div>
        )}
      </div>

      {/* ── stacked bar chart ── */}
      <div className="card">
        <h2 className="sectionTitle">Monthly spend by category — {selectedYear}</h2>
        {monthlyCategoryData.categories.length === 0 ? (
          <p className="emptyState">No expenses found for this period.</p>
        ) : (
          <div className="chartContainer">
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={monthlyCategoryData.data}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)" }} />
                <YAxis
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: "var(--text-muted)" }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                {monthlyCategoryData.categories.map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="expenses"
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    radius={
                      index === monthlyCategoryData.categories.length - 1
                        ? [4, 4, 0, 0]
                        : 0
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── pie chart + totals table ── */}
      <div className="twoColumnGrid">
        <div className="card">
          <h2 className="sectionTitle">Breakdown by category</h2>
          {yearlyTotalsByCategory.length === 0 ? (
            <p className="emptyState">No data available.</p>
          ) : (
            <div className="chartContainerSmall">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={yearlyTotalsByCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {yearlyTotalsByCategory.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="sectionTitle">Yearly totals by category</h2>
          <div className="categoryTableWrapper">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {yearlyTotalsByCategory.map((item, index) => (
                  <tr key={item.name}>
                    <td>
                      <span
                        className="colorDot"
                        style={{
                          background:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      {item.name}
                    </td>
                    <td>{formatCurrency(item.value)}</td>
                    <td>
                      {totalYearSpend > 0
                        ? ((item.value / totalYearSpend) * 100).toFixed(1) + "%"
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── expense list ── */}
      <div className="card">
        <div className="listHeader">
          <h2 className="sectionTitle">
            Expense list
            <span className="badge">{expenseList.length}</span>
          </h2>
          <input
            type="text"
            placeholder="Search description, category, or account…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
        </div>

        <div className="expenseTableWrapper">
          {expenseList.length === 0 ? (
            <p className="emptyState">No expenses match your search.</p>
          ) : (
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenseList.map((expense) => (
                  <tr key={expense.id}>
                    <td className="dateCell">
                      {expense.date.toLocaleDateString("en-CA")}
                    </td>
                    <td>{expense.description}</td>
                    <td>
                      <span className="categoryTag">{expense.category}</span>
                    </td>
                    <td>{expense.accountDescription || "—"}</td>
                    <td>{expense.transactionType || "—"}</td>
                    <td className="amountCell">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
