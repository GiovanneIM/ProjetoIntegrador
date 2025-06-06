// Declarando variáveis 
const express = require('express');
const app = express();
const porta = 3000;


const session = require('express-session');         // Sessão de usuário
const path = require('path')                        // Definição de caminhos
const multer = require('multer');                   // Receber arquivos
const fs = require('fs');                           // Manipulação de arquivos



const f_dados = require('./banco/funcoesdados.js'); // Importando as funções para carregar e salvar usuários e veículos
const usuarios = f_dados.carregarUsuarios();                    // Carregando usuários do sistema
const veiculos = f_dados.carregarVeiculos();                    // Carregando veículos do sistema
const reservas = f_dados.carregarReservas();

// ============================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../SITE')));                                      // Disponibilizando as páginas do site
app.use('/imagens/padrao', express.static(path.join(__dirname, 'imagens/usuarios/padrao')));   // Disponibilizando a pasta de imagens padrões
app.use('/imagens/padrao', express.static(path.join(__dirname, 'imagens/veiculos')));          // Disponibilizando a pasta de imagens dos veiculos


app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24} // A sessão expira em 1 dia 
}));


// Verificando sessões
app.use((req, res, next) => {
  if (req.session.usuarioId) {
    req.usuario = usuarios.find(u => u.ID === req.session.usuarioId);
  }
  next();
});


// Define onde e como salvar as imagens de perfil dos usuários
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const pastaUsuario = path.join(__dirname, 'imagens', 'usuarios', String(req.session.usuarioId));
  
      // Cria a pasta do usuário se ela não existir
      fs.mkdirSync(pastaUsuario, { recursive: true });
  
      cb(null, pastaUsuario);
    },
    filename: (req, file, cb) => {
      const nomeUnico = Date.now() + '-' + req.session.usuarioId + path.extname(file.originalname);
      cb(null, nomeUnico);
    }
});
const upload = multer({ storage });


// USUÁRIOS

/* Lógica de VERIFICAR se há um usuário LOGADO */
app.get('/verificar-login', (req, res) => {
  // Verificando se há um usuário logado
  if (req.usuario) {
    // Respondendo que há um usuário logado e passando as informações dele
    res.json({ logado: true, usuario: req.usuario });
  } else {
    // Respondendo que não há um usuário logado
    res.json({ logado: false });
  }
});

/* Lógica de LOGIN */
app.post('/login', (req, res) => {
  // Obtendo os dados de login
  let userLogin = req.body;

  // Verifica se o usuário existe e se as infos de login estão corretas
  for (const user of usuarios) {
    // Verificando se o e-mail está registrado no sistema
    if(userLogin.email === user.email){
      // Verificando se a senha corresponde à do usuário com o e-mail correspondente
      if(userLogin.senha === user.senha){
        // O login foi bem sucedido
        userLogin = user;
        req.session.usuarioId = userLogin.ID;
        return res.json({ sucesso: true, mensagem: `Bem-vindo(a), ${userLogin.nome}`, usuario: userLogin});;
      } 
      else{
        // A senha está errada
        return res.json({ sucesso: false, mensagem: 'O E-mail e senha não correspondem.' });;
      }
    }
  }

  // Nenhum usuário com o e-mail foi encontrado
  return res.json({ sucesso: false, mensagem: 'Não existe usuário com o email inserido.' });
});

/* Lógica de CADASTRO */
app.post('/cadastrar', (req, res) => {
  // Obtendo os dados do novo usuário
  const novoUsuario = req.body;

  // Verifica se já existe um usuário cadastrado com o e-mail
  for (const user of usuarios) {
    if(novoUsuario.email === user.email){
      return res.json({ mensagem: 'O E-mail inserido já foi cadastrado' });
    }
  }

  // Adicionando o novo usuário ao arquivo que armazena as informações sobre os usuários
  novoUsuario.ID = usuarios.length;
  usuarios.push(novoUsuario);
  f_dados.salvarUsuarios(usuarios);

  // RESPOSTA
  res.json({ mensagem: 'Usuário cadastrado com sucesso! Volte à página de Login.' });
});

