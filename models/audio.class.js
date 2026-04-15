class AudioManager {

    sounds = {};
    isMuted = false;

    constructor() {
        this.loadSounds();
    }

    loadSounds() {
        this.sounds['background'] = new Audio('audio/background-sound.mp3');
        this.sounds['splash'] = new Audio('audio/splash.mp3');
        this.sounds['throw'] = new Audio('audio/throw.mp3');
        this.sounds['jump'] = new Audio('audio/jump.mp3');

        this.sounds['background'].volume = 0.5;
        this.sounds['splash'].volume = 0.5;
        this.sounds['throw'].volume = 0.5;
        this.sounds['jump'].volume = 1;


        this.sounds['background'].loop = true;
    }

    play(name) {
        if (this.isMuted) return;

        let sound = this.sounds[name];
        if (!sound) return;

        sound.currentTime = 0;
        sound.play().catch((error) => {
            console.log('Audio Fehler:', error);
        });
    }

    playMusic(name) {
        if (this.isMuted) return;

        let sound = this.sounds[name];
        if (!sound) return;

        sound.play().catch((error) => {
            console.log('Audio Fehler:', error);
        });
    }

    stop(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
    }

    stopAll() {
        Object.values(this.sounds).forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    mute() {
        this.isMuted = true;
        this.pauseAll();
    }

    unmute() {
        this.isMuted = false;
        this.playMusic('background');
    }


    pause(name) {
        let sound = this.sounds[name];
        if (!sound) return;

        sound.pause();
    }
    pauseAll() {
        Object.values(this.sounds).forEach((sound) => {
            sound.pause();
        });
    }



}