//URL da API onde vai fazer o registro do imóvel
const API_URL = "http://localhost:3000/properties";

//Select de cidades
async function popularCidades() {
  const select = document.getElementById('cidade');

  try {
      const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios');
      const municipios = await res.json();

      // Ordena os municípios em ordem alfabética
      municipios.sort((a, b) => a.nome.localeCompare(b.nome));

      municipios.forEach(m => {
          const option = document.createElement('option');
          // Value em lowercase sem espaços para facilitar filtragem
          option.value = m.nome.toLowerCase().replace(/\s+/g, '');
          option.textContent = m.nome;
          select.appendChild(option);
      });

      // Belo Horizonte como cidade padrão
      select.value = 'belohorizonte';

  } catch {
      // Fallback caso a API esteja indisponível
      select.innerHTML = '<option value="belohorizonte">Belo Horizonte</option>';
  }
}

//Pega a localização do usuário
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

//Envia o formulário (obtém os)
async function submitImovel(event) {
  event.preventDefault();

  //Obtém as fotos e transforma em string base64
  const arquivos = document.getElementById("foto").files;
  const fotos = await Promise.all(
    Array.from(arquivos).map((arquivo) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(arquivo);
      });
    })
  );

  //Cria o objeto com base nos dados do imóvel
  const imovel = {
    nome: document.getElementById("nome").value.trim(),
    local: document.getElementById("local").value.trim(),
    cidade: document.getElementById("cidade").value.toLowerCase(),
    tipo: document.getElementById("tipo").value,
    preco: parseFloat(document.getElementById("preco").value),
    quartos: parseInt(document.getElementById("quartos").value),
    banheiros: parseInt(document.getElementById("banheiros").value),
    tamanho: document.getElementById("tamanho-imovel").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    fotos: fotos,
    dataCadastro: new Date().toLocaleDateString("pt-BR"),
    agentId: String(document.getElementById("agent_id").value),
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imovel),
    });

    if (!res.ok) throw new Error();

    alert("Cadastro realizado com sucesso!");
    document.location = "exibicao-imoveis.html";
  } catch (err) {
    alert("Não foi possível cadastrar o imóvel. Verifique se o JSON Server está rodando.");
    console.error(err);
  }
}


//Inicialização
document.addEventListener("DOMContentLoaded", () => {
  //Carrega as cidades de MG
  popularCidades();
  //Quando o formulário for enviado, a função de submitImovel será executada
  document.getElementById("form-cadastro").addEventListener("submit", submitImovel);

  //Quando clica, redireciona paraa página de exibição de imóveis
  document.querySelector(".botao-cancelar").addEventListener("click", () => {
    window.location.href = "exibicao-imoveis.html";
  });
})