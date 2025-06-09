let agencias;
let estados;
let dev_mesmolugar = true;

// Obtendo os selects da barra
let select_uf_ret = document.getElementById('uf_ret');
let div_uf_ret = document.getElementById('uf_ret_div');

let select_ag_ret = document.getElementById('ag_ret');
let div_ag_ret = document.getElementById('ag_ret_div');

let select_data_ret = document.getElementById('data_ret');
let select_hora_ret = document.getElementById('hora_ret');

let select_uf_dev = document.getElementById('uf_dev');
let select_ag_dev = document.getElementById('ag_dev');
let select_data_dev = document.getElementById('data_dev');
let select_hora_dev = document.getElementById('hora_dev');

// Obtendo os dados salvos em "Session Storage"
let uf_ret = sessionStorage.getItem('uf_ret');
let ag_ret = sessionStorage.getItem('ag_ret');
let data_ret = sessionStorage.getItem('data_ret');
let hora_ret = sessionStorage.getItem('hora_ret');

let uf_dev = sessionStorage.getItem('uf_dev');
let ag_dev = sessionStorage.getItem('ag_dev');
let data_dev = sessionStorage.getItem('data_dev');
let hora_dev = sessionStorage.getItem('hora_dev');



// Obtendo o ID do carro que o usuário escolheu
let id_veiculo = sessionStorage.getItem('id_veiculo');


// ==================================================


/* CONFIGURANDO OS SELETORES DE ESTADOS E AGÊNCIAS */

fetch('http://127.0.0.1:3000/agencias/obterAgencias', {
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
    estados = data.estados;
    agencias = data.agencias;

    if (select_uf_ret) {    
        select_uf_ret.innerHTML = ' <option value="nulo">--</option> ';

        for (const estado in estados) {
            select_uf_ret.innerHTML += ` <option value="${estado}">${estado}</option> `;
        }
    }


    // Se houver dados salvos no sessionStorage, preenche
    if (uf_ret) {
        if (div_uf_ret) {
            div_uf_ret.innerHTML = uf_ret;

            for (const agencia of agencias) {
                if (agencia.ID == ag_ret) {
                    div_uf_ret.innerHTML = uf_ret;
                    div_ag_ret.innerHTML = agencia.Nome;
                }
            }

            exibirVeiculoAluguel();
        }
        else
        {
            select_uf_ret.value = uf_ret;

            for (const agencia of agencias) {
                if (agencia.Estado == uf_ret) {
                    select_ag_ret.innerHTML += `<option value="${agencia.ID}">${agencia.Nome}</option>`;
                }
            }
            select_ag_ret.value = ag_ret;

            filtrarVeiculos();
        }
    }

    if (uf_dev) {
        exibirSelectDev();

        select_uf_dev.value = uf_dev;

        for (const agencia of agencias) {
            if (agencia.Estado == uf_dev) {
                select_ag_dev.innerHTML += `<option value="${agencia.ID}">${agencia.Nome}</option>`;
            }
        }
        select_ag_dev.value = ag_dev;
    }

    if (data_ret) pickerRetirada.setDate(data_ret, true);
    if (data_dev) pickerDevolucao.setDate(data_dev, true);

    if (hora_ret) select_hora_ret.value = hora_ret;
    if (hora_dev) select_hora_dev.value = hora_dev;
})


/* Decidindo quais agências são mostradas no select estado de retirada de acordo com o estado escolhido */
if (select_uf_ret){
    select_uf_ret.addEventListener('change', function () {
        uf_ret = select_uf_ret.value;

        select_ag_ret.innerHTML = '';

        for (const agencia of agencias) {
            if (agencia.Estado == select_uf_ret.value)
            {
                select_ag_ret.innerHTML += ` <option value="${agencia.ID}">${agencia.Nome}</option> `;
            }
        }

        select_ag_ret.selectedIndex = 0;
        ag_ret = select_ag_ret.value;
        salvarSS();
        filtrarVeiculos();
    });
}

/* Troca a div com "Devolver em local diferente" por um input */
function exibirSelectDev() {
    dev_mesmolugar = false;

    document.getElementById('local-diferente').style.display = 'none';
    document.getElementById('cidade-devolucao-div').style.display = 'flex';

    select_uf_dev.innerHTML = ' <option value="nulo">--</option> ';
    console.log(estados)
    for (const estado in estados) {

        select_uf_dev.innerHTML += ` <option value="${estado}">${estado}</option> `;
    }
}

/* Decidindo quais agências são mostradas no select estado de devolução de acordo com o estado escolhido */
if (select_uf_dev) {
    select_uf_dev.addEventListener('change', function () {
        uf_dev = select_uf_dev.value;

        select_ag_dev.innerHTML = '';

        for (const agencia of agencias) {
            if (agencia.Estado == select_uf_dev.value)
            {
                select_ag_dev.innerHTML += ` <option value="${agencia.ID}">${agencia.Nome}</option> `;
            }
        }

        select_ag_dev.selectedIndex = 0;
        ag_dev = select_ag_dev.value;
        salvarSS();
    });
}

// ==================================================


/* CONFIGURANDO OS SELETORES DE DATA */

const data_retirada = document.getElementById('data_ret');
const data_devolucao = document.getElementById('data_dev');
const hoje = new Date();
const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

// Seletor data retirada
const pickerRetirada = flatpickr(data_retirada, {
    minDate: amanha,
    defaultDate: data_ret,
    dateFormat: "d/m/Y",

    onChange: function (selectedDates) {
        const dateObj = selectedDates[0];
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();

        data_ret = `${dia}/${mes}/${ano}`;
        salvarSS();
        atualizarMinDataDev(selectedDates[0]);
    }
});

