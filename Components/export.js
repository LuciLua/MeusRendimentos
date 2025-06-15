document.addEventListener('DOMContentLoaded', () => {
  const botaoExportar = document.getElementById('export-data');

  if (botaoExportar) {
    botaoExportar.addEventListener('click', () => {
      const ativosFII = localStorage.getItem('ativosFII');
      const perfilDados = localStorage.getItem('perfilDados');

      const dadosExportados = {
        ativosFII: ativosFII ? JSON.parse(ativosFII) : null,
        perfilDados: perfilDados ? JSON.parse(perfilDados) : null
      };

      const jsonString = JSON.stringify(dadosExportados, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'dados-exportados.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  }
});