/* Lógica para ATUALIZAR DADOS */
app.post('/atualizardados', (req, res) => {
  if (!req.usuario) {
    return res.status(401).json({ mensagem: 'Você precisa estar logado para atualizar os dados.' });
  }

  // Obtendo os dados a serem atualizados
  const novosDados = req.body;
  const usuario = usuarios.find(u => u.ID === req.usuario.ID);


    for (const dado in novosDados) {
		if (dado === 'endereco') {
				for (const info in novosDados[dado]) {
					usuario[dado][info] = novosDados[dado][info];
				}
		}
		else { usuario[dado] = novosDados[dado]; }
    }

    f_dados.salvarUsuarios(usuarios);

    res.json({ mensagem: 'Dados atualizados com sucesso!', usuario });
});

/* Lógica para alterar a foto do usuário */
app.post('/alterar-foto', upload.single('foto'), (req, res) => {
    if (!req.usuario) {
      return res.status(401).json({ mensagem: 'Você precisa estar logado.' });
    }

    const usuario = usuarios.find(u => u.ID === req.usuario.ID);

    if (!req.file) {
        return res.status(400).send('Nenhuma imagem enviada.');
    }

    if (usuario.img && !usuario.img.includes('usuario.png')){
        const caminhoImagemAntiga = path.join(__dirname, usuario.img.replace(/^\//, ''));
        fs.unlink(caminhoImagemAntiga, err => {
            if (err) console.error('Erro ao apagar imagem antiga:', err);
        });
    }

    usuario.img = `/imagens/usuarios/${req.session.usuarioId}/${req.file.filename}`; // Caminho para a pasta onde está a imagem do usuário
    f_dados.salvarUsuarios(usuarios);
    console.log("imagem atualizada");
    res.json({nome_imagem: req.file.filename});
});


/* Lógica para acessar a imagem do usuário */
app.get('/imagens/usuarios/:id/:imagem', (req, res) => {
    const { id, imagem } = req.params;
  
    // Verifica se o usuário está logado e é o dono da imagem
    if (!req.session.usuarioId || String(req.session.usuarioId) !== id) {
      return res.status(403).send('Acesso negado');
    }
  
    const caminhoImagem = path.join(__dirname, 'imagens', 'usuarios', id, imagem);
    if (!fs.existsSync(caminhoImagem)) {
      return res.status(404).send('Imagem não encontrada');
    }
  
    res.sendFile(caminhoImagem);
});

/* Lógica para fazer LOGOUT */
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao encerrar a sessão.' });
    }

    // Limpa o cookie de sessão no cliente (se estiver usando o padrão `connect.sid`)
    res.clearCookie('connect.sid');

    return res.json({ mensagem: 'Logout realizado com sucesso.' });
  });
});



/* =============== Rotas de AGÊNCIAS ========================== */

// Rotas de AGÊNCIAS
const rotasAgencias = require('./rotas/rotasAgencias.js');
app.use('/agencias', rotasAgencias);
/* Acessadas por meio de http://IP_API/agencias/__(rota)___ */



/* =============== Rotas de VEÍCULOS ========================== */
// Rotas de VEÍCULOS
const rotasVeiculos = require('./rotas/rotasVeiculos.js');
app.use('/veiculos', rotasVeiculos);
/* Acessadas por meio de http://IP_API/veiculos/__(rota)___ */

/* Lógica para acessar a imagem do veiculo */
app.get('/imagens/veiculos/:imagem', (req, res) => {
  const { imagem } = req.params;

  // Verifica se o usuário está logado e é o dono da imagem

  const caminhoImagem = path.join(__dirname, 'imagens', 'veiculos', imagem);
  if (!fs.existsSync(caminhoImagem)) {
    return res.status(404).send('Imagem não encontrada');
  }

  res.sendFile(caminhoImagem);
});



/* =============== Rotas de RESERVAS ========================== */
// Rotas de RESERVAS
const rotasReservas = require('./rotas/rotasReservas.js');
app.use('/reservas', rotasReservas);
/* Acessadas por meio de http://IP_API/reservas/__(rota)___ */

/* Lógica para guardar a agência na qual o usuário está fazendo uma busca */
app.post('/fazerBusca', (req, res) => {
  req.usuario.busca = req.body.id;
});








// ============================================================

// Iniciando o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});

