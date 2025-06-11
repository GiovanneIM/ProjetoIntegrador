
const paginas = {
    "inicio": 'http://127.0.0.1:3000',
    "login": 'http://127.0.0.1:3000/paginas/pages-User/login.html',
    "perfil": 'http://127.0.0.1:3000/paginas/pages-User/perfil.html',
    "ajuda": 'http://127.0.0.1:3000/paginas/ajuda.html',
    "sobreNos": 'http://127.0.0.1:3000/paginas/sobre_nos.html',
    "busca": 'http://127.0.0.1:3000/paginas/busca.html',
}




const _links_ = document.getElementsByClassName('link_')
for (const link of _links_) {
    const pagina = link.getAttribute('data-link');
    // console.log(pagina)
    // console.log(paginas[pagina])
    link.href = paginas[pagina];
}