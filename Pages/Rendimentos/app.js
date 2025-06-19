document.addEventListener("DOMContentLoaded", () => {
  const ativosKey = "ativosFII";

  const modalAdd = document.getElementById("modal-novo-ativo");
  const modalEdit = document.getElementById("modal-editar-ativo");
  const openModalBtn = document.getElementById("add-ativo-btn");
  const closeModalBtns = document.querySelectorAll(".close-modal");

  const ativosLista = document.getElementById("ativos-lista");
  const totalRendimentosEl = document.getElementById("total-rendimentos");
  const mediaDyEl = document.getElementById("media-dy");

  const saveAddBtn = document.getElementById("salvar-ativo-btn");
  const saveEditBtn = document.getElementById("salvar-edicao-btn");

  let editIndex = null;

  // Helpers
  const formatCurrency = value =>
    `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const loadAtivos = () => JSON.parse(localStorage.getItem(ativosKey)) || [];
  const saveAtivos = ativos => localStorage.setItem(ativosKey, JSON.stringify(ativos));

  const render = () => {
    const ativos = loadAtivos();
    ativosLista.innerHTML = "";
    let totalRendimentos = 0;
    let totalDy = 0;
    let valorInvestidoTotal = 0;
    let totalAcoes = 0;

    ativos.forEach((ativo, index) => {
      const rendimentoMensal = (ativo.quantidade * ativo.rendimento);
      totalRendimentos += rendimentoMensal;
      totalDy += parseFloat(ativo.dy);
      valorInvestidoTotal += ativo.quantidade * ativo.precoMedio;
      totalAcoes += ativo.quantidade;

      // Criar os cards normalmente
      const card = document.createElement("div");
      card.className = "ativo-card";


      const info = document.createElement("div");
      info.className = "ativo-info";
      info.id = `fii_${ativo.nome}`
      info.innerHTML = `
    <div>
    <div class="card-header">
          <div class="column">
          <div class="fii-img">
            <img src="../../assets/fii.png"/>
          </div>
          <p><strong>${ativo.nome}</strong></p></div>

      <div style="display: flex; gap: 5px; flex-wrap: wrap;">
        <p class="quantidade" style="background: #d0d0d0;">DY: ${ativo.dy}%</p>
        <p class="quantidade" style="background: #dedede;">${ativo.quantidade} cotas</p>
        <p class="quantidade">PM: ${formatCurrency(ativo.precoMedio)}</p>
        <p class="quantidade" style="background: #121212; color: #fafafa">Rendimento/mês: ${formatCurrency(rendimentoMensal.toFixed(2))}</p>
        <p class="quantidade" style="background: #404040; color: #ffffff">Rend: ${formatCurrency(ativo.rendimento)}/cota</p>
      </div>
            <div>
      <img class="menuClicavelManual" src="../../assets/more.png" style="width: 30px; padding-top: 10px;"/>
      </div>

    </div>
    </div>
    `;

      function editarAtivo() {
        editIndex = index;
        document.getElementById("editar-codigo").value = ativo.nome;
        document.getElementById("editar-quantidade").value = ativo.quantidade;
        document.getElementById("editar-preco").value = ativo.precoMedio;
        document.getElementById("editar-rendimento").value = ativo.rendimento;
        document.getElementById("editar-dy").value = ativo.dy;
        modalEdit.style.display = "flex";
      };

      function deletarAtivo() {
        if (confirm(`Confirma exclusão do ativo ${ativo.nome}?`)) {
          const ativos = loadAtivos();
          ativos.splice(index, 1);
          saveAtivos(ativos);
          render();
        }
      };


      const btnCollection = document.createElement("div");
      btnCollection.className = "btnCollection"

      const menuContextByCodeFII = document.createElement("div");
      menuContextByCodeFII.className = "menu-context";
      menuContextByCodeFII.id = `customContextMenu_${ativo.nome}`;

      card.appendChild(menuContextByCodeFII)


      card.appendChild(info);
      card.appendChild(btnCollection)

      ativosLista.appendChild(card);

      const menuContext = document.createElement("div")
      const ul = document.createElement("ul");

      const liVer = document.createElement("li");
      liVer.textContent = "⚙️ Editar";
      liVer.onclick = () => editarAtivo();

      const liExcluir = document.createElement("li");
      liExcluir.textContent = "❌ Excluir";
      liExcluir.onclick = () => deletarAtivo();

      ul.appendChild(liVer);
      ul.appendChild(liExcluir);

      menuContextByCodeFII.appendChild(ul);

      card.appendChild(menuContext)


      const menu = document.getElementById(`customContextMenu_${ativo.nome}`);

      if (!menu) {
        console.error("❌ customContextMenu NÃO encontrado no DOM!");
        return;
      }


      card.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const { clientX: mouseX, clientY: mouseY } = e;
        menu.style.top = `${mouseY}px`;
        menu.style.left = `${mouseX}px`;
        menuContextByCodeFII.style.display = "flex";
      });

      card.addEventListener("mouseleave", (e) =>{
                menuContextByCodeFII.style.display = "none";
      })

      document.querySelectorAll('.menuClicavelManual').forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          console.log('as')
          const { clientX: mouseX, clientY: mouseY } = e;
          menu.style.top = `${mouseY}px`;
          menu.style.right = `${mouseX}px`;
          menuContextByCodeFII.style.display = "flex";
        });
      })

      // Oculta o menu ao clicar em qualquer lugar
      // document.addEventListener("click", () => {
        // menu.style.display = "none";
        // menuContextByCodeFII.style.display = "none";
      // });

      document.addEventListener("auxclick", () => {
        // menu.style.display = "none";
        menuContextByCodeFII.style.display = "none";
      });

    });

    // Atualiza todos os indicadores
    totalRendimentosEl.textContent = formatCurrency(totalRendimentos);
    mediaDyEl.textContent = (ativos.length ? (totalDy / ativos.length).toFixed(2) : "0.00") + "%";

    document.getElementById("valor-investido").textContent = formatCurrency(valorInvestidoTotal);
    document.getElementById("total-ativos").textContent = ativos.length;
    document.getElementById("total-acoes").textContent = totalAcoes;




  };


  // Modal control
  openModalBtn.onclick = () => {
    modalAdd.style.display = "flex";
  };

  closeModalBtns.forEach(btn => {
    btn.onclick = () => {
      modalAdd.style.display = "none";
      modalEdit.style.display = "none";
    };
  });

  // Save novo ativo
  saveAddBtn.onclick = () => {
    const novo = {
      nome: document.getElementById("codigo-ativo").value.trim(),
      quantidade: parseInt(document.getElementById("quantidade").value),
      precoMedio: parseFloat(document.getElementById("preco-medio").value),
      rendimento: parseFloat(document.getElementById("ultimo-rendimento").value),
      dy: parseFloat(document.getElementById("dividend-yield").value)
    };

    if (!novo.nome || isNaN(novo.quantidade) || isNaN(novo.precoMedio) || isNaN(novo.rendimento) || isNaN(novo.dy)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const ativos = loadAtivos();
    ativos.push(novo);
    saveAtivos(ativos);
    modalAdd.style.display = "none";
    clearAddModalFields();
    render();
  };

  // Save edição
  saveEditBtn.onclick = () => {
    const ativos = loadAtivos();

    const editAtivo = {
      nome: document.getElementById("editar-codigo").value,
      quantidade: parseInt(document.getElementById("editar-quantidade").value),
      precoMedio: parseFloat(document.getElementById("editar-preco").value),
      rendimento: parseFloat(document.getElementById("editar-rendimento").value),
      dy: parseFloat(document.getElementById("editar-dy").value)
    };

    if (isNaN(editAtivo.quantidade) || isNaN(editAtivo.precoMedio) || isNaN(editAtivo.rendimento) || isNaN(editAtivo.dy)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    ativos[editIndex] = editAtivo;
    saveAtivos(ativos);
    modalEdit.style.display = "none";
    render();
  };

  function clearAddModalFields() {
    document.getElementById("codigo-ativo").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("preco-medio").value = "";
    document.getElementById("ultimo-rendimento").value = "";
    document.getElementById("dividend-yield").value = "";
  }

  // Fecha modal clicando fora do conteúdo
  window.onclick = (event) => {
    if (event.target === modalAdd) {
      modalAdd.style.display = "none";
      clearAddModalFields();
    }
    if (event.target === modalEdit) {
      modalEdit.style.display = "none";
    }
  };



  render();
});


