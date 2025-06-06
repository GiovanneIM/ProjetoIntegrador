let estados;

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
                    <div class="agencia-nome" id="${agencia.ID}">${agencia.Nome}</div>
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
            
            fetch('http://127.0.0.1:3000/fazerBusca', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: agencia.id })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar os dados');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = '/paginas/busca.html'
            })
        });
    }
})



