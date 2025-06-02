/* Troca a div com "Devolver em local diferente" por um input */
function trocarPorInput() {
    document.getElementById('local-diferente').style.display = 'none';
    document.getElementById('cidade-devolucao-div').style.display = 'flex';
    document.getElementById('cidade-devolucao').focus(); // opcional: foca no input automaticamente
}