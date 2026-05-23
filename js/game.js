let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let gameStarted = false;
let isMuted = localStorage.getItem('isMuted') === 'true';



/**
 * Prepares the canvas, controls and icons.
 */
function init() {
    canvas = document.querySelector("canvas");
    keyboard.btnPressEvents();
    document.addEventListener("fullscreenchange", updateFullscreenIcon);
    updateVolumeIcon();
}

/**
 * Creates a new game world and starts the background music.
 */
function startGame() {
    world = new World(canvas, keyboard, audioManager);
    world.isMuted = isMuted;
    audioManager.play('background');
    waitForGameToBeReady();
}

/**
 * Waits until the first game images are ready.
 */
function waitForGameToBeReady() {
    let checkReady = setInterval(() => {
        if (world.areStartAssetsLoaded()) {
            clearInterval(checkReady);
            hideStartScreen();
        }
    }, 25);
}

/**
 * Hides the start screen.
 */
function hideStartScreen() {
    document.getElementById('startScreen').style.display = 'none';
    document.querySelector('.legal-notice').style.display = 'none';
}

/**
 * Shows the start screen.
 */
function showStartScreen() {
    document.getElementById('startScreen').style.display = 'block';
    document.querySelector('.legal-notice').style.display = 'block';
}

/**
 * Starts the game or pauses it.
 */
function togglePlay() {
    if (!gameStarted) {
        startFirstGame();
        return;
    }
    togglePause();
}

/**
 * Starts the first game round.
 */
function startFirstGame() {
    startGame();
    setPlayIconToPause();
    gameStarted = true;
}

/**
 * Switches between pause and play.
 */
function togglePause() {
    if (world.isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

/**
 * Continues the paused game.
 */
function resumeGame() {
    world.resumeGame();
    setPlayIconToPause();
}

/**
 * Pauses the running game.
 */
function pauseGame() {
    world.pauseGame();
    setPlayIconToPlay();
}

/**
 * Shows the pause icon.
 */
function setPlayIconToPause() {
    document.getElementById('playIcon').src = "img/icon/pause.png";
}

/**
 * Shows the play icon.
 */
function setPlayIconToPlay() {
    document.getElementById('playIcon').src = "img/icon/play.png";
}

/**
 * Turns the game sound on or off.
 */
function toggleVolume() {
    let volumeIcon = document.getElementById('volumeIcon');
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    updateVolumeIcon();

    if (isMuted) {
        audioManager.mute();
    } else {
        audioManager.unmute();

        if (gameStarted && world && !world.isPaused) {
            audioManager.playMusic('background');
        }
    }
}

/**
 * Updates the volume icon.
 */
function updateVolumeIcon() {
    let volumeIcon = document.getElementById('volumeIcon');
    volumeIcon.src = isMuted
        ? "img/icon/volume_off.png"
        : "img/icon/volume_on.png";
}

/**
 * Opens or closes fullscreen mode.
 */
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

/**
 * Updates the fullscreen icon.
 */
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

/**
 * Stops the game and returns to the start screen.
 */
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

/**
 * Restarts the game after winning or losing.
 */
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

/**
 * Shows the legal notice.
 */
function showLegalNotice() {
    document.getElementById('legalNoticeOverlay').classList.remove('d_none');
}

/**
 * Hides the legal notice.
 */
function hideLegalNotice() {
    document.getElementById('legalNoticeOverlay').classList.add('d_none');
}

/**
 * Shows the instruction screen.
 */
function showInstructions() {
    document.getElementById('instructionsOverlay').classList.remove('d_none');
}

/**
 * Hides the instruction screen.
 */
function hideInstructions() {
    document.getElementById('instructionsOverlay').classList.add('d_none');
}
