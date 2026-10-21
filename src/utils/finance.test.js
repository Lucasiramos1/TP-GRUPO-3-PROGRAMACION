import { describe, expect, it } from "vitest";
import { getFinancialMessage, summarizeTransactions } from "./finance";

describe("summarizeTransactions", () => {
  it("calcula ingresos, egresos y saldo", () => {
    const result = summarizeTransactions([
      { kind: "income", amount: "1500.50" },
      { kind: "expense", amount: 400.25 },
      { kind: "expense", amount: "100" },
    ]);

    expect(result).toEqual({ income: 1500.5, expense: 500.25, balance: 1000.25 });
  });

  it("devuelve ceros sin movimientos", () => {
    expect(summarizeTransactions([])).toEqual({ income: 0, expense: 0, balance: 0 });
  });
});

describe("getFinancialMessage", () => {
  it("informa el porcentaje disponible cuando el saldo es positivo", () => {
    expect(getFinancialMessage({ income: 1000, expense: 750, balance: 250 }))
      .toContain("25%");
  });

  it("advierte cuando los egresos superan los ingresos", () => {
    expect(getFinancialMessage({ income: 500, expense: 700, balance: -200 }))
      .toContain("superan");
  });
});
