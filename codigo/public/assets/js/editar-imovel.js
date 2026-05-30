const parametroPesquisa = new URLSearchParams(window.location.search);
const idItem = parametroPesquisa.get("id");

const item = itens.find(item => item.id == idItem);
const detalhe = document.getElementById("detalhe");

if (idItem && item && detalhe) {
  detalhe.innerHTML = `
    <div class="card-detalhes p-4">
        <h1 class="mb-3 nome-detalhe">${item.nome}</h1>
        <img src="${item.imagem}" class="img-fluid mb-3 imagem-detalhe" alt="${item.nome}">
        <p><strong>Avaliação:</strong> ${gerarEstrelas(item.nota)}</p>
        <p><strong>Autor:</strong>${item.autor}</p>
        <p>${item.comentario}</p>
        <h3 class="mt-4">Fotos relacionadas</h3>
                <div class="row" id="fotos-relacionadas"></div>
                <a href="index.html" class="btn btn-success mt-3 btn-voltar">Voltar</a>
            </div>
          `;
          
  buscarImagens(item.nome).then(imagens => {
    mostrarImagens(imagens);
  });
          
}
