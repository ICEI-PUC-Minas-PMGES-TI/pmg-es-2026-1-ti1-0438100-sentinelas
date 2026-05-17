const listaDenuncias = document.getElementById('lista-denuncias');
const listaNotificacoes = document.getElementById('lista-notificacoes');
const loading = document.getElementById('loading');

function formatarTempoPassado(dataISO) {
  const data = new Date(dataISO);
  const diferencaHoras = Math.max(1, Math.round((Date.now() - data.getTime()) / (1000 * 60 * 60)));

  if (diferencaHoras < 24) {
    return `${diferencaHoras}h atrás`;
  }

  const diferencaDias = Math.round(diferencaHoras / 24);
  return `${diferencaDias}d atrás`;
}

async function formatarLocalizacao(location) {
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return { address: 'Localização não informada', city: '', neighborhood: '' };
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`);

    if (!response.ok) {
      return { address: 'Endereço desconhecido', city: '', neighborhood: '' };
    }

    const data = await response.json();

    return {
      address: data.address.road || 'Endereço desconhecido',
      city: data.address.city || 'Cidade desconhecida',
      neighborhood: data.address.neighbourhood || 'Bairro desconhecido',
    };
  } catch (error) {
    console.error('Erro ao buscar localização:', error);
    return { address: 'Endereço desconhecido', city: '', neighborhood: '' };
  }
}

function formatarTipoDenuncia(type) {
  const tipos = {
    theft: 'Furto',
    robbery: 'Roubo'
  };

  return tipos[type] || 'Denúncia';
}

function formatarPrioridade(relevancy) {
  const configuracoes = {
    urgent: { label: 'Urgente', className: 'text-bg-danger' },
    informative: { label: 'Informativa', className: 'text-bg-info' }
  };

  return configuracoes[relevancy] || { label: 'Moderada', className: 'text-bg-secondary' };
}

fetch('http://localhost:3000/denuncias')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Não foi possível carregar as denúncias.');
    }

    return response.json();
  })
  .then(async (denuncias) => {
    listaDenuncias.innerHTML = '';

    for (const denuncia of denuncias) {
      const prioridade = formatarPrioridade(denuncia.relevancy);
      const card = document.createElement('div');
      const localizacao = await formatarLocalizacao(denuncia.location);
      card.className = 'col-12 col-lg-6';

      card.innerHTML = `
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex justify-content-between gap-3">
            <div class="me-3 text-start">
              <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span class="badge ${prioridade.className}">${prioridade.label}</span>
                <small class="text-muted">${formatarTempoPassado(denuncia.date)} • ${denuncia.witness_count} testemunhas</small>
              </div>

              <h3 class="fw-bold">${formatarTipoDenuncia(denuncia.type)}</h3>

              <p class="text-muted mb-2">
                <i class="bi bi-geo-alt-fill me-1"></i>
                ${localizacao.address}, ${localizacao.neighborhood}, ${localizacao.city}
              </p>

              <p class="small mb-0">
                ${denuncia.description}
              </p>
            </div>

            <div class="placeholder-img flex-shrink-0"></div>
          </div>
        </div>
      `;

      listaDenuncias.appendChild(card);
    }

    if (denuncias.length === 0) {
      listaDenuncias.innerHTML = '<div class="col-12"><p class="text-center text-muted mb-0">Nenhuma denúncia encontrada.</p></div>';
    }

    loading.style.display = 'none';
    listaNotificacoes.style.display = 'block';
  })
  .catch((error) => {
    console.error(error);
    loading.innerHTML = '<p class="fw-semibold text-danger">Falha ao carregar as denúncias.</p>';
    listaNotificacoes.style.display = 'block';
  });