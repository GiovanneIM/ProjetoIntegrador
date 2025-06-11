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
    const estados = data.estados;
    const agencias = data.agencias;

    for (const estado in estados) {
        const tabela_agencias = document.getElementById('tabela_agencias');
        const agenciasDoEstado = agencias.filter(agencia => agencia.Estado === estado);
    
        tabela_agencias.innerHTML += `
            <div class="celula">
                <div class="estado">
                    ${estados[estado]}
                </div>
    
                <div class="agencias" id="agencias-${estado}">
                </div>
            </div>`;
    
        for (const agencia of agenciasDoEstado) {
            const agencia_estado = document.getElementById(`agencias-${estado}`);
    
            agencia_estado.innerHTML += `
            <div>
                <div class="agencia_linha">
                    <div class="agencia-nome" id="${agencia.ID}" data-estado="${estado}">${agencia.Nome}</div>
                    <div class="agencia-CEP">${agencia.CEP}</div>
                </div>
    
                <div class="agencia_linha">
                    <div class="agencia-endereco">${agencia.Endereco}</div>
                </div>
            </div>`;
    
        }
    }


    const agencias_div = document.getElementsByClassName('agencia-nome');
    for (const agencia of agencias_div) {
        agencia.addEventListener('click', () => {
            console.log(agencia.id);
            console.log(agencia.getAttribute('data-estado'));
            
            const uf_ret = agencia.getAttribute('data-estado');
            const ag_ret = agencia.id;

            salvarAG_ES(uf_ret, ag_ret);

            window.location.href = 'http://127.0.0.1:3000/paginas/busca.html'
        });
    }
})



function salvarAG_ES(uf_ret, ag_ret) {
    sessionStorage.setItem('uf_ret', uf_ret);
    sessionStorage.setItem('ag_ret', ag_ret);
}