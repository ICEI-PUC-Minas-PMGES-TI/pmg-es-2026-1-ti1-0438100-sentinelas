const feedComentarios = document.getElementById('feed-comentarios');
const inputComentario = document.getElementById('input-comentario');
const btnEnviar = document.getElementById('btn-enviar');
const charCount = document.getElementById('char-count');

const btnResolver = document.getElementById('btn-resolver');
const statusTexto = document.getElementById('status-texto');
const witnessCount = document.getElementById('witness-count');
const btnTestemunhar = document.getElementById('btn-testemunhar');
const popupOverlay = document.getElementById('popup-testemunha');
const btnFecharPopup = document.getElementById('btn-fechar-popup');
const btnCancelarDepoimento = document.getElementById('btn-cancelar-depoimento');
const btnEnviarDepoimento = document.getElementById('btn-enviar-depoimento');
const inputDepoimento = document.getElementById('input-depoimento');
const charCountDepoimento = document.getElementById('char-count-depoimento');
const popupError = document.getElementById('popup-error');

const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const denunciaId = getDenunciaId();

function getDenunciaId() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) return params.get('id');
    const idElement = document.querySelector('.id');
    return idElement?.dataset.denunciaId || '1';
}

const TIPOS = {
    theft: 'Furto',
    robbery: 'Roubo',
    assault: 'Agressão',
    vandalism: 'Vandalismo',
    drug_dealing: 'Tráfico',
    suspicious: 'Suspeito',
    other: 'Outro'
};

function formatarTestemunhas(count) {
    return `${count} testemunha${count === 1 ? '' : 's'}`;
}

function formatarHora(isoString) {
    if (!isoString) return 'agora mesmo';
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

async function carregarDenuncia() {
    try {
        const response = await fetch(`http://localhost:3000/denuncias/${denunciaId}`);
        if (!response.ok) throw new Error('Denúncia não encontrada.');

        const d = await response.json();

        document.querySelector('.detalhes h1').textContent =
            TIPOS[d.type] || d.type || 'Detalhes da Denúncia';

        const idEl = document.querySelector('.id');
        idEl.innerHTML = `<strong>ID:</strong> #${d.id}`;

        document.querySelector('.descricao p').textContent =
            d.description || 'Sem descrição.';

        if (d.status === 'closed') {
            statusTexto.textContent = 'Status: Resolvida ✅';
            statusTexto.classList.remove('status-pendente');
            statusTexto.classList.add('status-resolvido');
            btnResolver.textContent = 'Resolvida';
            btnResolver.style.backgroundColor = 'green';
            btnResolver.disabled = true;
        }

        const count = d.witness_count ?? (Array.isArray(d.testemunhas) ? d.testemunhas.length : 0);
        witnessCount.textContent = formatarTestemunhas(count);

        carregarComentarios(d.comentarios || []);

    } catch (erro) {
        console.error('Erro ao carregar denúncia:', erro);
        document.querySelector('.detalhes h1').textContent = 'Denúncia não encontrada';
    }
}

function carregarComentarios(comentarios) {
    feedComentarios.innerHTML = '';

    if (comentarios.length === 0) {
        feedComentarios.innerHTML = '<p class="sem-comentarios">Nenhum comentário ainda. Seja o primeiro!</p>';
        return;
    }

    comentarios.forEach(c => {
        feedComentarios.appendChild(criarElementoComentario(c.texto, formatarHora(c.enviadoEm)));
    });
}

function criarElementoComentario(texto, hora) {
    const div = document.createElement('div');
    div.classList.add('comentario');
    div.innerHTML = `
        <div class="comentario-topo">
            <span class="autor-anonimo">Anônimo</span>
            <span class="comentario-hora">${hora || 'agora mesmo'}</span>
        </div>
        <p class="comentario-texto">${texto}</p>
    `;
    return div;
}

async function enviarComentario() {
    const texto = inputComentario.value.trim();

    if (texto === '') {
        inputComentario.style.borderColor = '#c0392b';
        inputComentario.focus();
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/denuncias/${denunciaId}`);
        if (!response.ok) throw new Error('Falha ao carregar denúncia.');

        const denuncia = await response.json();
        const comentarios = Array.isArray(denuncia.comentarios) ? denuncia.comentarios : [];

        comentarios.push({
            texto,
            enviadoEm: new Date().toISOString()
        });

        const patchResponse = await fetch(`http://localhost:3000/denuncias/${denunciaId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comentarios })
        });

        if (!patchResponse.ok) throw new Error('Falha ao salvar comentário.');

        feedComentarios.querySelector('.sem-comentarios')?.remove();
        feedComentarios.appendChild(criarElementoComentario(texto, 'agora mesmo'));
        inputComentario.value = '';
        charCount.textContent = '0';
        inputComentario.style.borderColor = '';

    } catch (erro) {
        console.error('Erro ao enviar comentário:', erro);
    }
}

