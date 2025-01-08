class SoundManager {
    constructor() {
        if (SoundManager.instance) {
            return SoundManager.instance;
        }

        this.sounds = {};
        SoundManager.instance = this;
    }

    static getInstance() {
        return SoundManager.instance || new SoundManager();
    }

    loadSound(name, src) {
        const sound = new Audio(src);
        sound.volume = 0.03;
        this.sounds[name] = sound;
    }

    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            if (sound.paused || sound.ended) {
                sound.play();
            }
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    stop(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    loop(name, loop = true) {
        const sound = this.sounds[name];
        if (sound) {
            sound.loop = loop;
        } else {
            console.error(`Sound ${name} wurde nicht gefunden.`);
        }
    }

    playAll() {
        for (let soundName in this.sounds) {
            this.sounds[soundName].play();
        }
    }

    pauseAll() {
        for (let soundName in this.sounds) {
            this.sounds[soundName].pause();
        }
    }

    stopAll() {
        for (let soundName in this.sounds) {
            this.stop(soundName);
        }
    }

    loadStartSounds() {
        this.loadSound('walking', 'assets/sounds/walking.mp3');
        this.setVolume('walking', 0.08);
        this.loadSound('hurt', 'assets/sounds/hurt.mp3');
        this.setVolume('hurt', 0.08);
        this.loadSound('jumping', 'assets/sounds/jump.mp3');
        this.setVolume('jumping', 0.005);
        this.loadSound('throw', 'assets/sounds/throw.mp3');
        this.setVolume('throw', 0.3);
        this.loadSound('backgroundmusic', 'assets/sounds/background_music.mp3');
        this.setVolume('backgroundmusic', 0.02);
        this.loadSound('chicken', 'assets/sounds/chicken.mp3');
        this.loadSound('game_win', 'assets/sounds/game_win.mp3');
        this.loadSound('game_lose', 'assets/sounds/game_lose.mp3');
        this.loadSound('boss_chicken_start', 'assets/sounds/boss_chicken_start.mp3');
    }

    checkMusic(musicPaused) {
        if (musicPaused) {
            this.stop('backgroundmusic');
            this.loop('backgroundmusic', false);
            this.stop('chicken')
        } else {
            this.play('backgroundmusic');
            this.loop('backgroundmusic', true);
            this.play('chicken');
        }
    }
}
