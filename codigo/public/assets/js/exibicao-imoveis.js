/* ============================================================
    1. SELECIONAR CIDADE (API IBGE)
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
    const tipo = (imovel.tipo ?? '').toString().toLowerCase();

    if (tipo === 'aluguel') return { classe: 'etiqueta-seguro', texto: 'Aluguel' };
    if (tipo === 'venda')   return { classe: 'etiqueta-atencao', texto: 'Venda' };
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

    const titulo    = imovel.nome      ?? 'Imóvel sem nome';
    const endereco  = imovel.local     ?? 'Endereço não informado';
    const descricao = imovel.descricao ?? '';
    const preco     = imovel.preco     ?? null;
    const quartos   = imovel.quartos   ?? null;
    const banheiros = imovel.banheiros ?? null;
    const tamanho   = imovel.tamanho   ?? null;

    const foto = Array.isArray(imovel.fotos) && imovel.fotos.length > 0
        ? imovel.fotos[0]
        : null;

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
        ${foto
            ? `<div class="imagem-placeholder" style="background-image:url('${foto}');background-size:cover;background-position:center;"></div>`
            : `<div class="imagem-placeholder"></div>`}
    `;

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        if (imovel.id) {
            window.location.href = `detalhes-imovel.html?id=${imovel.id}`;
        }
    });

    return card;
}

/* ============================================================
    4. CARREGAR IMÓVEIS DO JSON SERVER
   ============================================================ */

let listaImoveisGlobal = [];

async function carregarImoveis(filtroStatus = null) {
    const container = document.getElementById('imoveis-regiao');
    if (!container) return;

    container.innerHTML = '<p class="text-muted text-center" style="grid-column:1/-1;padding:20px;">Carregando imóveis...</p>';

    try {
        let url = 'http://localhost:3000/properties';
        if (filtroStatus) {
            url += `?cidade=${encodeURIComponent(filtroStatus)}`;
        }

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        listaImoveisGlobal = await resposta.json();

        renderizarListaFiltrada();
    } catch (erro) {
        console.error('Erro ao carregar imóveis:', erro);
        container.innerHTML = `
            <p class="text-danger text-center" style="grid-column:1/-1;padding:20px;">
                Não foi possível carregar os imóveis. Verifique se o JSON Server está rodando
                (<code>json-server --watch db.json</code>).
            </p>
        `;
    }
}

/* ============================================================
    5. PESQUISA (Filtragem acionada apenas por eventos específicos)
   ============================================================ */

const barraPesquisa = document.querySelector('.pesquisa-denuncias');
const botaoPesquisar = document.querySelector('.botao-denuncias');

function renderizarListaFiltrada() {
    const container = document.getElementById('imoveis-regiao');
    if (!container) return;

    const termo = barraPesquisa ? barraPesquisa.value.trim().toLowerCase() : '';

    const imoveisFiltrados = listaImoveisGlobal.filter(imovel => {
        const titulo = (imovel.nome ?? '').toLowerCase();
        const descricao = (imovel.descricao ?? '').toLowerCase();
        const endereco = (imovel.local ?? '').toLowerCase();

        return titulo.includes(termo) || descricao.includes(termo) || endereco.includes(termo);
    });

    container.innerHTML = '';

    if (!Array.isArray(imoveisFiltrados) || imoveisFiltrados.length === 0) {
        container.innerHTML = '<p class="text-muted text-center" style="grid-column:1/-1;padding:20px;">Nenhum imóvel corresponde à sua busca.</p>';
        return;
    }

    imoveisFiltrados.forEach(imovel => container.appendChild(renderizarCard(imovel)));
}

if (botaoPesquisar) {
    botaoPesquisar.addEventListener('click', (e) => {
        e.preventDefault();
        renderizarListaFiltrada();
    });
}

if (barraPesquisa) {
    barraPesquisa.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            renderizarListaFiltrada();
        }
    });
}

/* ============================================================
    6. REGIÃO DO USUÁRIO (GPS)
   ============================================================ */

function atualizarRegiaoGPS() {
    const regiaoElement = document.getElementById('regiao-gps');
    if (!regiaoElement) return;

    if (!navigator.geolocation) {
        regiaoElement.textContent = 'na sua região';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                .then(res => res.json())
                .then(data => {
                    const bairro = data.address?.neighbourhood ?? data.address?.suburb ?? '';
                    const cidade = data.address?.city ?? data.address?.town ?? data.address?.village ?? '';
                    regiaoElement.textContent = bairro ? `em ${bairro}, ${cidade}` : `em ${cidade}`;
                })
                .catch(() => { regiaoElement.textContent = 'na sua região'; });
        },
        () => { regiaoElement.textContent = 'na sua região'; }
    );
}

/* ============================================================
    7. INICIALIZAÇÃO
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
    atualizarRegiaoGPS();

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && barraPesquisa) {
        barraPesquisa.value = searchParam;
    }

    await carregarImoveis();
});