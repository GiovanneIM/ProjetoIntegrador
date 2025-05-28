/*
    Função: Preencher campos com dados do usuário.

    Ex: Um campo que tiver a classe 'foto_user' é preenchido com 'usuario.imagem'

    CLASSE                  CONTEÚDO
    'nome_user'             NOME
    'nome-sobrenome_user'   NOME + " " + SOBRENOME
    'CPF_user'              CPF
    'telefone_user'         TELEFONE
    'nascimento_user'       DD/MM/AAAA
    'email_user'            EMAIL
    'CEP_user'              CEP
    'cidade-estado_user'    CIDADE + "-" + UF
    'bairro_user'           BAIRRO
    'rua_user'              RUA
    'numResidencia_user'    Nº da residência
    'compResidencia_user'   Complemento do endereço
    'CNH_user'              CNH
*/

const LOGIN = false;
const usuario = { 
    nome : "", 
    nomecompleto : "", 
    CPF: "", 
    telefone: "",
    nascimento : "", 
    email : "", 
    senha : "", 
    CEP : "",
    endereco : { uf : "", cidade : "", bairro : "", rua : "", numerocasa : "", complemento : "" },
    notifEmail : false,
    imagem : "",
    CNH : ""
};

// Verificando se há um usuário logado
fetch('http://127.0.0.1:3000/verificar-login', {
    method: 'GET',
    credentials: 'include' // Permite o uso de cookies da sessão
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar os dados');
    }
    return response.json();
}).then(data => {
    if (data.logado) {
        for (const chave in data.usuario) {
            if (chave == "endereco") {
                for (const dado in data.usuario.endereco) {
                    usuario.endereco[dado] = data.usuario.endereco[dado]
                }
            } else {
                usuario[chave] = data.usuario[chave];
            }
        }

        console.log(usuario)

        // Agora, com os dados do usuário:
        preencherCamposUsuario(usuario);

        // Mostrar/esconder seções
        alternarVisibilidade(true);
    } else {
        alternarVisibilidade(false);
        console.log("Sem usuário")
    }
})
.catch(error => {
    console.error('Erro no envio:', error);
    alert('Houve um erro ao fazer Login. Tente novamente mais tarde.');
});



function alternarVisibilidade(estaLogado) {
    const logado = document.getElementsByClassName('logado');
    const naoLogado = document.getElementsByClassName('naoLogado');

    for (const campo of logado) {
        campo.style.display = estaLogado ? 'block' : 'none';
    }
    for (const campo of naoLogado) {
        campo.style.display = estaLogado ? 'none' : 'block';
    }
}

// Função que preenche os campos com a classe 'classe' com o dado
// do usuario presente no atributo localizado em 'dadoUsuario'
function AtualizarDado(classe, dadoUsuario, valorPadrao) {
    const campos = document.getElementsByClassName(classe);

    const atributos = dadoUsuario.split('.')
    let valor = usuario
    for (const atributo of atributos) {
        valor = valor[atributo]
    }

    if (valor === "") {
        for (const campo of campos) {
            campo.textContent = valorPadrao;
            campo.placeholder = valorPadrao;
        }
    }
    else{
        for (const campo of campos) {
            campo.textContent = valor;
            campo.placeholder = valor;
        }
    }
}

function preencherCamposUsuario(usuario) {
    AtualizarDado("nome_user", "nome", "NomeUsuario");
    AtualizarDado("nome-sobrenome_user", "nomecompleto", "Nome e sobrenome");
    AtualizarDado("CPF_user", "CPF", "000.000.000-00");
    AtualizarDado("email_user", "email", "emaildousuario@dominio.com");
    AtualizarDado("telefone_user", "telefone", "(00) 00000-0000");
    AtualizarDado("CEP_user", "CEP", "00000-000");
    AtualizarDado("nascimento_user", "nascimento", "00/00/0000");
    AtualizarDado("CNH_user", "CNH", "");
    AtualizarDado("estado_user", "endereco.uf", "Estado");
    AtualizarDado("cidade_user", "endereco.cidade", "Cidade");
    AtualizarDado("bairro_user", "endereco.bairro", "Bairro");
    AtualizarDado("rua_user", "endereco.rua", "Rua");
    AtualizarDado("numResidencia_user", "numerocasa", "Número");
    AtualizarDado("compResidencia_user", "complemento", "Complemento");

    const campos_imagem = document.getElementsByClassName("foto_user");
    for (const campo of campos_imagem) {
        campo.src = usuario.img;
    }

    const campos_cidadeestado = document.getElementsByClassName("cidade-estado_user");
    for (const campo of campos_cidadeestado) {
        campo.textContent = (usuario.endereco.cidade && usuario.endereco.uf)
        ? `${usuario.endereco.cidade} - ${usuario.endereco.uf}`
        : "Cidade - UF";
    }
}


// <img src="http://120.0.0.1:3000/uploads/foto1.png" alt="Foto">




// Usuário de teste
// const usuario = { 
//     id_user : 1,
//     nome : "José", 
//     sobrenome : "Carlos Henrique", 
//     CPF: "123.456.789-10", 
//     telefone: "(11) 12345-6789",
//     nascimento : "02/08/2004", 
//     email : "josécarlos@gmail.com", 
//     senha : "12345", 
//     CEP : "12345-123",
//     endereco : { uf : "SP", cidade : "São Paulo", bairro : "Vila Brasil", rua : "Rua América", numerocasa : "123", complemento : "Ap 04" },
//     notifEmail : false,
//     imagem : "imagens/imagens-ParaTestes/fotoperfil-teste.jpg",
//     nascimento : "01/01/2000",
//     CNH : ""
// };