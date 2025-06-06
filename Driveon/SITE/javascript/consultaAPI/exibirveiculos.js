let veiculos;

fetch('http://127.0.0.1:3000/veiculos/obterVeiculos', {
    method: 'GET',
    credentials: 'include'
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar os dados');
    }
    return response.json();
})
.then(data => {
    veiculos = data.veiculos;
    const container = document.getElementById('container');

    for (const veiculo of veiculos) {
    
        container.innerHTML += `
            <div class="card_carro" id="${veiculo.agencia_ID} ${veiculo.ID}">
                <div class="imagemcarro">
                    <img src="${veiculo.imagem}">
                </div>

                <div class="desc_carro">
                    <h1>${veiculo.modelo} ${veiculo.anoFabricacao}</h1>
                    <h2>Easy Entry <br>Motor Turbo</h2>
                    <p><strong>R$ ${veiculo.preco} / dia</strong></p>
                    <button>Alugar</button>
                </div>
            </div>
            `;
    }
})
