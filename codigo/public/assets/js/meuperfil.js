const campoCpf = document.getElementById('cpf');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const btnSalvar = document.querySelector('.btn-salvar');

const API_URL = 'http://localhost:3000';
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

function carregarPerfil() {
    campoNome.value = usuario.nome;
    campoEmail.value = usuario.email;
    campoCpf.value = usuario.cpf;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!usuario) {
        window.location.href = 'login.html';
    }

    carregarPerfil();
});

campoTelefone.addEventListener('input', () => {
    let v = campoTelefone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2})$/, '($1');
    }
    campoTelefone.value = v;
});

campoCpf.addEventListener('input', () => {
    let v = campoCpf.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) {
        v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
        v = v.replace(/^(\d{3})(\d{3})(\d{0,3})$/, '$1.$2.$3');
    } else if (v.length > 3) {
        v = v.replace(/^(\d{3})(\d{0,3})$/, '$1.$2');
    }
    campoCpf.value = v;
});

function mostrarErro(campo, mensagem) {
    campo.style.borderColor = '#c0392b';
    let erro = campo.parentElement.querySelector('.msg-erro');
    if (!erro) {
        erro = document.createElement('span');
        erro.classList.add('msg-erro');
        campo.parentElement.appendChild(erro);
    }
    erro.textContent = mensagem;
}

function limparErro(campo) {
    campo.style.borderColor = '';
    const erro = campo.parentElement.querySelector('.msg-erro');
    if (erro) erro.remove();
}

[campoNome, campoEmail, campoTelefone, campoCpf].forEach(campo => {
    campo.addEventListener('input', () => limparErro(campo));
});

btnSalvar.addEventListener('click', async () => {
    let valido = true;

    if (campoNome.value.trim() === '') {
        mostrarErro(campoNome, 'O nome não pode estar vazio.');
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(campoEmail.value.trim())) {
        mostrarErro(campoEmail, 'Informe um e-mail válido.');
        valido = false;
    }

    const telLimpo = campoTelefone.value.replace(/\D/g, '');
    if (telLimpo.length < 10 || telLimpo.length > 11) {
        mostrarErro(campoTelefone, 'Informe um telefone válido.');
        valido = false;
    }

    const cpfLimpo = campoCpf.value.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        mostrarErro(campoCpf, 'Informe um CPF válido.');
        valido = false;
    }

    if (!valido) return;

    try {
        btnSalvar.textContent = 'Salvando...';
        btnSalvar.disabled = true;

        const response = await fetch(`${API_URL}/profile/${usuario.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: campoNome.value.trim(),
                email: campoEmail.value.trim(),
                phone_number: campoTelefone.value,
                cpf: campoCpf.value
            })
        });

        if (!response.ok) throw new Error('Erro ao salvar perfil');

        btnSalvar.textContent = 'Salvo!';
        btnSalvar.style.backgroundColor = '#2f798a';
        setTimeout(() => {
            btnSalvar.textContent = 'Salvar Alterações';
            btnSalvar.style.backgroundColor = '';
            btnSalvar.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        btnSalvar.textContent = 'Erro ao salvar';
        btnSalvar.style.backgroundColor = '#c0392b';
        setTimeout(() => {
            btnSalvar.textContent = 'Salvar Alterações';
            btnSalvar.style.backgroundColor = '';
            btnSalvar.disabled = false;
        }, 2000);
    }
});