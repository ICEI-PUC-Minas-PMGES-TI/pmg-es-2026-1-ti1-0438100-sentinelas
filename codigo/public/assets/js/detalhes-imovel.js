const API_URL = "http://localhost:3000/properties";

const params = new URLSearchParams(window.location.search);
const imovelId = params.get("id");

if (!imovelId) {
  window.location.href = "exibicao-imoveis.html";
}


/*Cria labels com base na informação do JSON */
const TIPO_LABEL = {
  venda:   "Venda",
  aluguel: "Aluguel",
  vendido: "Vendido",
  alugado: "Alugado",
};

const TIPO_COR = {
  venda:   { bg: "#dbeafe", color: "#1e40af" },
  aluguel: { bg: "#d1fae5", color: "#065f46" },
  vendido: { bg: "#e5e7eb", color: "#374151" },
  alugado: { bg: "#fef3c7", color: "#92400e" },
};


async function carregarDetalhe() {
  try {
    const res = await fetch(`${API_URL}/${imovelId}`);
    if (!res.ok) throw new Error();
    const imovel = await res.json();
    renderizarDetalhe(imovel);
  } catch {
    document.getElementById("detalhe").innerHTML =
      `<p class="erro">Não foi possível carregar o imóvel. Verifique se o JSON Server está rodando.</p>`;
  }
}

/*Renderiza as fotos e as labels */
function renderizarDetalhe(imovel) {
  const cor = TIPO_COR[imovel.tipo] || TIPO_COR.venda;
  const label = TIPO_LABEL[imovel.tipo] || imovel.tipo;

  const fotosHtml = imovel.fotos && imovel.fotos.length
    ? `<div class="detalhe-fotos">
        ${imovel.fotos.map(f => `<img src="${f}" alt="Foto do imóvel">`).join("")}
       </div>`
    : `<div class="detalhe-sem-foto">Sem fotos cadastradas</div>`;

/*Cria o card dos detalhes do item com base nas funções que ele pegou em cima */
  document.getElementById("detalhe").innerHTML = `
    <div class="detalhe-card">

      <div class="detalhe-topo">
        <span class="badge-tipo" style="background:${cor.bg}; color:${cor.color};">${label}</span>
        <a href="editar-imovel.html?id=${imovel.id}" class="btn-editar-detalhe" title="Editar imóvel">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>
          Editar
        </a>
      </div>

      ${fotosHtml}

      <div class="detalhe-info">
        <h2 class="detalhe-nome">${imovel.nome || "Imóvel sem nome"}</h2>
        <p class="detalhe-local">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
          ${imovel.local || "Endereço não informado"}
        </p>

        <p class="detalhe-preco">R$ ${(imovel.preco || 0).toLocaleString("pt-BR")}</p>

        <div class="detalhe-atributos">
          <div class="atributo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 2a1 1 0 0 0-1 1v1h12V3a1 1 0 0 0-1-1H3zM1 7v1h14V7H1zm0 2v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9H1z"/>
            </svg>
            <span>${imovel.quartos || 0} quartos</span>
          </div>
          <div class="atributo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6zm1 0v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1z"/>
            </svg>
            <span>${imovel.banheiros || 0} banheiro${imovel.banheiros !== 1 ? "s" : ""}</span>
          </div>
          <div class="atributo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
            <span>${imovel.tamanho || "—"}</span>
          </div>
        </div>

        <div class="detalhe-descricao">
          <h3>Descrição</h3>
          <p>${imovel.descricao || "Sem descrição cadastrada."}</p>
        </div>
        <p class="detalhe-data">Cadastrado em ${imovel.dataCadastro || "—"}</p>
        <button class="botao-voltar" onclick="document.location='exibicao-imoveis.html'">
           Voltar para imóveis
        </button>
      </div>

    </div>
  `;
}

carregarDetalhe();