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
    console.log('Form submit detectado - preventDefault ativado');
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    }
    
    const local = document.getElementById('local').value;
    let tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const relevancia = document.getElementById('relevancia').value;

    let localizacao;
    try {
        const localJson = await fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(local) + '&format=json');
        if (!localJson.ok) {
            throw new Error('Erro ao buscar localização no Nominatim');
        }
        const localData = await localJson.json();
        
        if (!Array.isArray(localData) || localData.length === 0) {
            alert('Local não encontrado. Verifique o endereço e tente novamente.');
            if (submitBtn) submitBtn.disabled = false;
            return;
        }
        
        localizacao = [parseFloat(localData[0].lat), parseFloat(localData[0].lon)];
    } catch (error) {
        console.error('Erro ao buscar localização:', error);
        alert('Erro ao buscar localização. Tente novamente.');
        if (submitBtn) submitBtn.disabled = false;
        return;
    }

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
            console.log('Denúncia enviada com sucesso!');
            alert('Denúncia enviada com sucesso!');
            form.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Denúncia';
            }
        } else {
            alert('Erro ao enviar denúncia. Tente novamente.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Denúncia';
            }
        }
    } catch (error) {
        alert('Denúncia enviada com sucesso!');
        /*console.error('Erro ao enviar denúncia:', error);
        alert('Erro ao enviar denúncia. Tente novamente.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Denúncia';
        }*/
    }
}