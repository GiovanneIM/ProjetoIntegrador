/* ROTAS PARA DINÂMICA DE VEÍCULOS */

const express = require('express');
const router = express.Router();

const f_dados = require('../banco/funcoesdados');
let veiculos = f_dados.carregarVeiculos();


/* Lógica para obter um array com os veículos de uma agência*/
router.get('/obterVeiculos/:agencia_ID', (req, res) => {
    veiculos = f_dados.carregarVeiculos();

    const agencia_ID = req.params.agencia_ID;
    res.json({ veiculos: veiculos[agencia_ID] });
});

/* Lógica para obter um veículo em específico */
router.get('/obterVeiculos/:agencia_ID/:veiculo_ID', (req, res) => {
    veiculos = f_dados.carregarVeiculos();
    const agencia_ID = req.params.agencia_ID;
    const veiculo_ID = req.params.veiculo_ID;

    for (const veiculo of veiculos[agencia_ID]) {
        if (veiculo.ID == veiculo_ID) {
            res.json({ veiculo });
        }
    }
});


/* Lógica para registrar um novo veículo */
router.post('/registrarVeiculos', (req, res) => {
    const novosVeiculos = req.body;

    for (const novoVeiculo of novosVeiculos) {
        novoVeiculo.disponivel = true;
        novoVeiculo.ID = veiculos.length;


        if (!novoVeiculo || !novoVeiculo.agencia_ID || !novoVeiculo.imagem ||
            !novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.preco
        ) {
            return res.json({ mensagem: 'Dados incompletos do veículo.' });
        }

        veiculos.push(novoVeiculo);
        f_dados.salvarVeiculos(veiculos);
    }

    res.json({ mensagem: 'Veículos registrados com sucesso.' });
});

/* Lógica para obter a descrição de um modelo */
router.post('/descricao', (req, res) => {
    const descricoes = f_dados.carregarDescricoes();
    const modelo = req.body.modelo

    let descricao = descricoes[modelo]

    res.json({ descricao });
});


module.exports = router;