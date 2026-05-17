/* ============================================================
    1. FILTRAR RESULTADOS
   ============================================================ */
const overlay = document.getElementById('overlay');
const btnFiltrar = document.querySelector('.filtrar-resultado');
const btnFechar = document.getElementById('fechar-filtro');
const btnCancelar = document.getElementById('botao-cancelar');
const btnAplicar = document.getElementById('botao-aplicar');

btnFiltrar.addEventListener('click', function() {
    overlay.classList.add('aberto');
});

btnFechar.addEventListener('click', function() {
    overlay.classList.remove('aberto');
});

btnCancelar.addEventListener('click', function() {
    overlay.classList.remove('aberto');
});

overlay.addEventListener('click', function(clicar){
    if(clicar.target===overlay){
        overlay.classList.remove('aberto')
    }
});


btnAplicar.addEventListener('click', function() {
    const gravidade = document.getElementById('gravidade').value;
    const periodo = document.getElementById('periodo').value;
    const testemunhas = document.getElementById('testemunhas').value;
    const regiao = document.querySelector('.inserir-localidade').value;

    overlay.classList.remove('aberto');
});


/* ============================================================
    1. Escolher Cidade
   ============================================================ */

const escolherCidade = document.getElementById('escolherCidade')

// Busca municípios de MG
fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios')
    .then(resultado => resultado.json())
    .then(municipios => {
    municipios.sort((a, b) => a.nome.localeCompare(b.nome))

    escolherCidade.innerHTML = ''
    municipios.forEach(municipio => {
        const option = document.createElement('option')
        option.value = municipio.nome.toLowerCase().replace(/\s+/g, '')
        option.textContent = municipio.nome
        escolherCidade.appendChild(option)
    })
    escolherCidade.value = 'belohorizonte'
    })

escolherCidade.addEventListener('change', function() {
    const cidadeSelecionada = this.value
})