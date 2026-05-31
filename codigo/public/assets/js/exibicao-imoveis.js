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

