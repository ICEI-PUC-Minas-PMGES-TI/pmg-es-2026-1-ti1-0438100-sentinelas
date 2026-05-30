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

function obterEtiquetaSeguranca(imovel) {
    const valorOriginal = (imovel.seguranca ?? imovel.security ?? imovel.status ?? '').toString().toLowerCase();

    if (valorOriginal.includes('segur') || valorOriginal === 'safe' || valorOriginal === 'low') {
        return { classe: 'etiqueta-seguro', texto: 'Seguro' };
    }
    if (valorOriginal.includes('moder') || valorOriginal === 'moderate' || valorOriginal === 'medium') {
        return { classe: 'etiqueta-moderado', texto: 'Moderado' };
    }
    if (valorOriginal.includes('aten') || valorOriginal === 'danger' || valorOriginal === 'high' || valorOriginal === 'urgent') {
        return { classe: 'etiqueta-atencao', texto: 'Atenção' };
    }

    return { classe: 'etiqueta-moderado', texto: 'Moderado' };
}
