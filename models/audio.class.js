class AudioManager {

    sounds = {};
    isMuted = localStorage.getItem('isMuted') === 'true';

    /**
     * Creates the audio manager and loads sounds.
     */
    constructor() {
        this.loadSounds();
    }

    /**
     * Loads all game sounds.
     */
    loadSounds() {
        this.sounds['background'] = new Audio('audio/background-sound.mp3');
        this.sounds['splash'] = new Audio('audio/splash.mp3');
        this.sounds['throw'] = new Audio('audio/throw.mp3');
        this.sounds['jump'] = new Audio('audio/jump.mp3');
        this.sounds['chicken-death'] = new Audio('audio/chicken-death.mp3');
        this.sounds['chicken-hurt'] = new Audio('audio/chicken-hurt.mp3');
        this.sounds['hurt'] = new Audio('audio/hurt.mp3');
        this.sounds['throw-collect'] = new Audio('audio/throw-collect.mp3');
        this.sounds['winner'] = new Audio('audio/winner.mp3');
        this.sounds['gameover'] = new Audio('audio/gameover.mp3');
        this.sounds['coins'] = new Audio('audio/coins.mp3');

        this.sounds['background'].volume = 0.2;
        this.sounds['splash'].volume = 1;
        this.sounds['throw'].volume = 1;
        this.sounds['jump'].volume = 1;
        this.sounds['chicken-death'].volume = 1;
        this.sounds['chicken-hurt'].volume = 1;
        this.sounds['hurt'].volume = 0.5;
        this.sounds['throw-collect'].volume = 1;
        this.sounds['winner'].volume = 1;
        this.sounds['gameover'].volume = 1;
        this.sounds['coins'].volume = 1;

        this.sounds['background'].loop = true;
    }

    /**
     * Plays a sound from the start.
     */
    play(name) {
        if (this.isMuted) return;

        let sound = this.sounds[name];
        if (!sound) return;

        sound.currentTime = 0;
        sound.play().catch((error) => {
            console.log('Audio Fehler:', error);
        });
    }

    /**
     * Plays music without restarting it.
     */
    playMusic(name) {
        if (this.isMuted) return;

        let sound = this.sounds[name];
        if (!sound) return;

        sound.play().catch((error) => {
            console.log('Audio Fehler:', error);
        });
    }

    /**
     * Stops one sound.
     */
    stop(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Stops all sounds.
     */
    stopAll() {
        Object.values(this.sounds).forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Mutes all sounds.
     */
    mute() {
        this.isMuted = true;
        this.pauseAll();
    }

    /**
     * Turns sound back on.
     */
    unmute() {
        this.isMuted = false;
    }

    /**
     * Pauses one sound.
     */
    pause(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
    }

    /**
     * Pauses all sounds.
     */
    pauseAll() {
        Object.values(this.sounds).forEach((sound) => {
            sound.pause();
        });
    }
}