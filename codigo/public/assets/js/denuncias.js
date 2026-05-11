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