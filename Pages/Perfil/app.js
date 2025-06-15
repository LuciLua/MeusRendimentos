import '../../Components/export.js';
import '../../Components/import.js';

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

  // importar export btn and modal
  const importarExportarBtn = document.getElementById('importar-exportar');
  const modalImportarExportar = document.getElementById('modal-importar-exportar');

  // editar perfil btn e modal
  const editarBtn = document.getElementById('editar-perfil');
  const modalEditarPerfil = document.getElementById('modal-editar-perfil');
  const salvarBtn = document.getElementById('salvar-perfil');

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
    const dy = ativos.map(a => a.dy);
    const rendimento = ativos.map(a => a.rendimento);

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
          },
          {
            label: 'Dividend Yield',
            data: dy,  // seus valores,
            backgroundColor: 'rgba(0,0,0,0.3)',  // cinza um pouco mais escuro
            borderWidth: 0,
          },
          {
            label: 'Rendimento por cota',
            data: rendimento,  // seus valores,
            backgroundColor: 'rgba(0,0,0,0.2)',  // cinza um pouco mais escuro
            borderWidth: 0,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                if (label === 'Dividend Yield') {
                  return `${label}: ${value}%`;
                }
                return `${label}: ${value}`;
              }
            }
          },
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

  // Se tiver ativos, cria o gráfico
  if (ativos.length > 0) {
    criarGraficoBarras(ativos);
  } else {
    console.warn('Nenhum ativo para exibir gráficos.');
  }



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

    profilePic.src = dados.foto || 'https://randomuser.me/api/portraits/lego/1.jpg';
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
    modalEditarPerfil.style.display = 'flex';
  });

  // fechar modal perfil e abrir modal importar/exportar
  importarExportarBtn.addEventListener('click', () => {
    modalEditarPerfil.style.display = 'none';
    modalImportarExportar.style.display = 'flex';
  })


  // Salvar dados e fechar modal
  salvarBtn.addEventListener('click', () => {
    salvarDados();
    modalEditarPerfil.style.display = 'none';
  });



  // Inicializa carregando dados
  carregarDados();
});




// Elementos do DOM
const editarFotoBtn = document.getElementById("editar-foto");
const modalEditarFoto = document.getElementById("modal-editar-foto");
const salvarFotoBtn = document.getElementById("salvar-foto");
const urlFotoInput = document.getElementById("url-foto");
const profilePic = document.getElementById("profile-pic");
const closeModalButtons = document.querySelectorAll(".close-modal");

// Fallback aleatório
const fallbackImg = "https://randomuser.me/api/portraits/lego/1.jpg";

// Abrir modal ao clicar no ícone 📷
editarFotoBtn.addEventListener("click", () => {
  // Preenche o input com a URL atual da imagem
  urlFotoInput.value = profilePic.src || '';
  modalEditarFoto.style.display = "flex";
});


// Fechar modais
closeModalButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
  });
});

// Salvar nova URL de imagem
salvarFotoBtn.addEventListener("click", () => {
  const url = urlFotoInput.value.trim();
  const img = new Image();

  img.onload = () => {
    profilePic.src = url;
    modalEditarFoto.style.display = "none";

    // Atualizar localStorage com nova URL de foto
    const dados = JSON.parse(localStorage.getItem('perfilDados')) || {};
    dados.foto = url;
    localStorage.setItem('perfilDados', JSON.stringify(dados));
  };

  img.onerror = () => {
    profilePic.src = fallbackImg;
    modalEditarFoto.style.display = "none";

    // Se imagem falhar, ainda assim salva a fallback
    const dados = JSON.parse(localStorage.getItem('perfilDados')) || {};
    dados.foto = fallbackImg;
    localStorage.setItem('perfilDados', JSON.stringify(dados));
  };

  img.src = url || fallbackImg;
});


// Hover da imagem para exibir botão 📷
const fotoWrapper = document.querySelector('.foto-perfil-wrapper');

fotoWrapper.addEventListener('mouseenter', () => editarFotoBtn.style.display = 'block');
fotoWrapper.addEventListener('mouseleave', () => editarFotoBtn.style.display = 'none');
