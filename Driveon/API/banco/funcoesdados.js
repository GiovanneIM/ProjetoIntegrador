const fs = require('fs');

const caminhoUsers = './banco/usuarios.json';
const caminhoVeiculos = './banco/veiculos.json';
const caminhoReservas = './banco/reservas.json';

// Retorna um Array com os usuarios e suas informações
function carregarUsuarios() {
    const usuarios = fs.readFileSync(caminhoUsers, 'utf-8');
    return JSON.parse(usuarios);
}

// Salva os usuarios e suas informações
function salvarUsuarios(usuarios) {
    fs.writeFileSync(caminhoUsers, JSON.stringify(usuarios, null, 4));
}




// Retorna um Array com os veiculos e suas informações
function carregarVeiculos() {
    const veiculos = fs.readFileSync(caminhoVeiculos, 'utf-8');
    return JSON.parse(veiculos);
}

// Salva os veiculos e suas informações
function salvarVeiculos(veiculos) {
    fs.writeFileSync(caminhoVeiculos, JSON.stringify(veiculos, null, 4));
}




// Retorna um Array com as reservas e suas informações
function carregarReservas() {
    const veiculos = fs.readFileSync(caminhoReservas, 'utf-8');
    return JSON.parse(veiculos);
}

// Salva as reservas e suas informações
function salvarReservas(veiculos) {
    fs.writeFileSync(caminhoReservas, JSON.stringify(veiculos, null, 4));
}





// Permitindo que as funções sejam exportadas
module.exports = {
    carregarUsuarios,
    salvarUsuarios,
    carregarVeiculos,
    salvarVeiculos,
    carregarReservas,
    salvarReservas
};