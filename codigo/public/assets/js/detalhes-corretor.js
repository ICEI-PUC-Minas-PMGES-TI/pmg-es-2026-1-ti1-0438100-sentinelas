const AGENT_API_URL = "http://localhost:3000/agents/1";
const IMOVEIS_API_URL = "http://localhost:3000/properties?agentId=1";

async function carregarDadosCorretor() {
    const resposta = await fetch(AGENT_API_URL);
    const corretor = await resposta.json();
    document.getElementById('nome-corretor').textContent = corretor.name;
    document.getElementById('especialidade').textContent = corretor.specialty;
    document.getElementById('area-atuacao').textContent = corretor.area_of_expertise;
    document.getElementById('experiencia').textContent = corretor.experience;
    document.getElementById('contato').textContent = corretor.phone_number;
}

async function carregarImoveisCorretor() {
    const resposta = await fetch(IMOVEIS_API_URL);
    const imoveis = await resposta.json();
    const containerImoveis = document.getElementById('imoveis-regiao');
    containerImoveis.innerHTML = "";
    if (imoveis.length === 0) { 
        containerImoveis.innerHTML = `<p class="text-muted m-0">Nenhum imóvel cadastrado por este corretor.</p>`;
        return;
    }
    imoveis.forEach(imovel => {
        const precoFormatado = imovel.preco.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
        const imovelHTML = `
            <div class="card-imovel d-flex">
                <div class="conteudo-card">
                    <div class="cabecalho-card d-flex align-items-center">
                        <span class="info-imovel">
                            ${imovel.quartos} quartos • ${imovel.banheiros} banheiro${imovel.banheiros > 1 ? 's' : ''} • ${imovel.tamanho}
                        </span>
                    </div>
                    <h2 class="titulo-imovel">${imovel.nome} - ${precoFormatado} (${imovel.tipo})</h2>
                    <p class="localizacao">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                        </svg>
                        ${imovel.local}
                    </p>
                    <p class="descricao">${imovel.descricao}</p>
                </div>
                <div class="imagem-placeholder"></div>
            </div>`;
        containerImoveis.insertAdjacentHTML('beforeend', imovelHTML);
    });
}

document.addEventListener("DOMContentLoaded", carregarDadosCorretor);
document.addEventListener("DOMContentLoaded", carregarImoveisCorretor);

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

    const resposta = await fetch(AGENT_API_URL, {
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

