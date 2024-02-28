let gameOver = false;
const numberSquares = 49;
const setedBombs = 3;
let square = [];
let countBombs = 0;
let score = 0;
let bestScore = 0;
let bestMinutes = 0;
let bestSeconds = 0;
const scoreHtml = document.querySelector(".score");
const minutesHtml = document.querySelector(".minutes");
const secondsHtml = document.querySelector(".seconds");
let replay = document.querySelector(".replay"); 
let minutes = 0;
let seconds = 0;
let interval;
let bgsong = false;

// cria novos squares de acordo com o numero de squares
for (i = 0; i < numberSquares; i++) {
    square[i] = document.createElement("div");
    square[i].className = "square";
    square[i].onclick = openSquare;
    document.querySelector(".game").appendChild(square[i]);
}
// insere a quantidade de setedBombs aleatoriamente
while (countBombs < setedBombs) {
    let vector = Math.floor(Math.random() * numberSquares);
    if(!haveBomb(vector)){
        insertBomb(vector);
        countBombs++;
    }
}

replay.onclick = replayGame;

function replayGame(){
    for (i = 0; i < numberSquares; i++){
        square[i].classList.remove("selected");
        square[i].classList.remove("bomb");
    }

    gameOver = false;
    countBombs = 0;
    score = 0;
    scoreHtml.innerHTML = "Score: 0";
    minutesHtml.innerHTML = "00";
    secondsHtml.innerHTML = "00";
    minutes = 0;
    seconds = 0;
    while (countBombs < setedBombs) {
        let vector = Math.floor(Math.random() * numberSquares);
        if(!haveBomb(vector)){
            insertBomb(vector);
            countBombs++;
        }
    }
}

// funçãoo que análisa se há a classe bomb no square daquele vetor passado por parametro
function haveBomb(vector) {
    return square[vector].classList.contains("bomb");
}
// função que insere a classe bomb no square daquele vetor passado por parametro
function insertBomb(setBomb){
    square[setBomb].classList.add("bomb");
}
// executa ação
function openSquare() {
    if(!bgsong){
        bgsong = true;
        backgroundAudio();
    }
    if(!this.classList.contains("selected") && !gameOver) {
        if(this.classList.contains("bomb")) {
            setTimeout (() => playAudio("bomb",1), 250);
            gameOver = true;
            this.classList.add("selected");
            setTimeout( () => alert ("Stepped on the bomb! " + finalResults() + bestResults()) , 700);
        } else {
            this.classList.add("selected");
            setTimeout (() => playAudio("point",0.3), 250);
            score++;
            scoreHtml.innerHTML = `Score: ${score}`;
        }
    }
}

function updateMinutes() {
    minutes++;
    if(minutes < 10) {
        minutesHtml.innerHTML = `0${minutes}`;
    } else {
        minutesHtml.innerHTML = minutes;
    }

    if(minutes == 59){
        alert ("Tempo excedido");
    }
}

function updateSeconds() {
    if(gameOver === false) {
        seconds++;
        if(seconds < 10) {
            secondsHtml.innerHTML = `0${seconds}`;
        } else {
            secondsHtml.innerHTML = seconds;
        }

        if(seconds == 59){
            seconds = 0;
            updateMinutes();
        }
    }
}

function startTime() {
    clearInterval(interval);
    interval = setInterval (() => {
        updateSeconds();
    }, 1000)
}

function finalResults() {
    return `Your scored ${score} points in ${minutesHtml.innerHTML} minutes and ${secondsHtml.innerHTML} seconds. `
}



function bestResults() {
    if(bestScore <= score){
        if(bestMinutes <= minutes) {
            if(bestSeconds < seconds) {
                bestScore = score;
                if(seconds < 10) {
                    bestSeconds = `0${seconds}`;
                } else {
                    bestSeconds = seconds;
                }

                if(minutes < 10) {
                    bestMinutes = `0${minutes}`;
                } else {
                    bestMinutes = minutes;
                }                
            } else {
            bestScore = score;
            if(minutes < 10) {
                bestMinutes = `0${minutes}`;
            } else {
                bestMinutes = minutes;
            }                
            bestSeconds = seconds;
            }
        } else {
            bestScore = score
        }
    }
    return `Best score is ${bestScore} in ${bestMinutes} minutes and ${bestSeconds} seconds.`;
}

function playAudio(name, volume){
    const audio = new Audio(`./src/music/${name}.mp3`);
    audio.volume = volume;
    audio.play();
}

function backgroundAudio (){
        const bgAudio = new Audio(`./src/music/music.mp3`);
        bgAudio.volume = 0.7;
        bgAudio.loop = true;
        bgAudio.play();
    }

startTime();