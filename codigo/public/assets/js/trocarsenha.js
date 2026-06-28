function trocarSenha() {
  const senhaAntiga = document.getElementById('senha_antiga').value;
  const senhaNova = document.getElementById('senha_nova').value;
  const senhaConfirmacao = document.getElementById('senha_confirmacao').value;

  if (senhaNova !== senhaConfirmacao) {
    alert('As senhas não coincidem.');
    return;
  }

  if (senhaAntiga === senhaNova) {
    alert('A nova senha não pode ser igual à senha antiga.');
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado) {
    alert('Usuário não está logado.');
    return;
  }

  const usuarioId = usuarioLogado.id;

  fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ senha: senhaNova })
  }).then(response => {
    if (response.ok) {
      alert('Senha alterada com sucesso!');
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('tipoUsuario');
      window.location.href = '../../index.html';
    } else {
      alert('Erro ao alterar a senha. Tente novamente.');
    }
  }
  ).catch(error => {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor.');
  });
}