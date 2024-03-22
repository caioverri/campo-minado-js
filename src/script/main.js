const game = {
    values: {
        gameOver: false,
        numberSquares: 49,
        setedBombs: 3,
        square: [],
        countBombs: 0,
        score: 0,
        bestScore: 0,
        bestMinutes: 0,
        bestSeconds: 0,
        minutes: 0,
        seconds: 0,
        interval: null,
        bgsong: false,
    },

    toScreen: {
        scoreHtml: document.querySelector(".score"),
        minutesHtml: document.querySelector(".minutes"),
        secondsHtml: document.querySelector(".seconds"),
        replay: document.querySelector(".replay"),
    },
}

function resetGame() {
    game.toScreen.replay.onclick = replayGame;
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

function haveBomb(vector) {
    return game.values.square[vector].classList.contains("bomb");
}
// função que insere a classe bomb no square daquele vetor passado por parametro
function insertBomb(setBomb){
    game.values.square[setBomb].classList.add("bomb");
}

function updateMinutes() {
    game.values.minutes++;
    if(game.values.minutes < 10) {
        game.toScreen.minutesHtml.innerHTML = `0${game.values.minutes}`;
    } else {
        game.toScreen.minutesHtml.innerHTML = game.values.minutes;
    }

    if(game.values.minutes == 59){
        alert ("Tempo excedido");
    }
}

function updateSeconds() {
    if(game.values.gameOver === false) {
        game.values.seconds++;
        if(game.values.seconds < 10) {
            game.toScreen.secondsHtml.innerHTML = `0${game.values.seconds}`;
        } else {
            game.toScreen.secondsHtml.innerHTML = game.values.seconds;
        }

        if(game.values.seconds == 59){
            game.values.seconds = 0;
            updateMinutes();
        }
    }
}

function finalResults() {
    return `Your scored ${game.values.score} points in ${game.toScreen.minutesHtml.innerHTML} minutes and ${game.toScreen.secondsHtml.innerHTML} seconds. `
}



function startTime() {
    clearInterval(game.values.interval);
    game.values.interval = setInterval (() => {
        updateSeconds();
    }, 1000)
}

function bestResults() {
    if(game.values.bestScore <= game.values.score){
        if(game.values.bestMinutes <= game.values.minutes) {
            if(game.values.bestSeconds < game.values.seconds) {
                game.values.bestScore = game.values.score;
                if(game.values.seconds < 10) {
                    game.values.bestSeconds = `0${game.values.seconds}`;
                } else {
                    game.values.bestSeconds = game.values.seconds;
                }

                if(game.values.minutes < 10) {
                    game.values.bestMinutes = `0${game.values.minutes}`;
                } else {
                    game.values.bestMinutes = game.values.minutes;
                }                
            } else {
                game.values.bestScore = game.values.score;
            if(game.values.minutes < 10) {
                game.values.bestMinutes = `0${game.values.minutes}`;
            } else {
                game.values.bestMinutes = game.values.minutes;
            }                
            game.values.bestSeconds = game.values.seconds;
            }
        } else {
            game.values.bestScore = game.values.score
        }
    }
    return `Best score is ${game.values.bestScore} in ${game.values.bestMinutes} minutes and ${game.values.bestSeconds} seconds.`;
}

function openSquare() {
    if(!game.values.bgsong){
        game.values.bgsong = true;
        backgroundAudio();
    }
    if(!this.classList.contains("selected") && !game.values.gameOver) {
        if(this.classList.contains("bomb")) {
            setTimeout (() => playAudio("bomb",1), 250);
            game.values.gameOver = true;
            this.classList.add("selected");
            console.log("Bomb clicked!"); // Adicione esta linha para depuração
            setTimeout( () => alert ("Stepped on the bomb! " + finalResults() + bestResults()) , 700);
        } else {
            this.classList.add("selected");
            setTimeout (() => playAudio("point",0.3), 250);
            game.values.score++;
            game.toScreen.scoreHtml.innerHTML = `Score: ${game.values.score}`;
        }
    }
}

function squareCreator() {
    for (i = 0; i < game.values.numberSquares; i++) {
        game.values.square[i] = document.createElement("div");
        game.values.square[i].className = "square";
        game.values.square[i].onclick = openSquare;
        document.querySelector(".game").appendChild(game.values.square[i]);
    }
}

// insere a quantidade de setedBombs aleatoriamente
function bombFields() {
    while (game.values.countBombs < game.values.setedBombs) {
        let vector = Math.floor(Math.random() * game.values.numberSquares);
        if(!haveBomb(vector)){
            insertBomb(vector);
            game.values.countBombs++;
        }
    }
}

function replayGame(){
    for (i = 0; i < game.values.numberSquares; i++){
        game.values.square[i].classList.remove("selected");
        game.values.square[i].classList.remove("bomb");
    }

    game.values.gameOver = false;
    game.values.countBombs = 0;
    game.values.score = 0;
    game.toScreen.scoreHtml.innerHTML = "Score: 0";
    game.toScreen.minutesHtml.innerHTML = "00";
    game.toScreen.secondsHtml.innerHTML = "00";
    game.values.minutes = 0;
    game.values.seconds = 0;
    while (game.values.countBombs < game.values.setedBombs) {
        let vector = Math.floor(Math.random() * game.values.numberSquares);
        if(!haveBomb(vector)){
            insertBomb(vector);
            game.values.countBombs++;
        }
    }
}

function playGame() {
    startTime();
    squareCreator();
    bombFields();
    resetGame();
}

playGame();