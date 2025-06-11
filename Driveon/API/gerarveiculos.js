const fs = require('fs');
const caminhoVeiculos = './banco/veiculos.json';


function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min, max) {
  let num = Math.random() * (max - min) + min;
  return Math.round(num * 100) / 100;
}

function salvarVeiculos(agencias) {
    fs.writeFileSync(caminhoVeiculos, JSON.stringify(agencias, null, 4));
}



// agencia_ID → de 1 a 54

// marca
const marca = 'Chevrolet'

// MODELOS DOS CARROS → de 0 a 17
const modelo = [
    'Chevrolet Onix',
    'Chevrolet Onix Plus',
    'Chevrolet S10 Cabine Simples',
    'Chevrolet S10 High Country',
    'Chevrolet S10 LTZ',
    'Chevrolet S10 WT AT',
    'Chevrolet S10 Z71',
    'Chevrolet Spin 1.8 AT',
    'Chevrolet Spin LT',
    'Chevrolet Spin LTZ',
    'Chevrolet Spin Premier',
    'Chevrolet Tracker',
    'Chevrolet Trailblazer',
    'Chevrolet Blazer EV RS',
    'Chevrolet Camaro',
    'Chevrolet Equinox',
    'Chevrolet Montana',
    'Chevrolet Silverado'
]

// ANOS DE FABRICAÇÃO → de 0 a 5
const anoFabricacao = [ 2019, 2020, 2021, 2022, 2023, 2024]

// Vetor para controlar o número de veículos
let numveiculos = 0;

// Cores dos modelos
const cores = {
    'Chevrolet Onix': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet Onix Plus': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet S10 Cabine Simples': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet S10 High Country': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet S10 LTZ': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet S10 WT AT': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet S10 Z71': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho'],
    'Chevrolet Spin 1.8 AT': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto'],
    'Chevrolet Spin LT': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto'],
    'Chevrolet Spin LTZ': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto'],
    'Chevrolet Spin Premier': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto'],
    'Chevrolet Tracker': ['Azul', 'Branco', 'Cinza', 'Prata', 'Preto', 'Verde', 'Vermelho'],
    'Chevrolet Trailblazer': ['Branco', 'Cinza', 'Prata', 'Preto', 'Verde'],
    'Chevrolet Blazer EV RS': ['Vermelho'],
    'Chevrolet Camaro': ['Preto'],
    'Chevrolet Equinox': ['Verde'],
    'Chevrolet Montana': ['Vermelho'],
    'Chevrolet Silverado': ['Prata']
}




// GERANDO VEICULOS
const agencias = {}

for (let agencia_ID = 1; agencia_ID <= 54; agencia_ID++) {

    const veiculosDaAgencia = [];


    // Gera de 15 a 20 veiculos
    for (let i = 0; i < aleatorioEntre(15, 20); i++) {

        
        const numModelo = aleatorioEntre(0, modelo.length - 1);
        const ano = aleatorioEntre(0, anoFabricacao.length - 1);
        const preco = randomDecimal(85, 110);
        const nomeModelo = modelo[numModelo];

        const coresDisponiveis = cores[nomeModelo];
        const cor = coresDisponiveis[aleatorioEntre(0, coresDisponiveis.length - 1)];

        const nomeModelohifen = nomeModelo.replaceAll(' ', '-').replaceAll('Chevrolet-', '');
        const imagem = `/imagens/veiculos/${nomeModelohifen}/${nomeModelohifen}-${cor}.png`;


        // Criando veículo
        const novoveiculo = {
            "agencia_ID": agencia_ID,
            "cor": cor,
            "imagem": imagem,
            "marca": marca,
            "modelo": nomeModelo,
            "preco": preco,
            "disponivel": true,
            "ID": numveiculos,
            "anoFabricacao": anoFabricacao[ano]
        };


        // Adicionando à agência
        veiculosDaAgencia.push(novoveiculo);

        // Atualizando o númeto de veículos
        numveiculos++;
    }


    agencias[agencia_ID] = veiculosDaAgencia;
}

salvarVeiculos(agencias);