async function carregarContadorTestemunhas() {
    try {
        const response = await fetch(`http://localhost:3000/denuncias/${denunciaId}`);
        if (!response.ok) throw new Error('Falha ao carregar dados da denúncia.');

        const denuncia = await response.json();
        const testemunhas = Array.isArray(denuncia.testemunhas) ? denuncia.testemunhas.length : 0;
        const count = denuncia.witness_count ?? testemunhas;

        witnessCount.textContent = formatarTestemunhas(count);
    } catch (erro) {
        console.warn('Erro ao carregar contador de testemunhas:', erro);
    }
}

function abrirPopupTestemunha() {
    if (!usuarioLogado) {
        alert('Faça login para enviar seu depoimento.');
        window.location.href = '../../modulos/login/login.html';
        return;
    }

    popupError.textContent = '';
    inputDepoimento.value = '';
    charCountDepoimento.textContent = '0';
    popupOverlay.classList.add('active');
    inputDepoimento.focus();
}

function fecharPopupTestemunha() {
    popupError.textContent = '';
    popupOverlay.classList.remove('active');
}

async function enviarDepoimento() {
    const texto = inputDepoimento.value.trim();

    if (texto === '') {
        popupError.textContent = 'Escreva seu depoimento antes de enviar.';
        inputDepoimento.style.borderColor = '#c0392b';
        inputDepoimento.focus();
        return;
    }

    if (!usuarioLogado || (usuarioLogado.id == null && usuarioLogado.id !== 0)) {
        popupError.textContent = 'Usuário inválido. Faça login novamente.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/denuncias/${denunciaId}`);
        if (!response.ok) throw new Error('Falha ao carregar denúncia.');

        const denuncia = await response.json();
        const testemunhas = Array.isArray(denuncia.testemunhas) ? denuncia.testemunhas : [];
        const jaTestemunhou = testemunhas.some(w => w.user_id === usuarioLogado.id);

        if (jaTestemunhou) {
            popupError.textContent = 'Você já enviou um depoimento para esta denúncia.';
            return;
        }

        testemunhas.push({
            user_id: usuarioLogado.id,
            depoimento: texto,
            enviadoEm: new Date().toISOString()
        });

        const patchResponse = await fetch(`http://localhost:3000/denuncias/${denunciaId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testemunhas, witness_count: testemunhas.length })
        });

        if (!patchResponse.ok) throw new Error('Falha ao salvar depoimento.');

        fecharPopupTestemunha();
        carregarContadorTestemunhas();
        alert('Depoimento enviado com sucesso. Apenas o contador de testemunhas será exibido.');
    } catch (erro) {
        popupError.textContent = 'Erro ao enviar depoimento. Tente novamente.';
        console.error(erro);
    }
}

inputComentario.addEventListener('input', () => {
    charCount.textContent = inputComentario.value.length;
    if (inputComentario.value.trim() !== '') inputComentario.style.borderColor = '';
});

inputDepoimento.addEventListener('input', () => {
    charCountDepoimento.textContent = inputDepoimento.value.length;
    if (inputDepoimento.value.trim() !== '') {
        popupError.textContent = '';
        inputDepoimento.style.borderColor = '';
    }
});

btnEnviar.addEventListener('click', enviarComentario);

btnTestemunhar.addEventListener('click', abrirPopupTestemunha);
btnFecharPopup.addEventListener('click', fecharPopupTestemunha);
btnCancelarDepoimento.addEventListener('click', fecharPopupTestemunha);
popupOverlay.addEventListener('click', event => {
    if (event.target === popupOverlay) fecharPopupTestemunha();
});
btnEnviarDepoimento.addEventListener('click', enviarDepoimento);

btnResolver.addEventListener('click', () => {
    statusTexto.textContent = 'Status: Resolvida ✅';
    statusTexto.classList.remove('status-pendente');
    statusTexto.classList.add('status-resolvido');
    btnResolver.textContent = 'Resolvida';
    btnResolver.style.backgroundColor = 'green';
    btnResolver.disabled = true;
});

carregarDenuncia();