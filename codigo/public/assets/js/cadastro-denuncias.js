function getLocalizacao() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getEndereco(latitude, longitude).then((endereco) => {
                const numeroRua = endereco.address.house_number ? `, ${endereco.address.house_number}` : '';
                document.getElementById('local').value = `${endereco.address.road || 'Rua desconhecida'}${numeroRua} - ${endereco.address.city || 'cidade desconhecida'}, ${endereco.address.state || 'estado desconhecido'}`;
            });
        }
    );
}

async function getEndereco(latitude, longitude) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    return data;
}

async function submitDenuncia(event) {
    event.preventDefault();
    const local = document.getElementById('local').value;
    let tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const relevancia = document.getElementById('relevancia').value;

    const localJson = await fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(local) + '&format=json');
    const localData = await localJson.json();
    let localizacao = [localData[0].lat, localData[0].lon];

    switch (tipo) {
        case 'assalto':
            tipo = 'assault';
            break;
        case 'roubo':
            tipo = 'theft';
            break;
        case 'vandalismo':
            tipo = 'vandalism';
            break;
        case 'assalto':
            tipo = 'assault';
            break;
        case 'burglary':
            tipo = 'burglary';
            break;
        default:
            tipo = 'other';
    }

    const denuncia = {
        type: tipo,
        description: descricao,
        location: localizacao,
        relevancy: relevancia,
        date: new Date().toISOString(),
        witness_count: 0,
        status: 'open',
        user_id: 1
    };

    try {
        const response = await fetch('http://localhost:3000/denuncias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(denuncia),
        });
        if (response.ok) {
            alert('Denúncia enviada com sucesso!');
        } else {
            alert('Erro ao enviar denúncia. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao enviar denúncia:', error);
        alert('Erro ao enviar denúncia. Tente novamente.');
    }
}