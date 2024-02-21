document.getElementById('mostrarLista').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'flex';
});

document.getElementById('fecharLista').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
});


document.getElementById('overlay').addEventListener('click', function(event) {
    if (!document.getElementById('lista').contains(event.target)) {
        document.getElementById('overlay').style.display = 'none';
    }
});