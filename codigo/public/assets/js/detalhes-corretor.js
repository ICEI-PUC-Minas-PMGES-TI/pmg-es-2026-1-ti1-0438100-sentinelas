const API_URL = "http://localhost:3000/agent/1"

async function carregarDadosCorretor() {
    const resposta = await fetch(API_URL);
    
    const corretor = await resposta.json();

    document.getElementById('nome-corretor').textContent = corretor.name;
    document.getElementById('especialidade').textContent = corretor.specialty;
    document.getElementById('area-atuacao').textContent = corretor.area_of_expertise;
    document.getElementById('experiencia').textContent = corretor.experience;
    document.getElementById('contato').textContent = corretor.phone_number;


}


document.addEventListener("DOMContentLoaded", carregarDadosCorretor);

const btnEditar = document.querySelector("#btnEditar");

btnEditar.addEventListener("click", function() {
    document.querySelectorAll('.modo-edicao').forEach(elem => elem.style.display = 'block');
    document.querySelectorAll('.modo-visualizacao').forEach(elem => elem.style.display = 'none');
});

const btnSalvar = document.querySelector("#btnSalvar");

btnSalvar.addEventListener("click", async function() {
    const dadosAtualizados = {
        id: "1",
        name: document.getElementById('nome-input').value,
        cpf: "987.654.321-00",
        specialty: document.getElementById('especialidade-input').value,
        area_of_expertise: document.getElementById('area-atuacao-input').value,
        experience: document.getElementById('experiencia-input').value,
        phone_number: document.getElementById('contato-input').value
    };

    const resposta = await fetch(API_URL, {
        method: "put",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dadosAtualizados)
    })

    document.getElementById('nome-corretor').textContent = dadosAtualizados.name;
    document.getElementById('especialidade').textContent = dadosAtualizados.specialty;
    document.getElementById('area-atuacao').textContent = dadosAtualizados.area_of_expertise;
    document.getElementById('experiencia').textContent = dadosAtualizados.experience;
    document.getElementById('contato').textContent = dadosAtualizados.phone_number;

    document.querySelectorAll('.modo-edicao').forEach(elem => elem.style.display = 'none');
    document.querySelectorAll('.modo-visualizacao').forEach(elem => elem.style.display = 'block');
});
