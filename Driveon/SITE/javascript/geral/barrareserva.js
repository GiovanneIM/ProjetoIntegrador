let agencias;
let estados;

const select_estado = document.getElementById('uf_ret');
const select_agencia = document.getElementById('ag_ret');


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

    select_estado.innerHTML = '';

    for (const estado in estados) {
        select_estado.innerHTML += ` <option value="${estado}">${estado}</option> `;
    }
})



/* Troca a div com "Devolver em local diferente" por um input */
function trocarPorInput() {
    document.getElementById('local-diferente').style.display = 'none';
    document.getElementById('cidade-devolucao-div').style.display = 'flex';
    document.getElementById('cidade-devolucao').focus(); // opcional: foca no input automaticamente
}


/* Decidindo quais agências são mostradas no select agendas de acordo com o estado escolhido */
select_estado.addEventListener('change', function () {
    select_agencia.innerHTML = '';

    for (const agencia of agencias) {
        if (agencia.Estado == select_estado.value)
        {
            select_agencia.innerHTML += ` <option value="${agencia.ID}">${agencia.Nome}</option> `;
        }
    }
});


































/* Click no botão de busca */
document.getElementById('btn_Buscar').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const formData = new FormData(document.getElementById('form_busca')); // Obtém o form
    const entradas = Object.fromEntries(formData.entries());              // Obtém os dados do form

    // Salvando os dados do form no Armazenamento de sessão (Próprio do navegador)
    sessionStorage.setItem('estado_retirada', entradas['estado_retirada']);
    sessionStorage.setItem('agencia_retirada', entradas['agencia_retirada']);
    sessionStorage.setItem('data_retirada', entradas['data_retirada']);
    sessionStorage.setItem('hora_retirada', entradas['hora_retirada']);

    sessionStorage.setItem('estado_devolucao', entradas['estado_devolucao']);
    sessionStorage.setItem('agencia_devolucao', entradas['agencia_devolucao']);
    sessionStorage.setItem('data_devolucao', entradas['data_devolucao']);
    sessionStorage.setItem('hora_devolucao', entradas['hora_devolucao']);

    // Redirecionando para a página de busca
    window.location.href = '/paginas/busca.html';
})