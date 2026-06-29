const botaoEntrar = document.getElementById("botao-entrar")
const botaoOlho = document.getElementById("botao-olho")
const inputSenha = document.getElementById("senha")

botaoOlho.addEventListener("click", function () {
    if (inputSenha.type === "password") {
        inputSenha.type = "text"
    } else {
        inputSenha.type = "password"
    }
})

botaoEntrar.addEventListener('click', async function () {
    const login = document.getElementById('usuario').value.trim()
    const senha = document.getElementById('senha').value.trim()

    if (!usuario || !senha) {
        document.getElementById('erro-geral').textContent = 'Preencha todos os campos.'
        document.getElementById('erro-geral').style.display = 'block'
        return
    }

    document.getElementById('erro-geral').style.display = 'none'

    try {
        let usuario = null;
        await fetch(`http://localhost:3000/usuarios?email=${login}`).then(
            resposta => resposta.json()).then(dados => {
                if (dados.length > 0) {
                    usuario = dados[0];
                }
            });

        await fetch(`http://localhost:3000/agents?email=${login}`).then(
            resposta => resposta.json()).then(dados => {
                if (dados.length > 0) {
                    usuario = dados[0];
                }
            });

        if (usuario.senha == senha) {
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
            localStorage.setItem('tipoUsuario', usuario.perfil)
            window.location.href = '../../modulos/denuncias/denuncias.html'
        } else {
            alert('Senha incorreta. Tente novamente.')
        }
    } catch (erro) {
        document.getElementById('erro-geral').textContent = 'Erro ao conectar com o servidor.'
        document.getElementById('erro-geral').style.display = 'block'
    }
})

