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