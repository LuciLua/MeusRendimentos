document.addEventListener('DOMContentLoaded', () => {
    const inputImportar = document.getElementById('importar');
    const modalImportarExportar = document.getElementById('modal-importar-exportar');

    if (!inputImportar || !modalImportarExportar) return;

    inputImportar.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();

        leitor.onload = (e) => {
            try {
                const dados = JSON.parse(e.target.result);

                if (dados.ativosFII !== undefined) {
                    localStorage.setItem('ativosFII', JSON.stringify(dados.ativosFII));
                }

                if (dados.perfilDados !== undefined) {
                    localStorage.setItem('perfilDados', JSON.stringify(dados.perfilDados));
                }

                // Fecha o modal após importar
                modalImportarExportar.style.display = 'none';
                window.location.reload();

            } catch (erro) {
                console.error("Erro ao importar JSON:", erro);
                alert("Arquivo inválido. Certifique-se de que é um JSON com os dados corretos.");
            }
        };

        leitor.readAsText(arquivo);
    });
})