const overlay = document.getElementById('overlay');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnFechar = document.getElementById('btn-fechar');
const btnCancelar = document.getElementById('btn-cancelar');
const modal = document.getElementById('modal');

btnFiltrar.addEventListener('click', function() {
    overlay.classList.add('aberto');
});

btnFechar.addEventListener('click', function() {
    overlay.classList.remove('aberto');
});

btnCancelar.addEventListener('click', function() {
    overlay.classList.remove('aberto');
});


overlay.addEventListener('click', function(evento) {
    if (evento.target === overlay) {
    overlay.classList.remove('aberto');
    }
});