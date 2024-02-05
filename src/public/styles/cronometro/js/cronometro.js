// cronometro.js

var cronometro = {
    hoursRemaining: 0,
    minutesRemaining: 0,
    isRunning: false,
    intervalId: null
};

// Carregar dados do localStorage se existirem
var storedCronometro = JSON.parse(localStorage.getItem('storedCronometro'));
if (storedCronometro) {
    cronometro = storedCronometro;
    updateCronometro();
}

function startCronometro(hours, minutes) {
    cronometro.hoursRemaining = hours;
    cronometro.minutesRemaining = minutes;
    cronometro.isRunning = true;

    // Salvar dados no localStorage
    localStorage.setItem('storedCronometro', JSON.stringify(cronometro));

    updateCronometro();
}

function updateCronometro() {
    cronometro.intervalId = setInterval(function() {
        if (cronometro.isRunning) {
            cronometro.hoursRemaining = Math.floor(cronometro.minutesRemaining / 60);
            cronometro.minutesRemaining = Math.floor(cronometro.minutesRemaining % 60);

            displayCronometro();

            if (cronometro.minutesRemaining <= 0 && cronometro.hoursRemaining <= 0) {
                stopCronometro();
            } else {
                cronometro.minutesRemaining--;
            }

            // Salvar dados no localStorage a cada atualização
            localStorage.setItem('storedCronometro', JSON.stringify(cronometro));
        }
    }, 1000);
}

function stopCronometro() {
    clearInterval(cronometro.intervalId);
    cronometro.isRunning = false;

    // Limpar dados do localStorage ao parar o cronômetro
    localStorage.removeItem('storedCronometro');
}

function displayCronometro() {
    var displayElement = document.getElementById("countdown-display");

    if (displayElement) {
        displayElement.innerHTML = "Tempo Restante: " + cronometro.hoursRemaining + " horas e " + cronometro.minutesRemaining + " minutos";
    }
}

startCronometro();
