async function deletarCorretor(event) {
    event.preventDefault();

    const cpfDigitado = document.getElementById('cpf').value.trim();
    const urlBase = 'http://localhost:3000/agents';

    const confirmacao = confirm("Tem certeza absoluta que deseja deletar este corretor?");
    if (!confirmacao) return;

    const respostaBusca = await fetch(`${urlBase}?cpf=${encodeURIComponent(cpfDigitado)}`);

    if (!respostaBusca.ok) {
        throw new Error('Erro ao consultar o servidor.');
    }

    const corretoresEncontrados = await respostaBusca.json();

    if (corretoresEncontrados.length === 0) {
        alert('Nenhum corretor foi encontrado com o CPF informado.');
        return;
    }

    const corretor = corretoresEncontrados[0];
    const idCorretor = corretor.id;

    const respostaDelete = await fetch(`${urlBase}/${idCorretor}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (respostaDelete.ok) {
        alert(`Corretor "${corretor.nome}" deletado com sucesso!`);

        document.getElementById('form-cadastro').reset();
    } else {
        alert('Não foi possível deletar o corretor.');
    }
}