const botaoEntrar = document.getElementById("botao-entrar")
const botaoOlho = document.getElementById("botao-olho")
const inputSenha = document.getElementById("senha")


botaoOlho.addEventListener("click", function(){
    if(inputSenha.type === "password"){
        inputSenha.type = "text"
    } else {
        inputSenha.type = "password"
    }
})