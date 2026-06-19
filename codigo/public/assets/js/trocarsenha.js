const API_URL = 'http://localhost:3000';

const btnConfirmar = document.querySelector('.enviar');

let etapaAtual = 1;
let usuarioEncontrado = null;
let tipoUsuario = null; // 'profile' ou 'agent'

btnConfirmar.addEventListener('click', async () => {
  if (etapaAtual === 1) {
    await confirmarEmail();
  } else {
    await salvarNovaSenha();
  }
});

async function confirmarEmail() {
  // Busca o input no momento do clique, não na inicialização
  const emailInput = document.getElementById('email');
  if (!emailInput) return;

  const email = emailInput.value.trim();

  if (!email) {
    mostrarErro('Por favor, digite seu e-mail.');
    return;
  }

  try {
    // Verifica no profile
    const resProfile = await fetch(`${API_URL}/profile`);
    const profile = await resProfile.json();

    if (profile.email === email) {
      usuarioEncontrado = profile;
      tipoUsuario = 'profile';
      irParaEtapa2();
      return;
    }

    // Verifica nos agents
    const resAgents = await fetch(`${API_URL}/agents`);
    const agents = await resAgents.json();
    const agent = agents.find(a => a.email === email);

    if (agent) {
      usuarioEncontrado = agent;
      tipoUsuario = 'agent';
      irParaEtapa2();
      return;
    }

    mostrarErro('E-mail não encontrado. Verifique e tente novamente.');

  } catch (error) {
    mostrarErro('Erro ao conectar com o servidor. Tente novamente.');
    console.error(error);
  }
}

function irParaEtapa2() {
  etapaAtual = 2;

  const campoEmail = document.querySelector('.campo-email');
  campoEmail.innerHTML = `
    <label for="novaSenha">Digite a nova senha:</label>
    <input id="novaSenha" type="password" placeholder="Nova senha">
    <label for="confirmarSenha" style="margin-top: 12px;">Confirme a nova senha:</label>
    <input id="confirmarSenha" type="password" placeholder="Confirme a nova senha">
  `;

  document.querySelector('.form-area h1').textContent = 'Nova senha';
  document.querySelector('.form-area p').textContent = 'Digite e confirme sua nova senha abaixo.';
  btnConfirmar.textContent = 'Salvar';

  removerFeedback();
}

async function salvarNovaSenha() {
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

  if (!novaSenha || !confirmarSenha) {
    mostrarErro('Preencha os dois campos de senha.');
    return;
  }

  if (novaSenha !== confirmarSenha) {
    mostrarErro('As senhas não coincidem.');
    return;
  }

  if (novaSenha.length < 6) {
    mostrarErro('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  try {
    const url = tipoUsuario === 'profile'
      ? `${API_URL}/profile`
      : `${API_URL}/agents/${usuarioEncontrado.id}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: novaSenha })
    });

    if (res.ok) {
      mostrarSucesso('Senha alterada com sucesso!');
      setTimeout(() => history.back(), 2000);
    } else {
      mostrarErro('Erro ao salvar a senha. Tente novamente.');
    }

  } catch (error) {
    mostrarErro('Erro ao conectar com o servidor. Tente novamente.');
    console.error(error);
  }
}

function mostrarErro(mensagem) {
  removerFeedback();
  const el = document.createElement('p');
  el.id = 'mensagem-feedback';
  el.style.cssText = 'color: #c0392b; font-family: var(--font-body); font-size: 0.95rem; margin-top: 8px; text-align: center;';
  el.textContent = mensagem;
  document.querySelector('.botoes').before(el);
}

function mostrarSucesso(mensagem) {
  removerFeedback();
  const el = document.createElement('p');
  el.id = 'mensagem-feedback';
  el.style.cssText = 'color: var(--color-brand); font-family: var(--font-body); font-size: 0.95rem; margin-top: 8px; text-align: center;';
  el.textContent = mensagem;
  document.querySelector('.botoes').before(el);
}

function removerFeedback() {
  const existente = document.getElementById('mensagem-feedback');
  if (existente) existente.remove();
}