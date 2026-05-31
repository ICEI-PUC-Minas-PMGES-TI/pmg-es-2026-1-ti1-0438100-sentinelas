const API_URL = "http://localhost:3000/properties";

document.getElementById("form-cadastro").addEventListener("submit", submitImovel);

document.querySelector(".botao-cancelar").addEventListener("click", () => {
  window.location.href = "exibicao-imoveis.html";
});

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

async function submitImovel(event) {
  event.preventDefault();

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

  const imovel = {
    nome: document.getElementById("nome").value.trim(),
    local: document.getElementById("local").value.trim(),
    tipo: document.getElementById("tipo").value,
    preco: parseFloat(document.getElementById("preco").value),
    quartos: parseInt(document.getElementById("quartos").value),
    banheiros: parseInt(document.getElementById("banheiros").value),
    tamanho: document.getElementById("tamanho-imovel").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    fotos: fotos,
    dataCadastro: new Date().toLocaleDateString("pt-BR"),
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