const fs = require('fs');

const caminhoUsers = './banco/usuarios.json';
const caminhoAgencias = './banco/agencias.json';
const caminhoVeiculos = './banco/veiculos.json';
const caminhoDescricoes = './banco/descricao.json';
const caminhoReservas = './banco/reservas.json';


/* ============================================================== */


// Retorna um Array com os usuarios e suas informações
function carregarUsuarios() {
    const usuarios = fs.readFileSync(caminhoUsers, 'utf-8');
    return JSON.parse(usuarios);
}

// Salva os usuarios e suas informações
function salvarUsuarios(usuarios) {
    fs.writeFileSync(caminhoUsers, JSON.stringify(usuarios, null, 4));
}


/* ============================================================== */


// Retorna um Array com os veiculos e suas informações
function carregarVeiculos() {
    const veiculos = fs.readFileSync(caminhoVeiculos, 'utf-8');
    return JSON.parse(veiculos);
}

// Salva os veiculos e suas informações
function salvarVeiculos(veiculos) {
    fs.writeFileSync(caminhoVeiculos, JSON.stringify(veiculos, null, 4));
}

// Retorna um as descrições dos modelos de veiculos
function carregarDescricoes() {
    const descricoes = fs.readFileSync(caminhoDescricoes, 'utf-8');
    return JSON.parse(descricoes);
}


/* ============================================================== */


// Retorna um Array com as reservas e suas informações
function carregarReservas() {
    const reservas = fs.readFileSync(caminhoReservas, 'utf-8');
    return JSON.parse(reservas);
}

// Salva as reservas e suas informações
function salvarReservas(reservas) {
    fs.writeFileSync(caminhoReservas, JSON.stringify(reservas, null, 4));
}


/* ============================================================== */


// Retorna um Array com as agências e suas informações
function carregarAgencias() {
    const agencias = fs.readFileSync(caminhoAgencias, 'utf-8');
    return JSON.parse(agencias);
}

// Salva as agências e suas informações
function salvarAgencias(agencias) {
    fs.writeFileSync(caminhoAgencias, JSON.stringify(agencias, null, 4));
}


/* ============================================================== */


// Permitindo que as funções sejam exportadas
module.exports = {
    carregarUsuarios,
    salvarUsuarios,
    carregarAgencias,
    salvarAgencias,
    carregarVeiculos,
    salvarVeiculos,
    carregarDescricoes,
    carregarReservas,
    salvarReservas
};