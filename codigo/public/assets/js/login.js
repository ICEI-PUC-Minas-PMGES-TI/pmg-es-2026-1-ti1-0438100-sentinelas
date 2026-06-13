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
    const nome = document.getElementById('nome').value.trim()
    const usuario = document.getElementById('usuario').value.trim()
    const senha = document.getElementById('senha').value.trim()

    if (!nome || !usuario || !senha) {
        document.getElementById('erro-geral').textContent = 'Preencha todos os campos.'
        document.getElementById('erro-geral').style.display = 'block'
        return
    }

    document.getElementById('erro-geral').style.display = 'none'

    try {
        const respostaUsuarios = await fetch('http://localhost:3000/usuarios')
        const usuarios = await respostaUsuarios.json()

        const respostaAgentes = await fetch('http://localhost:3000/agents')
        const agentes = await respostaAgentes.json()

const usuarioEncontrado = usuarios.find(u =>
    u.usuario === nome &&
    (u.email === usuario || u.numero === usuario) &&
    u.senha === senha
)

const agenteEncontrado = agentes.find(a =>
    a.name === nome &&
    (a.email === usuario || a.phone_number === usuario) &&
    a.senha === senha
)

if (usuarioEncontrado || agenteEncontrado) {
    window.location.href = 'denuncias.html'
} else {
    document.getElementById('erro-geral').textContent = 'Dados incorretos.'
    document.getElementById('erro-geral').style.display = 'block'
}

    } catch (erro) {
        document.getElementById('erro-geral').textContent = 'Erro ao conectar com o servidor.'
        document.getElementById('erro-geral').style.display = 'block'
    }
})

