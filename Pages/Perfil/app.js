document.addEventListener("DOMContentLoaded", () => {
  // Inputs do modal
  const inputNome = document.getElementById('editar-nome');
  const inputEmail = document.getElementById('editar-email');
  const inputTelefone = document.getElementById('editar-telefone');
  const inputBio = document.getElementById('editar-bio');
  const inputSite = document.getElementById('editar-site');

  // Elementos de exibição do perfil
  const profilePic = document.getElementById('profile-pic');
  const userNome = document.getElementById('user-nome');
  const userEmail = document.getElementById('user-email');
  const userPhone = document.getElementById('user-phone');
  const bioTexto = document.getElementById('bio-texto');
  const siteLink = document.getElementById('site-link');

  // Botões e modal
  const editarBtn = document.getElementById('editar-perfil');
  const modal = document.getElementById('modal-editar-perfil');
  const salvarBtn = document.getElementById('salvar-perfil');
  const fecharBtn = modal.querySelector('.close-modal');


  // Função para pegar ativos do localStorage
  function getAtivos() {
    const ativosRaw = localStorage.getItem('ativosFII');
    if (!ativosRaw) {
      console.warn('Nenhum dado encontrado em ativosFII no localStorage.');
      return [];
    }
    try {
      const ativos = JSON.parse(ativosRaw);
      if (!Array.isArray(ativos)) {
        console.warn('ativosFII no localStorage não é um array.');
        return [];
      }
      return ativos;
    } catch (e) {
      console.error('Erro ao fazer parse dos ativosFII:', e);
      return [];
    }
  }

  // Criar gráfico de barras: Valor Investido vs Lucro
  function criarGraficoBarras(ativos) {
    const ctx = document.getElementById('grafico-barras').getContext('2d');

    const labels = ativos.map(a => a.nome);
    const valorInvestido = ativos.map(a => a.quantidade * a.precoMedio);
    const lucro = ativos.map(a => a.quantidade * a.rendimento);

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // seus labels
        datasets: [
          {
            label: 'Valor Investido',
            data: valorInvestido,  // seus valores
            backgroundColor: 'rgba(0,0,0,0.1)',  // cinza clarinho
            borderWidth: 0,
          },
          {
            label: 'Lucro Mensal',
            data: lucro,  // seus valores
            backgroundColor: 'rgba(0,0,0,0.5)',  // cinza um pouco mais escuro
            borderWidth: 0,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#222',
              font: {
                size: 14,
                weight: '600',
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#555',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            ticks: {
              color: '#555',
              font: {
                size: 12
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    })
  }



  // Pega ativos do localStorage
  const ativos = getAtivos();

  // Só cria os gráficos se tiver ativos
  if (ativos.length === 0) {
    console.warn('Nenhum ativo para exibir gráficos.');
    return;
  }

  criarGraficoBarras(ativos);



  function atualizarTotalFII() {
    const ativos = JSON.parse(localStorage.getItem('ativosFII')) || [];
    const totalInvestido = ativos.reduce((total, ativo) => {
      return total + (ativo.quantidade * ativo.precoMedio);
    }, 0);

    // Atualiza o texto no elemento total-fii formatado em reais
    const totalFiiElement = document.getElementById('total-fii');
    totalFiiElement.textContent = totalInvestido.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function atualizarRendaMensal() {
    const ativos = JSON.parse(localStorage.getItem('ativosFII')) || [];
    const rendaMensal = ativos.reduce((total, ativo) => {
      return total + (ativo.quantidade * ativo.rendimento);
    }, 0);

    const rendaMensalElement = document.getElementById('renda-mensal');
    rendaMensalElement.textContent = rendaMensal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }


  // Função para carregar os dados do localStorage e preencher a interface e o modal
  function carregarDados() {
    const dados = JSON.parse(localStorage.getItem('perfilDados')) || {};

    profilePic.src = dados.foto || 'https://via.placeholder.com/80';
    userNome.textContent = dados.nome || 'Seu Nome';
    userEmail.textContent = dados.email || 'seuemail@exemplo.com';
    userPhone.textContent = dados.telefone || '(00) 00000-0000';
    bioTexto.textContent = dados.bio || 'Clique em editar para adicionar sua biografia.';


    if (dados.site) {
      siteLink.style.display = 'inline';
      siteLink.href = dados.site;
      siteLink.textContent = dados.site;
    } else {
      siteLink.style.display = 'none';
    }

    // Preenche inputs do modal
    inputNome.value = dados.nome || '';
    inputEmail.value = dados.email || '';
    inputTelefone.value = dados.telefone || '';
    inputBio.value = dados.bio || '';
    inputSite.value = dados.site || '';

    atualizarTotalFII();
    atualizarRendaMensal();
  }

  // Função para salvar os dados do modal no localStorage e atualizar a interface
  function salvarDados() {
    const dados = {
      nome: inputNome.value.trim() || 'Seu Nome',
      email: inputEmail.value.trim() || '',
      telefone: inputTelefone.value.trim() || '',
      bio: inputBio.value.trim() || '',
      site: inputSite.value.trim() || '',
      foto: profilePic.src // mantém a foto atual (pode adaptar se quiser trocar)
    };

    localStorage.setItem('perfilDados', JSON.stringify(dados));
    carregarDados();
  }

  // Eventos para abrir e fechar modal
  editarBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  fecharBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Salvar dados e fechar modal
  salvarBtn.addEventListener('click', () => {
    salvarDados();
    modal.style.display = 'none';
  });

  // Fechar modal ao clicar fora do conteúdo (opcional)
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Inicializa carregando dados
  carregarDados();
});
