
const veiculos =[
    {
        agencia_ID: 1,
        imagem: '/imagens/veiculos/montana.png',
        marca: 'Chevrolet',
        modelo: 'Montana',
        preco: '110,75'
    }
]



fetch('http://127.0.0.1:3000/veiculos/registrarVeiculos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(veiculos)
})
.then(response => {
    if (!response.ok) {
        throw new Error('Erro ao enviar os dados');
    }
    return response.json();
}).then(data => {
    console.log('Resposta do servidor:', data.mensagem);
})
.catch(error => {
    console.error('Erro no envio:', error);
});