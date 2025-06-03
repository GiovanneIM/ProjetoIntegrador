/*
    CÓDIGO PARA ATUALIZAR DADOS DO USUÁRIO
*/


// Escolha de foto
document.querySelector('.selecionarimagem').addEventListener('click', () => {
  document.querySelector('#fileUpload').click();
});


// Formatação do CPF
document.getElementById('CPF').addEventListener('input', function (e) { // Identifica quando o texto em 'CPF-Forms1' foi alterado
    let value = e.target.value.replace(/\D/g, ''); // Remove todos os digitos que não forem números

    if (value.length > 11) value = value.slice(0, 11); // Não permite que o usuário digite mais de 11 caracteres

    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Garante a formatação do CPF com '.' e '-'

    e.target.value = value; // Atualiza o texto no input
});

// Formatação do CEP e Determinação dos demais campos de endereço
document.getElementById('CEP').addEventListener('input', async function (e) { // Identifica quando o texto em 'CEP' foi alterado
    let novoCEP = e.target.value.replace(/\D/g, ''); // Remove todos os digitos que n ão forem números

    if (novoCEP.length > 8) { novoCEP = novoCEP.slice(0, 8); } // Não permite que o usuário digite mais de 8 caracteres

    novoCEP = novoCEP.replace(/(\d{5})(\d)/, '$1-$2')   // Garante a formatação do CEP com '-'

    e.target.value = novoCEP; // Atualiza o texto no input


    let res;
    if (novoCEP.length === 9) {
        // Acessa a API do "viacep" para obter o endereço do usuário
        res = await fetch(`https://viacep.com.br/ws/${novoCEP.replace('-', '')}/json`);
        const data = await res.json();
        // console.log(data);

        if (data.erro == true) {
            alert('CEP ínvalido');
        }
        else{
            // Preenche os dados que dependem do CEP
            document.getElementById('estado').value = data.uf;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('rua').value = data.logradouro;
        }
    }

    // console.log(res);
});

// Formatação do Telefone
document.getElementById('telefone').addEventListener('input', function (e) { // Identifica quando o texto em 'CPF-Forms1' foi alterado
    let value = e.target.value.replace(/\D/g, ''); // Remove todos os digitos que não forem números

    if (value.length > 11) value = value.slice(0, 11); // Não permite que o usuário digite mais de 11 caracteres

    value = value.replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2'); // Garante a formatação com '(', ')' e '-'
    e.target.value = value; // Atualiza o texto no input
});

// =================================================================================================================

document.getElementById("btnCancelar").addEventListener('click', async function (e) {
    window.location.href = 'perfil.html';
})

document.getElementById("btnSalvar").addEventListener('click', async function (e) {
    const atualizado = {}

    // Coletando os inputs
    const inputs = document.getElementsByTagName('input');

    // Adicionando à 'atualizado' as informações que não forem arquivos
    for (const input of inputs) {
        if (input.value && input.type !== 'file') {
            if (input.id == 'novo_nome'){
                const nomes = input.value.trim().split(' ');
                atualizado.nome = nomes[0];

                atualizado.nomecompleto = input.value;
            }
            else { atualizado[input.id] = input.value; }
        }
    }

    if (atualizado.CEP) {
        try{
            const res = await fetch(`https://viacep.com.br/ws/${atualizado.CEP}/json`);
            const data = await res.json();

            atualizado.endereco = {
                estado: data.uf,
                cidade: data.localidade,
                bairro: data.bairro,
                rua: data.logradouro
            };
        }
        catch (error) {
            console.error("Erro ao buscar o endereço pelo CEP:", error);
        }
    }


    // Atualizando os dados
    if (Object.keys(atualizado).length > 0) {
        fetch('http://10.84.6.135:3000/atualizardados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(atualizado),
        })
        .then(res => res.json())
        .then(dados => console.log('Dados enviados:',atualizado))
        .catch(
            Swal.fire({
                confirmButtonColor: '#0e5a91',
                title: 'Erro!',
                html: `<b>Houve um erro ao se comunicar com a API</b><br>Não será possível fazer login, cadastrar-se ou visualizar dados.`,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        );
    }

    // Atualizando a imagem
    const inputFoto = document.getElementById('input-foto');
    if (inputFoto && inputFoto.files.length > 0) {
        const formData = new FormData();
        formData.append('foto', inputFoto.files[0]);

        fetch('http://10.84.6.135:3000/alterar-foto', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        .then(res => res.json())
        .then(dados => console.log('Imagem enviada:', dados));
    }

    window.location.href = 'perfil.html';
})