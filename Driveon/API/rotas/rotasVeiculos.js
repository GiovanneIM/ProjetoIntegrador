/* ROTAS PARA DINÂMICA DE VEÍCULOS */

const express = require('express');
const router = express.Router();

const f_dados = require('../banco/funcoesdados');
const veiculos = f_dados.carregarVeiculos();


/* Lógica para obter um array com os veículos*/
router.get('/obterVeiculos/:agencia_ID', (req, res) => {
    const agencia_ID = req.params.agencia_ID;
    res.json({ veiculos: veiculos[agencia_ID] });
});

router.get('/obterVeiculos/:agencia_ID/:veiculo_ID', (req, res) => {
    const agencia_ID = req.params.agencia_ID;
    const veiculo_ID = req.params.veiculo_ID;

    for (const veiculo of veiculos[agencia_ID]) {
        if (veiculo.ID == veiculo_ID) {
            res.json({ veiculo });
        }
    }
});


/* Lógica para registrar um novo veículo*/
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




module.exports = router;
