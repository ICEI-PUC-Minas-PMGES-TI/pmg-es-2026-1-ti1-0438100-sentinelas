const notificacoes = [
    { status: "Grave",    titulo: "Alagamento",                 local: "Rua B",            descricao: "Rua inundada." },
    { status: "Grave",    titulo: "Enchente",                   local: "Rua E",            descricao: "Área de risco." },
    { status: "Grave",    titulo: "Alagamento",                 local: "Rua São Jorge",    descricao: "Alagamento frequente durante as chuvas, causando danos a veículos e residências." },
    { status: "Moderado", titulo: "Buracos na via",             local: "Rua A",            descricao: "Problemas na pista." },
    { status: "Moderado", titulo: "Iluminação falha",           local: "Rua D",            descricao: "Postes apagados." },
    { status: "Moderado", titulo: "Alta irregularidade na rua", local: "Rua Padrão",       descricao: "Moradores relataram alto nível de acidentes causados por buracos na via." },
    { status: "Moderado", titulo: "Alta irregularidade na rua", local: "Rua Central",      descricao: "Grande fluxo de veículos e baixa sinalização aumentam o risco de acidentes." },
    { status: "Moderado", titulo: "Alta irregularidade na rua", local: "Avenida Brasil",   descricao: "Iluminação precária durante a noite compromete a segurança dos moradores." },
    { status: "Moderado", titulo: "Alta irregularidade na rua", local: "Rua das Flores",   descricao: "Buracos e falta de manutenção causam transtornos frequentes." },
    { status: "Moderado", titulo: "Iluminação precária",        local: "Rua das Palmeiras",descricao: "Poste de iluminação quebrado há meses, deixando a rua escura e perigosa à noite." },
    { status: "Moderado", titulo: "Buracos na rua",             local: "Avenida Brasil",   descricao: "Vários buracos na avenida causam transtornos e aumentam o risco de acidentes." },
    { status: "Leve",     titulo: "Lixo acumulado",             local: "Rua C",            descricao: "Acúmulo de lixo." },
    { status: "Leve",     titulo: "Entulho",                    local: "Rua F",            descricao: "Entulho na calçada." },
    { status: "Leve",     titulo: "Lixo Acumulado",             local: "Praça Central",    descricao: "Lixo acumulado nas ruas causa problemas de saúde pública e atrai pragas." }
];

const container = document.getElementById("lista-notificacoes");

function renderizar(lista) {
    container.innerHTML = "";
    lista.forEach(n => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <span class="tag ${n.status.toLowerCase()}">${n.status}</span>
            <h3>${n.titulo}</h3>
            <p class="local">📍 ${n.local}</p>
            <p class="descricao">${n.descricao}</p>
        `;
        container.appendChild(card);
    });
}

function filtrar(tipo, botao) {
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    if (tipo === "Todos") {
        renderizar(notificacoes);
    } else {
        const filtrados = notificacoes.filter(n =>
            n.status.toLowerCase() === tipo.toLowerCase()
        );
        renderizar(filtrados);
    }
}

renderizar(notificacoes);