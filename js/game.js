let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let isMuted = localStorage.getItem('isMuted') === 'true';



function init() {
    canvas = document.querySelector("canvas");
    keyboard.btnPressEvents();
    document.addEventListener("fullscreenchange", updateFullscreenIcon);
    updateVolumeIcon();
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
    document.querySelector('.legal-notice').style.display = 'none';
}

function showStartScreen() {
    document.getElementById('startScreen').style.display = 'block';
    document.querySelector('.legal-notice').style.display = 'block';
}

function togglePlay() {
    if (!gameStarted) {
        startFirstGame();
        return;
    }
    togglePause();
}

function startFirstGame() {
    startGame();
    setPlayIconToPause();
    gameStarted = true;
}

function togglePause() {
    if (world.isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function resumeGame() {
    world.resumeGame();
    setPlayIconToPause();
}

function pauseGame() {
    world.pauseGame();
    setPlayIconToPlay();
}

function setPlayIconToPause() {
    document.getElementById('playIcon').src = "img/icon/pause.png";
}

function setPlayIconToPlay() {
    document.getElementById('playIcon').src = "img/icon/play.png";
}

function toggleVolume() {
    let volumeIcon = document.getElementById('volumeIcon');
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    updateVolumeIcon();

    if (isMuted) {
        audioManager.mute();
    } else {
        audioManager.unmute();
    }
}

function updateVolumeIcon() {
    let volumeIcon = document.getElementById('volumeIcon');
    volumeIcon.src = isMuted
        ? "img/icon/volume_off.png"
        : "img/icon/volume_on.png";
}

function toggleFullscreen() {
    let elem = document.getElementById("fullscreen");

    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function updateFullscreenIcon() {
    let fullscreenIcon = document.getElementById("fullscreenIcon");

    if (document.fullscreenElement) {
        fullscreenIcon.src = "img/icon/fullscreen_exit.png";
        fullscreenIcon.alt = "exit fullscreen";
    } else {
        fullscreenIcon.src = "img/icon/fullscreen.png";
        fullscreenIcon.alt = "fullscreen";
    }
}

function backToHome() {
    if (world) {
        world.stopGame();
    }
    audioManager.stopAll();
    keyboard.reset();
    gameStarted = false;
    world = null;
    document.getElementById('gameOverScreen').classList.add('d_none');
    document.getElementById('gameWinScreen').classList.add('d_none');
    document.getElementById('playIcon').src = "img/icon/play.png";
    showStartScreen();
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function restartGame() {
    if (world) {
        world.stopGame();
    }
    audioManager.stopAll();
    keyboard.reset();
    document.getElementById('gameOverScreen').classList.add('d_none');
    document.getElementById('gameWinScreen').classList.add('d_none');
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    startFirstGame();
}

function showLegalNotice() {
    document.getElementById('legalNoticeOverlay').classList.remove('d_none');
}

function hideLegalNotice() {
    document.getElementById('legalNoticeOverlay').classList.add('d_none');
}

function showInstructions() {
    document.getElementById('instructionsOverlay').classList.remove('d_none');
}

function hideInstructions() {
    document.getElementById('instructionsOverlay').classList.add('d_none');
}

