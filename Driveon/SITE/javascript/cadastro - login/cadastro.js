/*
    CÓDIGO PARA FAZER CADASTRO DE UM USUÁRIO
*/


const novoUser= {img: "/usuario-img/padrao/usuario.png", CNH: "", endereco: {}};


// =====================================================


//Formatação do NOME
document.getElementById('nome-input').addEventListener('input', async function (e) { // Identifica quando o texto em 'CEP' foi alterado
    const nome = e.target.value.replace(' ', ''); // Remove o espaço (' ')
    e.target.value = nome; // Atualiza o texto no input
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
document.getElementById('CEP-input').addEventListener('input', async function (e) { // Identifica quando o texto em 'CEP' foi alterado
    let cep = e.target.value.replace(/\D/g, ''); // Remove todos os digitos que n ão forem números

    if (cep.length > 8) cep = cep.slice(0, 8); // Não permite que o usuário digite mais de 8 caracteres

    cep = cep.replace(/(\d{5})(\d)/, '$1-$2')   // Garante a formatação do CEP com '-'

    e.target.value = cep; // Atualiza o texto no input


    let res;
    if (cep.length === 9) {
        // Acessa a API do "viacep" para obter o endereço do usuário
        res = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json`);
        const data = await res.json();
        // console.log(data);

        if (data.erro == true) {
            alert('CEP ínvalido');
        }
        else{
            // Preenche os dados que dependem do CEP
            document.getElementById('estado-input').value = data.uf;
            document.getElementById('cidade-input').value = data.localidade;
            document.getElementById('bairro-input').value = data.bairro;
            document.getElementById('rua-input').value = data.logradouro;
        }
    }

    // console.log(res);
});


// =====================================================
// Obtendo o container
const container = document.getElementById('container');

// Clique no botão CONTINUAR (1ª div do cadastro)
document.getElementById('cadastro-btnContinuar').addEventListener('click', function (event) { // Identifica quando o usuário clicou no botão 'Continuar'
    event.preventDefault(); // Impede o envio
    
    const form = document.getElementById('form1');
    if (!form.checkValidity()) {
        form.reportValidity(); // Exibe mensagens de erro
        return;
    }


    // Verificando se as senhas são iguais
    const senha = document.getElementById('senha-input').value;
    const confirmarSenha = document.getElementById('confirmarsenha').value;
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem. Verifique e tente novamente.');
        return;
    }

    // Obtendo os dados do usuário
    const nome = document.getElementById('nome-input').value.trim();
    const sobrenome = document.getElementById('sobrenome-input').value.trim();
    novoUser.nome = nome;
    novoUser.nomecompleto = nome + ' ' + sobrenome;
    novoUser.CPF = document.getElementById('CPF').value;
    novoUser.nascimento = document.getElementById('nascimento-input').value;
    novoUser.email = document.getElementById('email-input').value.trim();
    novoUser.senha = document.getElementById('senha-input').value;

    // Movendo o container para exibir a 2ª parte do formulário
    container.classList.add('form2');
});

// Clique no botão VOLTAR (2ª div do cadastro)
document.getElementById('cadastro-btnVoltar').addEventListener('click', function (event) { // Identifica quando o usuário clicou no botão 'Continuar'
    event.preventDefault(); // Impede o envio do formulário

    // Movendo o container para exibir a 1ª parte do formulário
    container.classList.remove('form2');
});


// Clique no botão CADASTRAR (2ª div do cadastro)
document.getElementById('cadastro-btnCadastrar').addEventListener('click', function (event) { // Identifica quando o usuário clicou no botão 'Cadastrar'
    event.preventDefault(); // Impede o envio
    
    const form = document.getElementById('form2');
    if (!form.checkValidity()) {
        form.reportValidity(); // Exibe mensagens de erro
        return;
    }

    // Obtendo os dados do usuário
    novoUser.CEP = document.getElementById('CEP-input').value;
    novoUser.endereco.uf = document.getElementById('estado-input').value;
    novoUser.endereco.cidade = document.getElementById('cidade-input').value;
    novoUser.endereco.bairro = document.getElementById('bairro-input').value;
    novoUser.endereco.rua = document.getElementById('rua-input').value;
    novoUser.numerocasa = document.getElementById('numero-input').value.trim();
    novoUser.complemento = document.getElementById('complemento-input').value.trim();

    // console.log(novoUser);
    
    // Validando o CPF
    if (!novoUser.endereco.uf || novoUser.endereco.uf === 'undefined') {
        alert(`${novoUser.CPF} não corresponde a um endereço válido, tente novamente`);
        return;
    }
    else{
        // Fazendo cadastro
        let cadastrado = false;

        /* Consultando a API para cadastrar o User */
        fetch('http://10.84.6.135:3000/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUser)
        })
        .then(response => {
            /* Erro na resposta da API */
            if (!response.ok) {
                throw new Error('Erro ao enviar os dados');
            }
            return response.json();
        })
        .then(data => {
            /* Resposta da API */
            console.log('Resposta do servidor:', data);
            alert(data.mensagem);

            const login = {
                email: novoUser.email,
                senha: novoUser.senha
            }

            fetch('http://10.84.6.135:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(login)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar os dados');
                }
                return response.json();
            }).then(data => {
                console.log('Resposta do servidor:', data.mensagem);

                if (data.sucesso) {
                    console.log('Resposta do servidor:', data.usuario);
                    window.location.href = 'perfil.html'
                }
                else{
                    alert(data.mensagem);
                }
            })
            .catch(error => {
                console.error('Erro no envio:', error);
                alert('Houve um erro ao fazer Login. Tente novamente mais tarde.');
            });

        })
        .catch(error => {
            /* Caso a API não responda */
            console.error('Erro no envio:', error);
            Swal.fire({
                confirmButtonColor: '#0e5a91',
                title: 'Erro!',
                html: `<b>Houve um erro ao se comunicar com a API</b><br>Não será possível fazer login, cadastrar-se ou visualizar dados.`,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        });
        
    }
});


// =======================================================