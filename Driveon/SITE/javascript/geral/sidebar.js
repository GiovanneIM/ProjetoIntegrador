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


// Obtendo as logos com texto
const logos_txt = document.getElementsByClassName('logo_DriveOn_txt')


let claro = true
trilho.addEventListener('click', () => {
    trilho.classList.toggle('dark');
    // body.classList.toggle('dark');

    if (claro) {
        claro = false;

        // Alterando cor de fundo do body
        body.style.backgroundColor = 'rgb(28,28,28)';

        // Alterando icone do seletor de tema
        document.getElementById('iconeTema').src = "../imagens/diversos/lua.png";

        // Alterando as imagens da logo com texto
        alterarLogoTXT();

        // Alterando elementos do footer
        const elementos_footer = document.querySelectorAll('[class*="footer_"]');
        elementos_footer.forEach(el => {
            switch (el.className) {
                case 'footer_div':
                    el.style.color = 'gold';
                    break;
                
                case 'footer_link':
                    el.style.color = 'white';
                    break;
            }
        });

        const titulos = document.getElementsByClassName('titulo');
        for (var titulo of titulos) {
            titulo.style.color = 'gold';
        }

        alterarPagina();
        
    }
    else {
        claro = true;

        // Alterando cor de fundo do body
        body.style.backgroundColor = '#fafbfc';

        // Alterando icone do seletor de tema
        document.getElementById('iconeTema').src = "../imagens/diversos/sol.png"

        // Alterando as imagens da logo com texto
        alterarLogoTXT();

        // Alterando elementos do footer
        const elementos_footer = document.querySelectorAll('[class*="footer_"]');
        elementos_footer.forEach(el => {
            switch (el.className) {
                case 'footer_div':
                    el.style.color = '#575756'
                    break;

                case 'footer_link':
                        el.style.color = 'black'
                        break;

                default:
                    break;
            }
        });

        const titulos = document.getElementsByClassName('titulo');
        for (var titulo of titulos) {
            titulo.style.color = 'black';
        }

        alterarPagina();
      
    }

})


function alterarLogoTXT() {
    let imagem;

    if (claro) {
        imagem = "../imagens/logo/logo-txtpreto.png";
    }
    else {
        imagem = "../imagens/logo/logo-txtbranco.png"
    }

    for (const logo of logos_txt) {
        logo.src = imagem
    }
}


function alterarPagina() {
    const classesBeP = [];

    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
        classesBeP.push('estado', 'agencia-endereco', 'agencia-CEP');
    }


    for (const classe of classesBeP) {
        const elementos = document.getElementsByClassName(classe)
        for (const elemento of elementos) {
            elemento.style.color = claro? 'black':'white';
        }
    }
}
