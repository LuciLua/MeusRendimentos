document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('compound-interest-form');
  const resultDiv = document.getElementById('result');
  const interestDiv = document.getElementById('interest-earned');
  const ctx = document.getElementById('investment-chart').getContext('2d');
  let chart;

  function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const principal = parseFloat(form.principal.value);
    const rate = parseFloat(form.rate.value) / 100;
    const periods = parseInt(form.periods.value);
    const monthlyContrib = parseFloat(form['monthly-contrib'].value);

    if (isNaN(principal) || isNaN(rate) || isNaN(periods) || isNaN(monthlyContrib)) {
      resultDiv.textContent = 'Por favor, preencha todos os campos corretamente.';
      interestDiv.textContent = '';
      if (chart) chart.destroy();
      return;
    }

    let saldo = principal;
    const acumulado = [];
    const investido = [];
    const lucro = [];

    for (let i = 1; i <= periods; i++) {
      saldo *= (1 + rate);
      saldo += monthlyContrib;
      const totalInvestido = principal + monthlyContrib * i;
      acumulado.push(saldo);
      investido.push(totalInvestido);
      lucro.push(saldo - totalInvestido);
    }

    const totalInvestidoFinal = investido[investido.length - 1];
    const montanteFinal = acumulado[acumulado.length - 1];
    const lucroFinal = lucro[lucro.length - 1];

    resultDiv.textContent = `Valor acumulado após ${periods} meses: ${formatMoney(montanteFinal)}`;
    interestDiv.textContent = `Total de juros ganhos: ${formatMoney(lucroFinal)} | Valor investido: ${formatMoney(totalInvestidoFinal)}`;

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: periods }, (_, i) => `${i + 1}º mês`),
        datasets: [
          {
            label: 'Valor acumulado',
            data: acumulado,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            tension: 0.2
          },
          {
            label: 'Valor investido',
            data: investido,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false,
            tension: 0.2
          },
          {
            label: 'Lucro (juros)',
            data: lucro,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => formatMoney(value)
            }
          }
        }
      }
    });
  });
});
