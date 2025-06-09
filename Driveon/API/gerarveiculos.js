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

// Vetor com as imagend dos carros → de 1 a 9
const imagens = [
    '/imagens/veiculos/blazereevrs.png',
    '/imagens/veiculos/camaro.png',
    '/imagens/veiculos/equinox.png',
    '/imagens/veiculos/montana.png',
    '/imagens/veiculos/onixplus.png',
    '/imagens/veiculos/silverado.png',
    '/imagens/veiculos/spin.png',
    '/imagens/veiculos/tracker.png',
    '/imagens/veiculos/trailblazer.png'
]

// marca
const marca = 'Chevrolet'

// Vetor com os modelos dos carros → de 1 a 9
const modelo = [
    'Chevrolet Blazer EV RS',
    'Chevrolet Equinox',
    'Chevrolet Camaro',
    'Chevrolet Montana',
    'Chevrolet Onix Plus',
    'Chevrolet Silverado',
    'Chevrolet Spin',
    'Chevrolet Tracker',
    'Chevrolet Trailblazer'
]

// Vetor com os anos de fabricacao → de 1 a 5
const anoFabricacao = [
    2020,
    2021,
    2022,
    2023,
    2024
]

let numveiculos = 0;




// GERANDO VEICULOS
const agencias = {}

for (let agencia_ID = 1; agencia_ID <= 54; agencia_ID++) {

    const veiculosDaAgencia = [];

    for (let i = 0; i < aleatorioEntre(10, 15); i++) {

        const numModelo = aleatorioEntre(0, 8);
        const ano = aleatorioEntre(0, 4);
        const preco = randomDecimal(85, 110);
        
        const novoveiculo = {
            "agencia_ID": agencia_ID,
            "imagem": imagens[numModelo],
            "marca": marca,
            "modelo": modelo[numModelo],
            "preco": preco,
            "disponivel": true,
            "ID": numveiculos,
            "anoFabricacao": anoFabricacao[ano]
        };

        numveiculos++;

        veiculosDaAgencia.push(novoveiculo);
    }

    agencias[agencia_ID] = veiculosDaAgencia;
}

salvarVeiculos(agencias);