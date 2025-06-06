/* ROTAS PARA DINÂMICA DE AGÊNCIAS */

const express = require('express');
const router = express.Router();

const f_dados = require('../banco/funcoesdados');
const reservas = f_dados.carregarReservas();


/* Lógica passar as Agências e suas informações */
router.get('/obterReservas', (req, res) => {
    res.json({ reservas });
});





module.exports = router;