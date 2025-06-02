/*
    CÓDIGO PARA FAZER LOGIN
*/


const form = document.getElementById('formulario-login');

document.getElementById('formulario-login').addEventListener('submit', function (event) { // Identifica quando o usuário clicou no botão 'Entrar'
    event.preventDefault(); // impede o envio tradicional

    const formData = new FormData(form);

    // Coleta os dados do formulário:
    const login = {
        email: formData.get('email').trim(),
        senha: formData.get('senha').trim()
    }

    // Consultando API
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
        Swal.fire({
            confirmButtonColor: '#0e5a91',
            title: 'Erro!',
            html: `<b>Houve um erro ao se comunicar com a API</b><br>Não será possível fazer login, cadastrar-se ou visualizar dados.`,
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    });
});