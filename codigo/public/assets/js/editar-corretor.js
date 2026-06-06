const urlBase = 'http://localhost:3000/agents';

const urlParams = new URLSearchParams(window.location.search);
const corretorId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (corretorId) {
        carregarDadosCorretor(corretorId);
    } else {
        alert('ID do corretor não foi informado na URL. Não é possível editar.');
    }
});

async function carregarDadosCorretor(id) {
    try {
        const resposta = await fetch(`${urlBase}/${id}`);

        if (!resposta.ok) {
            throw new Error('Corretor não encontrado.');
        }

        const corretor = await resposta.json();

        document.getElementById('nome').value = corretor.nome || '';
        document.getElementById('email').value = corretor.email || '';
        document.getElementById('telefone').value = corretor.telefone || '';
        document.getElementById('descricao').value = corretor.descricao || '';
        document.getElementById('senha').value = corretor.senha || '';
        document.getElementById('confirmar-senha').value = corretor.senha || '';

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
        alert('Não foi possível carregar as informações do corretor.');
    }
}

async function editarCorretor(event) {
    event.preventDefault();

    if (!corretorId) {
        alert('Erro: Nenhum ID de corretor detectado para atualização.');
        return;
    }

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const descricao = document.getElementById('descricao').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem! Por favor, verifique.");
        return;
    }

    const corretorAtualizado = {
        nome,
        email,
        telefone,
        descricao,
        senha
    };

    const resposta = await fetch(`${urlBase}/${corretorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(corretorAtualizado)
    });

    if (resposta.ok) {
        alert('Informações do corretor atualizadas com sucesso!');
    } else {
        alert('Houve um erro ao tentar atualizar os dados.');
    }
}