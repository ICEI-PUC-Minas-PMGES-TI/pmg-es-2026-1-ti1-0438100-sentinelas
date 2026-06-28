function getUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuario) {
        const username = document.getElementById('username');
        username.textContent = usuario.nome;
        username.href = '../perfil/meuperfil.html';

        switch (usuario.perfil) {
            case 'admin':
                const adminLink = document.getElementById('admin-link');
                adminLink.style.display = 'block';
                break;
            case 'corretor':
                const corretorLink = document.getElementById('corretor-link');
                corretorLink.style.display = 'block';
                username.href = '../corretor/dados-corretor.html';
                break;
        }
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../login/login.html';
}

document.addEventListener('DOMContentLoaded', getUsuario);