// Seletor data devolução
const pickerDevolucao = flatpickr(data_devolucao, {
    minDate: new Date(amanha.getTime() + 24 * 60 * 60 * 1000),
    defaultDate: data_dev,
    dateFormat: "d/m/Y",

    onChange: function (selectedDates) {
        const dateObj = selectedDates[0];
        const dia = String(dateObj.getDate()).padStart(2, '0');
        const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
        const ano = dateObj.getFullYear();

        data_dev = `${dia}/${mes}/${ano}`;
        salvarSS();
    }
});


// Função para atualizar os dados da data de devolução quando a data de retirada for selecionanda
function atualizarMinDataDev(dataSelecionada) {
    const diaPosterior = new Date(dataSelecionada.getTime() + 24 * 60 * 60 * 1000);

    // Atualizando a data minima de devolucao
    pickerDevolucao.set('minDate', diaPosterior);

    // Se a data atual da devolução for menor ou igual à retirada, atualiza
    const dataAtualDev = pickerDevolucao.selectedDates[0];
    if (!dataAtualDev || dataAtualDev.getTime() <= dataSelecionada.getTime()) {
        pickerDevolucao.setDate(diaPosterior, true);

        const dia = String(diaPosterior.getDate()).padStart(2, '0');
        const mes = String(diaPosterior.getMonth() + 1).padStart(2, '0');
        const ano = diaPosterior.getFullYear();

        data_dev = `${dia}/${mes}/${ano}`;
        salvarSS();
    };
}


// ==================================================


/* CONFIGURANDO OS SELETORES DE HORA */


/* Adicionando as opções de hora */
const startHour = 8;
const endHour = 20;

for (let h = startHour; h <= endHour; h++) {
    for (let m of [0, 30]) {
        if (h === endHour && m > 0) break; // Evita adicionar 20:30

        const hour = String(h).padStart(2, '0');
        const min = String(m).padStart(2, '0');
        const time = `${hour}:${min}`;

        // Adicionando as opções
        select_hora_ret.add(new Option(time, time));
        select_hora_dev.add(new Option(time, time));
    }
}


// ==================================================


/* SALVAR e CARREGAR os dados so SESSION STORAGE */
function carregarSS() {
    uf_ret = sessionStorage.getItem('uf_ret');
    ag_ret = sessionStorage.getItem('ag_ret');
    data_ret = sessionStorage.getItem('data_ret');
    hora_ret = sessionStorage.getItem('hora_ret');

    uf_dev = sessionStorage.getItem('uf_dev');
    ag_dev = sessionStorage.getItem('ag_dev');
    data_dev = sessionStorage.getItem('data_dev');
    hora_dev = sessionStorage.getItem('hora_dev');

    id_veiculo = sessionStorage.getItem('id_veiculo');
}

function salvarSS() {
    sessionStorage.setItem('uf_ret', uf_ret);
    sessionStorage.setItem('ag_ret', ag_ret);
    sessionStorage.setItem('data_ret', data_ret);
    sessionStorage.setItem('hora_ret', hora_ret);

    sessionStorage.setItem('uf_dev', uf_dev);
    sessionStorage.setItem('ag_dev', ag_dev);
    sessionStorage.setItem('data_dev', data_dev);
    sessionStorage.setItem('hora_dev', hora_dev);

    sessionStorage.setItem('id_veiculo', id_veiculo);
}


// Filtra os veículos que estão na agência de retirada selecionada
function filtrarVeiculos() {
    const container = document.getElementById('container');
    if (!container) { return }

    container.innerHTML = ''

    fetch(`http://127.0.0.1:3000/veiculos/obterVeiculos/${ag_ret}`, {
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
        const veiculos = data.veiculos;

        // ADICIONANDO OS CARROS AO CONTAINER
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
                    <button class="btn_carro" data-agencia="${veiculo.agencia_ID}" data-veiculo="${veiculo.ID}">Alugar</button>
                </div>
            </div>
            `;
        }


        // USUÁRIO SELECIONA CARRO
        const buttons_carros = document.getElementsByClassName('btn_carro');
        for (const button of buttons_carros) {
            button.addEventListener('click', function () {
                id_veiculo = button.dataset.veiculo;
                salvarSS();

                // Redirecionando para a página de aluguel
                window.location.href = 'http://127.0.0.1:3000/paginas/aluguel.html';
            })
        }
    })

}


// ATUALIZANDO OS DADOS CASO O USUÁRIO OS MUDE
if (select_ag_ret) {
    select_ag_ret.addEventListener('change', function () {
        ag_ret = select_ag_ret.value;
        salvarSS();
        filtrarVeiculos();
    });
}

if (select_ag_dev) {    
    select_ag_dev.addEventListener('change', function () {
        ag_dev = select_ag_dev.value;
        salvarSS();
    });
}

if (select_hora_ret) {
    select_hora_ret.addEventListener('change', function () {
        hora_ret = select_hora_ret.value;
        salvarSS();
    });
}

if (select_hora_dev) {
    select_hora_dev.addEventListener('change', function () {
        hora_dev = select_hora_dev.value;
        salvarSS();
    });
}


// =================================================


function exibirVeiculoAluguel() {
    const infos_carro = document.getElementById('infos_carro');

    fetch(`http://127.0.0.1:3000/veiculos/obterVeiculos/${ag_ret}/${id_veiculo}`, {
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
        const veiculo = data.veiculo;

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
        `
    })

}