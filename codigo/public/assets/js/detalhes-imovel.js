const API_URL = "http://localhost:3000/properties";

const params = new URLSearchParams(window.location.search);
const imovelId = params.get("id");

if (!imovelId) {
  window.location.href = "exibicao-imoveis.html";
}

const TIPO_LABEL = {
  venda: "Venda",
  aluguel: "Aluguel",
  vendido: "Vendido",
  alugado: "Alugado",
};

const TIPO_COR = {
  venda: { bg: "#dbeafe", color: "#1e40af" },
  aluguel: { bg: "#d1fae5", color: "#065f46" },
  vendido: { bg: "#e5e7eb", color: "#374151" },
  alugado: { bg: "#fef3c7", color: "#92400e" },
};

async function carregarDetalhe() {
  const res = await fetch(`${API_URL}/${imovelId}`);
  if (!res.ok) throw new Error();
  const imovel = await res.json();
  let agent = null;
  if (imovel.agentId) {
    const resAgent = await fetch(`http://localhost:3000/agents/${imovel.agentId}`);
    if (resAgent.ok) {
      agent = await resAgent.json();
    }
  }
  imovel.agent = agent;
  renderizarDetalhe(imovel);
}

function renderizarDetalhe(imovel) {
  const cor = TIPO_COR[imovel.tipo] || TIPO_COR.venda;
  const label = TIPO_LABEL[imovel.tipo] || imovel.tipo;

  const fotosHtml = imovel.fotos && imovel.fotos.length
    ? `<div class="detalhe-fotos">
        ${imovel.fotos.map(f => `<img src="${f}" alt="Foto do imóvel">`).join("")}
       </div>`
    : `<div class="detalhe-sem-foto">Sem fotos cadastradas</div>`;

  document.getElementById("detalhe").innerHTML = `
    <div class="detalhe-card">
      <div class="detalhe-topo">
        <span class="badge-tipo" style="background:${cor.bg}; color:${cor.color};">${label}</span>
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="../notificacoes/notificacoes.html" class="notificacoes">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#236377" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
            </svg>
          </a>
        <a href="editar-imovel.html?id=${imovel.id}" class="btn-editar-detalhe" title="Editar imóvel">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>Editar</a>
        </div>
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
        <p class="detalhe-corretor"><strong>Corretor:</strong>${imovel.agent?.name || " Não Informado"}</p>

        <div class="detalhe-atributos">
          <div class="atributo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box" viewBox="0 0 16 16">
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
            </svg>
            <span>${imovel.quartos || 0} quartos</span>
          </div>
          <div class="atributo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet-fill" viewBox="0 0 16 16">
              <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13"/>
            </svg>
            <span>${imovel.banheiros || 0} banheiro${imovel.banheiros !== 1 ? "s" : ""}</span>
          </div>
          <div class="atributo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5$.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
            <span>${imovel.tamanho || "—"}</span>
          </div>
        </div>

        <div class="detalhe-descricao">
          <h3>Descrição</h3>
          <p>${imovel.descricao || "Sem descrição cadastrada."}</p>
        </div>
        <p class="detalhe-data">Cadastrado em ${imovel.dataCadastro || "—"}</p>
        <div id="mapa-calor" style="width: 100%; height: 400px;"></div>
        <button class="botao-voltar" onclick="document.location='exibicao-imoveis.html'">
           Voltar para imóveis
        </button>
      </div>
    </div>
  `;

  carregarMapaDeCalor(imovel);
}

async function buscarCoordenadas(local, city) {
  const enderecoCompleto = `${local}, ${city}, MG, Brasil`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`;
  const resposta = await fetch(url, { headers: { 'User-Agent': 'VigilareApp/1.0' } });

  if (resposta.ok) {
    const resultado = await resposta.json();
    if (resultado && resultado.length > 0) {
      return {
        lat: parseFloat(resultado[0].lat),
        lng: parseFloat(resultado[0].lon)
      };
    }
  }
  return null;
}

async function carregarMapaDeCalor(imovelAtual) {
  const mapaContainer = document.getElementById('mapa-calor');
  if (!mapaContainer || typeof ol === 'undefined') return;

  const resposta = await fetch('http://localhost:3000/properties');
  if (!resposta.ok) return;
  const propriedades = await resposta.json();

  const features = [];
  let coordenadasImovelAtual = null;

  if (Array.isArray(propriedades)) {
    for (const prop of propriedades) {
      if (prop.local && prop.cidade) {
        const coords = await buscarCoordenadas(prop.local, prop.cidade);
        if (coords) {
          const pontoProj = ol.proj.fromLonLat([coords.lng, coords.lat]);

          const pontoCalor = new ol.Feature({
            geometry: new ol.geom.Point(pontoProj),
            weight: 1
          });
          features.push(pontoCalor);

          if (prop.id === imovelAtual.id) {
            coordenadasImovelAtual = pontoProj;
          }
        }
      }
    }
  }

  const fonteVetor = new ol.source.Vector({
    features: features
  });

  const camadaCalor = new ol.layer.Heatmap({
    source: fonteVetor,
    blur: 22,
    radius: 20,
    gradient: ['#2a9d8f', '#a8dadc', '#f4a261', '#e76f51', '#c1121f']
  });

  const camadaBaseOSM = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  const mapa = new ol.Map({
    target: 'mapa-calor',
    layers: [camadaBaseOSM, camadaCalor],
    view: new ol.View({
      center: coordenadasImovelAtual || ol.proj.fromLonLat([-43.926384, -19.919393]),
      zoom: coordenadasImovelAtual ? 15 : 12
    }),
    interactions: ol.interaction.defaults.defaults({
      mouseWheelZoom: false
    })
  });

  if (coordenadasImovelAtual) {
    const marcadorImovel = new ol.Feature({
      geometry: new ol.geom.Point(coordenadasImovelAtual)
    });

    marcadorImovel.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({ color: '#c1121f' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
      })
    }));

    const fonteMarcador = new ol.source.Vector({
      features: [marcadorImovel]
    });

    const camadaMarcador = new ol.layer.Vector({
      source: fonteMarcador
    });

    mapa.addLayer(camadaMarcador);
  }
}

document.addEventListener("DOMContentLoaded", carregarDetalhe);