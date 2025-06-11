function exibirReservas() {
    const reservas_emandamento = document.getElementById('reservas_emandamento');
    const reservas_concluidas = document.getElementById('reservas_concluidas');

    if (!reservas_emandamento) { return }

    fetch('http://127.0.0.1:3000/obterReservas', {
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

        const reservas = data.reservasDoUsuario;

        for (const reserva of reservas) {
            // console.log(reserva);
            const veiculo = reserva.veiculo;

            if (!veiculo) continue;

            const exibicao = `
                <div class="reserva">
                    <div class="imagem_carro">
                        <img src="${veiculo.imagem}">
                    </div>

                    <div class="infos_reserva">
                        <div class="infos_reserva" style="padding: 0">
                            <div style="width: 200px;">
                                <h1>Início</h1>
                                <div class="infos">
                                    <h2><b>Data: </b><span>${reserva.retirada.data}</span></h2>
                                    <h2><b>Hora: </b><span>${reserva.retirada.hora}</span></h2>
                                </div>
                            </div>

                            <div style="width: 200px;">
                                <h1>Término</h1>
                                <div class="infos">
                                    <h2><b>Data: </b><span>${reserva.devolucao.data}</span></h2>
                                    <h2><b>Hora: </b><span>${reserva.devolucao.hora}</span></h2>
                                </div>
                            </div>

                            <div style="flex: 1;">
                                <h1>Local</h1>
                                <div class="infos">
                                    <h2><b>Retirada: </b><span>${reserva.retirada.uf} - ${reserva.agencia_ret.Nome}</span></h2>
                                    <h2><b>Devolução: </b><span>${reserva.devolucao.uf} - ${reserva.agencia_dev.Nome}</span></h2>
                                </div>
                            </div>
                        </div>

                        <div style="align-items: center; display: flex; ">
                            <div style="min-width: 175px;">
                                <h1>Status</h1>
                                <div class="infos">
                                    <h2><b><span id="status_txt" style="color:${statusCor(reserva.status)};">${reserva.status}</span></b></h2>
                                </div>
                            </div>

                            <button class="btn_reserva" id="${reserva.id_reserva}">Conferir reserva</button>
                        </div>
                    </div>
                </div>
            `;

            if (reserva.status == 'Agendada' || reserva.status == 'Em andamento') {
                reservas_emandamento.innerHTML += exibicao;
            } else {
                reservas_concluidas.innerHTML += exibicao;
            }
        }

        const btns_reservas = document.getElementsByClassName('btn_reserva');
        for (const botao of btns_reservas) {
            botao.addEventListener('click', function () {
                console.log(botao.id);
                sessionStorage.setItem('id_reserva_session', botao.id);
                window.location.href = 'http://127.0.0.1:3000/paginas/reserva.html'
            })
        }
    })
}
exibirReservas();


// ------------------------------------------------------------------------


function exibirReservaEspecifica() {
    const id_reserva_session = sessionStorage.getItem('id_reserva_session');

    const uf_ret_div = document.getElementById('uf_ret_div');
    const ag_ret_div = document.getElementById('ag_ret_div');
    const data_ret_div = document.getElementById('data_ret_div');
    const hora_ret_div = document.getElementById('hora_ret_div');
    const uf_dev_div = document.getElementById('uf_dev_div');
    const ag_dev_div = document.getElementById('ag_dev_div');
    const data_dev_div = document.getElementById('data_dev_div');
    const hora_dev_div = document.getElementById('hora_dev_div');

    const infos_carro = document.getElementById('infos_carro');

    const status_reserva_barra = document.getElementById('status');


    if (!infos_carro) { return }

    let veiculo_ID;

    fetch('http://127.0.0.1:3000/obterReservas', {
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

        const reservas = data.reservasDoUsuario;

        for (const reserva of reservas) {
            if (reserva.id_reserva == id_reserva_session){
                const veiculo = reserva.veiculo;
                veiculo_ID = veiculo.ID;

                // Exibindo informações da reserva
                uf_ret_div.innerHTML = reserva.retirada.uf;
                ag_ret_div.innerHTML = reserva.agencia_ret.Nome;
                data_ret_div.innerHTML = reserva.retirada.data;
                hora_ret_div.innerHTML = reserva.retirada.hora;
                uf_dev_div.innerHTML = reserva.devolucao.uf;
                ag_dev_div.innerHTML = reserva.agencia_dev.Nome;
                data_dev_div.innerHTML = reserva.devolucao.data;
                hora_dev_div.innerHTML = reserva.devolucao.hora;

                // Exibindo as informações do carro
                infos_carro.innerHTML = `
                    <div class="div_carro" id="${veiculo.agencia_ID} ${veiculo.ID}">
                        <div class="imagem_carro">
                            <img src="${veiculo.imagem}">
                        </div>

                        <div class="desc_carro">
                            <h1>${veiculo.modelo} ${veiculo.anoFabricacao}</h1>
                            <h2>Easy Entry <br>Motor Turbo</h2>
                            <p><strong>R$ ${veiculo.preco} / dia</strong></p>
                        </div>
                    </div>
                    
                    <div class="descricao_carro" id="descricao_carro"></div>
                `;

                obterDescricao(veiculo.modelo);


                status_reserva_barra.textContent  += reserva.status;

                document.getElementById('btn_CancelarReserva').style.display = reserva.status == 'Agendada'? 'block': 'none';
                status_reserva_barra.style.backgroundColor = statusCor(reserva.status);
            }
        }
    })

    document.getElementById('btn_Voltar').addEventListener('click', function () {
        window.location.href = 'http://127.0.0.1:3000/paginas/pages-User/perfil.html'
    })

    document.getElementById('btn_CancelarReserva').addEventListener('click', function () {

        Swal.fire({
                title: "Tem certeza?",
                icon: "question",
                text: "Deseja cancelar sua reserva",
                showDenyButton: true,

                confirmButtonText: "Cancelar reserva",
                confirmButtonColor: 'firebrick',

                denyButtonText: `Voltar`,
                denyButtonColor: '#004aad',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch('http://127.0.0.1:3000/cancelarReserva', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            id_reserva: id_reserva_session,
                            id_veiculo: veiculo_ID
                         })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao enviar os dados');
                        }
                        return response.json();
                    })
                    .then(data => {
                        Swal.fire("Reserva Cancelada!", "", "success")
                        .then(() => {
                            window.location.reload();
                        });
                    })
                    
                } else if (result.isDenied) {
                }
        });
    })
}
exibirReservaEspecifica();




function statusCor(status) {
    switch (status) {
        case 'Agendada':
            return 'gray';
        case 'Em andamento':
            return 'darkgoldenrod';
        case 'Concluída':
            return 'seagreen';
        case 'Cancelada':
            return 'darkred';
        default:
            return 'gray';
    }
}



function obterDescricao(modelo) {
    fetch('http://127.0.0.1:3000/veiculos/descricao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "modelo": modelo })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar a descrição');
        }
        return response.json();
    })
    .then(data => {
        if (data.descricao) {
            document.getElementById('descricao_carro').innerHTML = data.descricao;
        } else {
            document.getElementById('descricao_carro').innerHTML = '<p>Descrição não encontrada.</p>';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('descricao_carro').innerHTML = '<p>Erro ao carregar descrição.</p>';
    });
}