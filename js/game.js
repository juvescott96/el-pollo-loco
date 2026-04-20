let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let isMuted = false;


function init() {
    canvas = document.querySelector("canvas");
    keyboard.btnPressEvents();

}

function startGame() {
    world = new World(canvas, keyboard, audioManager);
    world.isMuted = isMuted;
    audioManager.play('background');
    waitForGameToBeReady();
}

function waitForGameToBeReady() {
    let checkReady = setInterval(() => {
        if (world.areStartAssetsLoaded()) {
            clearInterval(checkReady);
            hideStartScreen();
        }
    }, 25);
}

function hideStartScreen() {
    document.getElementById('startScreen').style.display = 'none';
}

function togglePlay() {
    let playIcon = document.getElementById('playIcon');

    if (!gameStarted) {
        startGame();
        playIcon.src = "/img/icon/pause.png";
        gameStarted = true;
        return;
    }

    if (world.isPaused) {
        world.resumeGame();
        playIcon.src = "/img/icon/pause.png";
    } else {
        world.pauseGame();
        playIcon.src = "/img/icon/play.png";
    }
}

function toggleVolume() {
    let volumeIcon = document.getElementById('volumeIcon');

    isMuted = !isMuted;

    volumeIcon.src = isMuted
        ? "/img/icon/volume_off.png"
        : "/img/icon/volume_on.png";

    if (audioManager.isMuted) {
        audioManager.unmute();
    } else {
        audioManager.mute();
    }
}

