const API_URL = "http://localhost:3000/properties";

// Pega o ID da URL
const params = new URLSearchParams(window.location.search);
const imovelId = params.get("id");

// Se não tem ID, volta para a listagem
if (!imovelId) {
  window.location.href = "exibicao-imoveis.html";
}

//Select de cidades

async function popularCidades(cidadeSalva) {
  const select = document.getElementById("cidade");
  if (!select) return;

  try {
    const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios");
    const municipios = await res.json();
    municipios.sort((a, b) => a.nome.localeCompare(b.nome));

    municipios.forEach(m => {
      const option = document.createElement("option");
      option.value = m.nome.toLowerCase().replace(/\s+/g, "");
      option.textContent = m.nome;
      select.appendChild(option);
    });

    // Seleciona a cidade já salva no imóvel
    if (cidadeSalva) select.value = cidadeSalva;

  } catch {
    select.innerHTML = '<option value="belohorizonte">Belo Horizonte</option>';
  }
}

//Carregar os dados do imóvel e preenche o formulário

async function carregarImovel() {
  try {
    const res = await fetch(`${API_URL}/${imovelId}`);
    if (!res.ok) throw new Error();
    const imovel = await res.json();

    // Preenche os campos com os dados atuais
    document.getElementById("nome").value          = imovel.nome      ?? "";
    document.getElementById("local").value         = imovel.local     ?? "";
    document.getElementById("preco").value         = imovel.preco     ?? "";
    document.getElementById("quartos").value       = imovel.quartos   ?? "";
    document.getElementById("banheiros").value     = imovel.banheiros ?? "";
    document.getElementById("tipo").value          = imovel.tipo      ?? "";
    document.getElementById("tamanho-imovel").value = imovel.tamanho  ?? "";
    document.getElementById("descricao").value     = imovel.descricao ?? "";
    document.getElementById("agent_id").value = imovel.agentId ?? "";

    // Popula cidades e seleciona a cidade salva
    await popularCidades(imovel.cidade ?? "");

    // Guarda as fotos antigas para manter caso não envie novas
    window._fotosAntigas = imovel.fotos ?? [];
    window._dataCadastro = imovel.dataCadastro ?? "";

  } catch {
    alert("Não foi possível carregar o imóvel.");
    window.location.href = "exibicao-imoveis.html";
  }
}

//Geolocalização

function getLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada pelo seu navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        document.getElementById("local").value = data.display_name || `${latitude}, ${longitude}`;
      } catch {
        document.getElementById("local").value = `${latitude}, ${longitude}`;
      }
    },
    () => alert("Não foi possível obter sua localização.")
  );
}

//Salva as alterações

async function salvarAlteracoes(event) {
  event.preventDefault();

  // Processa novas fotos se enviadas, senão mantém as antigas
  const arquivos = document.getElementById("foto").files;
  let fotos = window._fotosAntigas ?? [];

  if (arquivos.length > 0) {
    fotos = await Promise.all(
      Array.from(arquivos).map(arquivo => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(arquivo);
        });
      })
    );
  }

  const imovelAtualizado = {
    nome:        document.getElementById("nome").value.trim(),
    local:       document.getElementById("local").value.trim(),
    cidade:      document.getElementById("cidade")?.value ?? "",
    tipo:        document.getElementById("tipo").value,
    preco:       parseFloat(document.getElementById("preco").value),
    quartos:     parseInt(document.getElementById("quartos").value),
    banheiros:   parseInt(document.getElementById("banheiros").value),
    tamanho:     document.getElementById("tamanho-imovel").value.trim(),
    descricao:   document.getElementById("descricao").value.trim(),
    fotos:       fotos,
    dataCadastro: window._dataCadastro,
    agentId: String(document.getElementById("agent_id").value),
  };

  try {
    const res = await fetch(`${API_URL}/${imovelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imovelAtualizado),
    });

    if (!res.ok) throw new Error();

    alert("Alterações salvas com sucesso!");
    window.location.href = `detalhes-imovel.html?id=${imovelId}`;

  } catch {
    alert("Não foi possível salvar as alterações. Verifique se o JSON Server está rodando.");
  }
}

//Init

document.addEventListener("DOMContentLoaded", () => {
  carregarImovel();

  document.getElementById("form-editar").addEventListener("submit", salvarAlteracoes);

  document.querySelector(".botao-cancelar").addEventListener("click", () => {
    window.location.href = `detalhes-imovel.html?id=${imovelId}`;
  });
});