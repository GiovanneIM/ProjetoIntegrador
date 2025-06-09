let agencias;
let estados;
let dev_mesmolugar = true;

const select_uf_ret = document.getElementById('uf_ret');
const select_ag_ret = document.getElementById('ag_ret');
const select_data_ret = document.getElementById('data_ret');
const select_hora_ret = document.getElementById('hora_ret');

const select_uf_dev = document.getElementById('uf_dev');
const select_ag_dev = document.getElementById('ag_dev');
const select_data_dev = document.getElementById('data_dev');
const select_hora_dev = document.getElementById('hora_dev');


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

    select_uf_ret.innerHTML = ' <option value="nulo">--</option> ';

    for (const estado in estados) {
        select_uf_ret.innerHTML += ` <option value="${estado}">${estado}</option> `;
    }
})


/* Decidindo quais agências são mostradas no select estado de retirada de acordo com o estado escolhido */
select_uf_ret.addEventListener('change', function () {
    select_ag_ret.innerHTML = '';

    for (const agencia of agencias) {
        if (agencia.Estado == select_uf_ret.value)
        {
            select_ag_ret.innerHTML += ` <option value="${agencia.ID}">${agencia.Nome}</option> `;
        }
    }
});


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
select_uf_dev.addEventListener('change', function () {
    select_ag_dev.innerHTML = '';

    for (const agencia of agencias) {
        if (agencia.Estado == select_uf_dev.value)
        {
            select_ag_dev.innerHTML += ` <option value="${agencia.ID}">${agencia.Nome}</option> `;
        }
    }
});


// ==================================================


/* CONFIGURANDO OS SELETORES DE DATA */

const data_retirada = document.getElementById('data_ret');
const data_devolucao = document.getElementById('data_dev');
const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);

// Seletor data retirada
const pickerRetirada = flatpickr(data_retirada, {
    minDate: amanha,
    defaultDate: amanha,
    dateFormat: "d/m/Y",

    onChange: function (selectedDates) {
        atualizarMinDataDev(selectedDates[0]);
    }
});

// Seletor data devolução
const pickerDevolucao = flatpickr(data_devolucao, {
    minDate: new Date(amanha.getTime() + 24 * 60 * 60 * 1000),
    defaultDate: new Date(amanha.getTime() + 24 * 60 * 60 * 1000),
    dateFormat: "d/m/Y",
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


/* CONFIGURANDO O ENVIO DOS DADOS */

/* Click no botão de busca */
document.getElementById('btn_Buscar').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const dataRetPicker = document.getElementById('data_ret')._flatpickr;
    const dataDevPicker = document.getElementById('data_dev')._flatpickr;

    const dataRet = dataRetPicker.selectedDates[0];
    const dataDev = dataDevPicker.selectedDates[0];

    const horaRet = document.getElementById('hora_ret').value;
    const horaDev = document.getElementById('hora_dev').value;

    if (!dataRet || !dataDev || !horaRet || !horaDev) {
        alert('Preencha todos os campos de data e hora.');
        return;
    }

    const dtRet = new Date(`${dataRet.toDateString()} ${horaRet}`);
    const dtDev = new Date(`${dataDev.toDateString()} ${horaDev}`);

    if (dtDev <= dtRet) {
        alert('A data e hora de devolução devem ser posteriores à retirada.');
        return;
    }

    // Salvando os dados do form no Armazenamento de sessão
    sessionStorage.setItem('uf_ret', document.getElementById('uf_ret').value);
    sessionStorage.setItem('ag_ret', document.getElementById('ag_ret').value);
    sessionStorage.setItem('data_ret', dataRetPicker.input.value); 
    sessionStorage.setItem('hora_ret', horaRet);

    sessionStorage.setItem('uf_dev', document.getElementById('uf_dev').value);
    sessionStorage.setItem('ag_dev', document.getElementById('ag_dev').value);
    sessionStorage.setItem('data_dev', dataDevPicker.input.value);
    sessionStorage.setItem('hora_dev', horaDev);

    // Redirecionando para a página de busca
    window.location.href = 'http://127.0.0.1:3000/paginas/busca.html';
})