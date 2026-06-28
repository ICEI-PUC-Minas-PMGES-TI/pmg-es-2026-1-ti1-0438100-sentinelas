const API = 'http://localhost:3000';
const listaEl = document.getElementById('lista-denuncias');
const filtroEl = document.getElementById('filtro-status');
const contadorEl = document.getElementById('contador');

const TIPOS = {
    theft: 'Furto',
    robbery: 'Roubo',
    assault: 'Agressão',
    vandalism: 'Vandalismo',
    drug_dealing: 'Tráfico',
    suspicious: 'Suspeito',
    other: 'Outro'
};

function formatarData(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function mostrarToast(msg) {
    const existente = document.querySelector('.toast-msg');
    if (existente) existente.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function carregarDenuncias() {
    try {
        const response = await fetch(`${API}/denuncias`);
        if (!response.ok) throw new Error('Erro ao carregar denúncias');
        let denuncias = await response.json();

        const filtro = filtroEl.value;
        if (filtro === 'pendentes') {
            denuncias = denuncias.filter(d => !d.verificado);
        } else if (filtro === 'verificadas') {
            denuncias = denuncias.filter(d => d.verificado);
        }

        contadorEl.textContent = `${denuncias.length} denúncia${denuncias.length !== 1 ? 's' : ''}`;
        listaEl.innerHTML = '';

        if (denuncias.length === 0) {
            listaEl.innerHTML = `
                <div class="admin-vazio">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3 3 0 0 0 8 11.5a3 3 0 0 0 2.032-.75.5.5 0 1 1 .683.732A4 4 0 0 1 8 12.5a4 4 0 0 1-2.715-1.25.5.5 0 0 1 0-.683z"/>
                    </svg>
                    <h3>Nenhuma denúncia encontrada</h3>
                    <p>${filtro === 'pendentes' ? 'Todas as denúncias foram verificadas!' : filtro === 'verificadas' ? 'Nenhuma denúncia foi verificada ainda.' : 'Nenhuma denúncia cadastrada.'}</p>
                </div>`;
            return;
        }

        for (const denuncia of denuncias) {
            const card = await criarCard(denuncia);
            listaEl.appendChild(card);
        }
    } catch (erro) {
        console.error('Erro:', erro);
        listaEl.innerHTML = `<div class="admin-vazio"><h3>Erro ao carregar dados</h3><p>Verifique se o servidor está rodando em ${API}</p></div>`;
    }
}

async function criarCard(d) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.dataset.id = d.id;

    let criador = { usuario: 'Desconhecido', email: '—', numero: '—' };
    try {
        const r = await fetch(`${API}/usuarios/${d.user_id}`);
        if (r.ok) criador = await r.json();
    } catch (_) { }

    let testemunhas = [];
    try {
        const r = await fetch(`${API}/denuncia_testemunhas?denuncia_id=${d.id}`);
        if (r.ok) testemunhas = await r.json();
    } catch (_) { }

    const testemunhasDetalhes = await Promise.all(testemunhas.map(async (wt) => {
        try {
            const r = await fetch(`${API}/usuarios/${wt.usuario_id}`);
            if (r.ok) {
                const u = await r.json();
                return { ...wt, nome: u.usuario, email: u.email };
            }
        } catch (_) { }
        return { ...wt, nome: 'Desconhecido', email: '—' };
    }));

    const tipoLabel = TIPOS[d.type] || d.type || 'Desconhecido';
    const isVerificado = d.verificado;
    const statusClass = isVerificado ? 'status-verificado-label' : 'status-pendente-label';
    const statusText = isVerificado ? 'Verificado' : 'Pendente';

    let relevancyBadge = '';
    if (d.relevancy === 'urgent') relevancyBadge = '<span class="tipo-badge tipo-badge-urgent">Urgente</span>';
    else if (d.relevancy === 'moderate') relevancyBadge = '<span class="tipo-badge tipo-badge-moderate">Moderado</span>';
    else if (d.relevancy === 'informative') relevancyBadge = '<span class="tipo-badge tipo-badge-informative">Informativo</span>';

    let testemunhasHtml = '';
    if (testemunhasDetalhes.length > 0) {
        testemunhasHtml = `<ul class="admin-card-testemunhas-lista">`;
        testemunhasDetalhes.forEach(t => {
            testemunhasHtml += `<li><span class="testemunha-nome">${t.nome}</span> <span class="testemunha-email">(${t.email})</span><br><small style="color:#888;">${t.depoimento ? t.depoimento.substring(0, 80) + (t.depoimento.length > 80 ? '...' : '') : ''}</small></li>`;
        });
        testemunhasHtml += `</ul>`;
    } else {
        testemunhasHtml = '<p style="color:#aaa; font-size:0.9rem; margin:0;">Nenhuma testemunha registrada.</p>';
    }

    card.innerHTML = `
        <div class="admin-card-topo">
            <div class="admin-card-tipo">
                ${tipoLabel} ${relevancyBadge}
                <span style="font-weight:400;color:#888;font-size:0.85rem;margin-left:12px;">#${d.id}</span>
            </div>
            <div class="admin-card-status">
                <span class="${statusClass}">${statusText}</span>
            </div>
        </div>
        <div class="admin-card-corpo">
            <div class="admin-card-descricao">
                <p>${d.description || 'Sem descrição.'}</p>
                <span class="data-label">${formatarData(d.date)}</span>
            </div>
            <div class="admin-card-secao">
                <h4>Criador</h4>
                <div class="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                    ${criador.usuario}
                </div>
                <div class="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                    </svg>
                    ${criador.email}
                </div>
                <div class="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-.926-.516L5.314 7.53a1.75 1.75 0 0 1-.516-.926l.547-2.19a.68.68 0 0 0-.122-.58z"/>
                    </svg>
                    ${criador.numero || '—'}
                </div>
            </div>
            <div class="admin-card-secao">
                <h4>Testemunhas (${testemunhasDetalhes.length})</h4>
                ${testemunhasHtml}
            </div>
        </div>
        <div class="admin-card-acoes">
            <button class="btn-verificar" data-id="${d.id}" ${isVerificado ? 'disabled' : ''}>
                ${isVerificado ? 'Verificado' : 'Marcar como Verificada'}
            </button>
            <a href="../denuncias/detalhe-denuncias.html?id=${d.id}" class="btn-detalhes">
                Ver Detalhes
            </a>
        </div>
    `;

    const btnVerificar = card.querySelector('.btn-verificar');
    if (btnVerificar && !isVerificado) {
        btnVerificar.addEventListener('click', async () => {
            try {
                const r = await fetch(`${API}/denuncias/${d.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ verificado: true })
                });
                if (!r.ok) throw new Error('Falha ao atualizar');
                mostrarToast('Denúncia verificada com sucesso!');
                carregarDenuncias();
            } catch (erro) {
                console.error(erro);
                alert('Erro ao verificar denúncia.');
            }
        });
    }

    return card;
}

filtroEl.addEventListener('change', carregarDenuncias);
carregarDenuncias();
