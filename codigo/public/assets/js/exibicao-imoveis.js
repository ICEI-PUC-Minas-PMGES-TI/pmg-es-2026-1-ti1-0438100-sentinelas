/* ============================================================
    1. SELECIONAR CIDADE (API IBGE — igual ao denuncias.js)
   ============================================================ */

const escolherCidade = document.getElementById('escolherCidade');

fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios')
    .then(res => res.json())
    .then(municipios => {
        municipios.sort((a, b) => a.nome.localeCompare(b.nome));
        escolherCidade.innerHTML = '';
        municipios.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.nome.toLowerCase().replace(/\s+/g, '');
            option.textContent = municipio.nome;
            escolherCidade.appendChild(option);
        });
        escolherCidade.value = 'belohorizonte';
    })
    .catch(() => {
        escolherCidade.innerHTML = '<option value="belohorizonte">Belo Horizonte</option>';
    });

escolherCidade.addEventListener('change', function () {
    const cidadeSelecionada = this.value;
    carregarImoveis(cidadeSelecionada);
});

/* ============================================================
    2. HELPERS
   ============================================================ */

function obterEtiquetaStatus(imovel) {
    const statusOriginal = (imovel.property_status ?? imovel.tipo ?? imovel.status ?? '').toString().toLowerCase();

    if (statusOriginal === 'available' || statusOriginal === 'venda' || statusOriginal === 'aluguel') {
        return { classe: 'etiqueta-seguro', texto: statusOriginal === 'aluguel' ? 'Aluguel' : 'Disponível' };
    }
    if (statusOriginal === 'sold' || statusOriginal === 'vendido') {
        return { classe: 'etiqueta-atencao', texto: 'Vendido' };
    }
    if (statusOriginal === 'rented' || statusOriginal === 'alugado') {
        return { classe: 'etiqueta-moderado', texto: 'Alugado' };
    }

    return { classe: 'etiqueta-moderado', texto: 'Disponível' };
}

function formatarPreco(preco) {
    if (!preco && preco !== 0) return '';
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ============================================================
    3. RENDERIZAR CARDS
   ============================================================ */

function renderizarCard(imovel) {
    const { classe, texto } = obterEtiquetaStatus(imovel);

    const titulo    = imovel.street      ?? imovel.local      ?? imovel.endereco ?? 'Endereço não informado';
    const descricao = imovel.property_description ?? imovel.descricao ?? imovel.description ?? '';
    const preco     = imovel.price       ?? imovel.preco       ?? null;
    const quartos   = imovel.quartos     ?? imovel.bedrooms    ?? null;
    const banheiros = imovel.banheiros   ?? imovel.bathrooms   ?? null;
    const tamanho   = imovel.tamanho     ?? imovel.area        ?? null;

    const infoComodos = [
        quartos   !== null ? `${quartos} quarto${quartos !== 1 ? 's' : ''}` : null,
        banheiros !== null ? `${banheiros} banheiro${banheiros !== 1 ? 's' : ''}` : null,
        tamanho   !== null ? tamanho : null,
    ].filter(Boolean).join(' • ');

    const card = document.createElement('div');
    card.className = 'card-imovel d-flex';
    card.dataset.id = imovel.id ?? '';

    card.innerHTML = `
        <div class="conteudo-card">
            <div class="cabecalho-card d-flex align-items-center">
                <span class="${classe}">${texto}</span>
                ${infoComodos ? `<span class="info-imovel">${infoComodos}</span>` : ''}
            </div>
            <h2 class="titulo-imovel">${titulo}</h2>
            ${preco !== null ? `<p class="localizacao" style="font-weight:600;">${formatarPreco(preco)}</p>` : ''}
            <p class="descricao">${descricao}</p>
        </div>
        <div class="imagem-placeholder"></div>
    `;

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        if (imovel.id) {
            window.location.href = `editar-imovel.html?id=${imovel.id}`;
        }
    });

    return card;
}


