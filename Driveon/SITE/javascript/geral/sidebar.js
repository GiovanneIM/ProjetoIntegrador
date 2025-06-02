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
trilho.addEventListener('click', ()=>{
    trilho.classList.toggle('dark');
    body.classList.toggle('dark');

    if (claro){
        claro = false;
        document.getElementById('iconeTema').src = "../imagens/diversos/lua.png"
    }
    else{
        claro = true;
        document.getElementById('iconeTema').src = "../imagens/diversos/sol.png"
    }
    
})