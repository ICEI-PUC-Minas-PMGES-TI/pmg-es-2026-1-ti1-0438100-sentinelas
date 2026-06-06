const feedComentarios = document.getElementById('feed-comentarios');
const inputComentario = document.getElementById('input-comentario');
const btnEnviar = document.getElementById('btn-enviar');
const charCount = document.getElementById('char-count');

inputComentario.addEventListener('input', () => {
    charCount.textContent = inputComentario.value.length;
});

function criarElementoComentario(texto) {
    const div = document.createElement('div');
    div.classList.add('comentario');
    div.innerHTML = `
        <div class="comentario-topo d-flex justify-content-between align-items-center">
            <span class="autor-anonimo">Anônimo</span>
            <span class="comentario-hora">agora mesmo</span>
        </div>
        <p class="comentario-texto">${texto}</p>
    `;
    return div;
}

btnEnviar.addEventListener('click', () => {
    const texto = inputComentario.value.trim();
    if (texto === '') {
        inputComentario.style.borderColor = '#c0392b';
        inputComentario.focus();
        return;
    }
    inputComentario.style.borderColor = '';
    feedComentarios.appendChild(criarElementoComentario(texto));
    inputComentario.value = '';
    charCount.textContent = '0';
});

inputComentario.addEventListener('input', () => {
    if (inputComentario.value.trim() !== '') {
        inputComentario.style.borderColor = '';
    }
});
