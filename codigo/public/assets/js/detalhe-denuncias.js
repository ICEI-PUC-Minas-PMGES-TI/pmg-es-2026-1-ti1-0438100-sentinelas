// ELEMENTOS
const feedComentarios = document.getElementById('feed-comentarios');
const inputComentario = document.getElementById('input-comentario');
const btnEnviar = document.getElementById('btn-enviar');
const charCount = document.getElementById('char-count');

const btnResolver = document.getElementById('btn-resolver');
const statusTexto = document.getElementById('status-texto');

// CONTADOR DE CARACTERES
inputComentario.addEventListener('input', () => {
    charCount.textContent = inputComentario.value.length;

    if (inputComentario.value.trim() !== '') {
        inputComentario.style.borderColor = '';
    }
});

// CRIAR COMENTÁRIO
function criarElementoComentario(texto) {
    const div = document.createElement('div');
    div.classList.add('comentario');

    div.innerHTML = `
        <div class="comentario-topo">
            <span class="autor-anonimo">Anônimo</span>
            <span class="comentario-hora">agora mesmo</span>
        </div>
        <p class="comentario-texto">${texto}</p>
    `;

    return div;
}

// ENVIAR COMENTÁRIO
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

// BOTÃO RESOLVER
btnResolver.addEventListener('click', () => {
    statusTexto.textContent = 'Status: Resolvida ✅';
    statusTexto.classList.remove('status-pendente');
    statusTexto.classList.add('status-resolvido');

    btnResolver.textContent = 'Resolvida';
    btnResolver.style.backgroundColor = 'green';
    btnResolver.disabled = true;
});