function openSidebar() {
    document.getElementById("sidebar").style.transform = "translateX(0px)";
    document.getElementById("overlay").style.display = "block";
}

function closeSidebar() {
    document.getElementById("sidebar").style.transform = "translateX(-280px)";
    document.getElementById("overlay").style.display = "none";
}

window.addEventListener('scroll', function () {
    const barra = document.getElementById('barraFixada');
    if (window.scrollY > 90) { // só aparece após rolar 90px
        barra.style.transform = 'translateY(0px)';
    } else {
        barra.style.transform = 'translateY(-71px)';
    }
});







// Altera o tema

let trilho = document.getElementById('trilho');
let body = document.querySelector('body');

let claro = true
trilho.addEventListener('click', () => {
    trilho.classList.toggle('dark');
    body.classList.toggle('dark');

    if (claro) {
        claro = false;
        document.getElementById('iconeTema').src = "../imagens/diversos/lua.png"
        document.getElementById('logo_DriveOn').src = "../imagens/logo/logo-txtbranco.png"

        document.getElementById('imagem_logo').src = "../imagens/logo/logo-txtbranco.png"
        document.getElementById('paragrafo-footer');


        const links = document.getElementsByClassName('footer_link');
        for (const link of links) {
            link.style.color = 'white'

            let titulos = document.getElementsByClassName("titulo")
            for (const titulo of titulos) {
                titulo.style.color = "#FFFF"
            }

            let paragrafos =document.getElementsByClassName('paragrafo-footer')
            for(const paragrafo of paragrafos){
                paragrafo.style.color = "white"
            }

            let imagens = document.getElementsByClassName("imagem-1")
            for(const imagem of imagens){
                imagem.getElementsByClassName = "../imagens/logo/logo-txtpreto.png"
            }
        }
    }

    else {
        claro = true;
        document.getElementById('iconeTema').src = "../imagens/diversos/sol.png"
        document.getElementById('logo_DriveOn').src = "../imagens/logo/logo-txtpreto.png"

        document.getElementById('imagem_logo').src = "../imagens/logo/logo-txtpreto.png"


        const links = document.getElementsByClassName('footer_link');
        for (const link of links) {
            link.style.color = 'black'
        }
    }

})