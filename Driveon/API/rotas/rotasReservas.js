/* ROTAS PARA DINÂMICA DE AGÊNCIAS */

const express = require('express');
const router = express.Router();

const f_dados = require('../banco/funcoesdados');
let reservas = f_dados.carregarReservas();


// /* Lógica para marcar como concluídas reservas com o dia e hora de devolução menor que o atual*/
// router.get('/concluirReservas', (req, res) => {
//     reservas = f_dados.carregarReservas();

//     const agora = new Date();
//     let atualizadas = 0;

//     function parseDataHora(dataStr, horaStr) {
//         const [dia, mes, ano] = dataStr.split('/');
//         const isoString = `${ano}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}T${horaStr}:00`;
//         return new Date(isoString);
//     }

//     for (const usuarioID in reservas) {
//         const listaReservas = reservas[usuarioID];

//         for (const reserva of listaReservas) {
//             if (reserva.status === 'Cancelada') continue;

//             const dataRet = parseDataHora(reserva.retirada.data, reserva.retirada.hora);
//             const dataDev = parseDataHora(reserva.devolucao.data, reserva.devolucao.hora);

//             if (agora > dataDev && reserva.status !== 'Concluída') {
//                 reserva.status = 'Concluída';
//                 atualizadas++;
//             } else if (agora >= dataRet && agora <= dataDev && reserva.status !== 'Em andamento') {
//                 reserva.status = 'Em andamento';
//                 atualizadas++;
//             } else if (agora < dataRet && reserva.status !== 'Agendada') {
//                 reserva.status = 'Agendada';
//                 atualizadas++;
//             }
//         }
//     }

//     f_dados.salvarReservas(reservas);

//     res.status(200).json({ mensagem: `${atualizadas} reservas atualizadas com sucesso.` });
// });



function atualizarStatusReservas() {
    const reservas = f_dados.carregarReservas();
    const veiculos = f_dados.carregarVeiculos();
    const agora = new Date();
    let atualizadas = 0;

    function parseDataHora(dataStr, horaStr) {
        const [dia, mes, ano] = dataStr.split('/');
        const isoString = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${horaStr}:00`;
        return new Date(isoString);
    }

    for (const usuarioID in reservas) {
        const listaReservas = reservas[usuarioID];

        for (const reserva of listaReservas) {
            if (reserva.status === 'Cancelada') continue;

            const dataRet = parseDataHora(reserva.retirada.data, reserva.retirada.hora);
            const dataDev = parseDataHora(reserva.devolucao.data, reserva.devolucao.hora);

            if (agora > dataDev && reserva.status !== 'Concluída') {
                reserva.status = 'Concluída';
                atualizadas++;

                // Liberar e mover veículo, se necessário
                const agenciaRetiradaID = String(reserva.retirada.ag);
                const agenciaDevolucaoID = String(reserva.devolucao.ag || reserva.retirada.ag);
                const veiculoID = reserva.id_veiculo;

                const veiculoIndex = veiculos[agenciaRetiradaID]?.findIndex(v => v.ID === Number(veiculoID));
                if (veiculoIndex !== -1) {
                    const veiculo = veiculos[agenciaRetiradaID][veiculoIndex];
                    veiculo.disponivel = true;

                    if (agenciaRetiradaID !== agenciaDevolucaoID) {
                        veiculos[agenciaRetiradaID].splice(veiculoIndex, 1);
                        veiculos[agenciaDevolucaoID] = veiculos[agenciaDevolucaoID] || [];
                        veiculos[agenciaDevolucaoID].push(veiculo);
                    }
                }

            } else if (agora >= dataRet && agora <= dataDev && reserva.status !== 'Em andamento') {
                reserva.status = 'Em andamento';
                atualizadas++;

            } else if (agora < dataRet && reserva.status !== 'Agendada') {
                reserva.status = 'Agendada';
                atualizadas++;
            }
        }
    }

    if (atualizadas > 0) {
        f_dados.salvarReservas(reservas);
        f_dados.salvarVeiculos(veiculos);
        console.log(`[Atualização] ${atualizadas} reservas atualizadas.`);
    }
}


module.exports = {
    router,
    atualizarStatusReservas
};