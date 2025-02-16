import React, { useState } from "react";

// Helper functions that don't rely on component state or props
function calculateMonthlyPayment(capital, taxaJurosMensal, numMeses) {
  return (
    (capital * taxaJurosMensal) / (1 - Math.pow(1 + taxaJurosMensal, -numMeses))
  );
}

function calculateExtraAmortization(
  capitalInicial,
  taxaJurosAnual,
  prazoOriginal,
  prazoDesejado,
  custoAmortizacaoExtra
) {
  if (prazoOriginal === prazoDesejado) {
    return 0;
  }

  const taxaJurosMensal = taxaJurosAnual / 12 / 100;

  // Calculate the required monthly payment to pay off the loan in the desired term
  const prestacaoDesejada = calculateMonthlyPayment(
    capitalInicial,
    taxaJurosMensal,
    prazoDesejado
  );

  // Calculate the original monthly payment
  const prestacaoOriginal = calculateMonthlyPayment(
    capitalInicial,
    taxaJurosMensal,
    prazoOriginal
  );

  // Calculate the extra amortization required
  const amortizacaoExtraMensal =
    (prestacaoDesejada - prestacaoOriginal) / (1 + custoAmortizacaoExtra);

  return amortizacaoExtraMensal;
}

function simulateMonthlyAmortization(
  initialCapital,
  annualInterestRate,
  originalTerm,
  desiredTerm,
  extraAmortizationCost
) {
  const taxaJurosMensal = annualInterestRate / 12 / 100;

  // Calculate the original monthly payment
  const prestacaoOriginal = calculateMonthlyPayment(
    initialCapital,
    taxaJurosMensal,
    originalTerm
  );

  // Calculate the extra amortization required
  const amortizacaoExtraMensal = calculateExtraAmortization(
    initialCapital,
    annualInterestRate,
    originalTerm,
    desiredTerm,
    extraAmortizationCost
  );

  let saldo = initialCapital;
  let resultadosArray = [];

  for (let mes = 0; mes < desiredTerm; mes++) {
    let juros = saldo * taxaJurosMensal;
    let amortizacaoCapital = prestacaoOriginal - juros;
    saldo -= amortizacaoCapital;
    saldo -= amortizacaoExtraMensal * (1 + extraAmortizationCost);

    if (saldo <= 0) {
      saldo = 0;
    }

    resultadosArray.push({
      mes: mes + 1,
      saldo: saldo.toFixed(2),
      juros: juros.toFixed(2),
      amortizacaoCapital: amortizacaoCapital.toFixed(2),
      amortizacaoExtra: amortizacaoExtraMensal.toFixed(2),
      prestacao: prestacaoOriginal.toFixed(2),
    });

    if (saldo === 0) {
      break;
    }
  }

  return resultadosArray;
}

function LoanCalculator() {
  const [initialCapital, setInitialCapital] = useState(179265);
  const [annualInterestRate, setAnnualInterestRate] = useState(2.7);
  const [originalTerm, setOriginalTerm] = useState(480);
  const [desiredTerm, setDesiredTerm] = useState(240);
  const [extraAmortizationCost, setExtraAmortizationCost] = useState(0.5 / 100);
  const [results, setResults] = useState([]);

  const handleCalculate = () => {
    const resultados = simulateMonthlyAmortization(
      initialCapital,
      annualInterestRate,
      originalTerm,
      desiredTerm,
      extraAmortizationCost
    );
    setResults(resultados);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1>Simulador de Amortização Antecipada do Crédito Habitação</h1>
      <label>
        Montante do empréstimo (€):{" "}
        <input
          type="number"
          value={initialCapital}
          onChange={(e) => setInitialCapital(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Taxa de Juros Anual (%):{" "}
        <input
          type="number"
          value={annualInterestRate}
          onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Duração do empréstimo (meses):{" "}
        <input
          type="number"
          value={originalTerm}
          onChange={(e) => setOriginalTerm(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Duração do empréstimo Desejado (meses):{" "}
        <input
          type="number"
          value={desiredTerm}
          onChange={(e) => setDesiredTerm(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Custo Amortização Extra (%):{" "}
        <input
          type="number"
          step="0.01"
          value={extraAmortizationCost * 100}
          onChange={(e) =>
            setExtraAmortizationCost(Number(e.target.value) / 100)
          }
        />
      </label>
      <br />
      <button
        onClick={handleCalculate}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Calcular
      </button>
      <h3>Quadro de reembolso do empréstimo</h3>
      <table
        border="1"
        cellPadding="5"
        style={{ width: "100%", marginTop: "10px" }}
      >
        <thead>
          <tr>
            <th>Número de prestação</th>
            <th>Capital em Dívida (fim do período) (€)</th>
            <th>Juros (€)</th>
            <th>Amortização de capital (€)</th>
            <th>Amortização Extra (€)</th>
            <th>Prestação (€)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => (
            <tr key={index}>
              <td>{r.mes}</td>
              <td>{r.saldo}</td>
              <td>{r.juros}</td>
              <td>{r.amortizacaoCapital}</td>
              <td>{r.amortizacaoExtra}</td>
              <td>{r.prestacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoanCalculator;
